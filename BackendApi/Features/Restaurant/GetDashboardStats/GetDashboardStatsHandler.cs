using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace BackendApi.Features.Restaurant.GetDashboardStats;

public class GetDashboardStatsHandler(ApplicationDbContext context) : IQueryHandler<GetDashboardStatsQuery, DashboardStatsResult>
{
    public async Task<DashboardStatsResult> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
    {
        var startDate = DateTime.UtcNow.AddDays(-request.Days).Date;
        var endDate = DateTime.UtcNow.Date.AddDays(1); // Include today

        // Get all orders for the restaurant in the time period
        var orders = await context.Orders
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
            .Where(o => o.RestaurantId == request.RestaurantId 
                     && o.CreatedAt >= startDate 
                     && o.CreatedAt < endDate
                     && o.Status != Entities.OrderStatus.Cancelled)
            .ToListAsync(cancellationToken);

        // Calculate top menu items
        var topMenuItems = orders
            .SelectMany(o => o.OrderItems)
            .GroupBy(oi => new { oi.MenuItemId, oi.MenuItem.Name })
            .Select(g => new TopMenuItem
            {
                MenuItemId = g.Key.MenuItemId,
                MenuItemName = g.Key.Name,
                TotalQuantitySold = g.Sum(oi => oi.Quantity),
                TotalRevenue = g.Sum(oi => oi.PriceAtOrder * oi.Quantity)
            })
            .OrderByDescending(x => x.TotalQuantitySold)
            .Take(10)
            .ToList();

        // Calculate daily order stats
        var dailyOrders = orders
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new DailyOrderStats
            {
                Date = g.Key,
                OrderCount = g.Count(),
                ItemCount = g.SelectMany(o => o.OrderItems).Sum(oi => oi.Quantity)
            })
            .OrderBy(x => x.Date)
            .ToList();

        // Calculate daily revenue
        var dailyRevenue = orders
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new DailyRevenueStats
            {
                Date = g.Key,
                Revenue = g.SelectMany(o => o.OrderItems).Sum(oi => oi.PriceAtOrder * oi.Quantity)
            })
            .OrderBy(x => x.Date)
            .ToList();

        // Calculate weekly order stats
        var calendar = CultureInfo.CurrentCulture.Calendar;
        var weeklyOrders = orders
            .GroupBy(o => new
            {
                Year = calendar.GetYear(o.CreatedAt),
                Week = calendar.GetWeekOfYear(o.CreatedAt, CalendarWeekRule.FirstDay, DayOfWeek.Monday)
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Week,
                Orders = g.ToList()
            })
            .Select(g => new WeeklyOrderStats
            {
                Year = g.Year,
                WeekNumber = g.Week,
                WeekStartDate = GetWeekStartDate(g.Year, g.Week),
                OrderCount = g.Orders.Count,
                ItemCount = g.Orders.SelectMany(o => o.OrderItems).Sum(oi => oi.Quantity)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.WeekNumber)
            .ToList();

        // Calculate weekly revenue
        var weeklyRevenue = orders
            .GroupBy(o => new
            {
                Year = calendar.GetYear(o.CreatedAt),
                Week = calendar.GetWeekOfYear(o.CreatedAt, CalendarWeekRule.FirstDay, DayOfWeek.Monday)
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Week,
                Orders = g.ToList()
            })
            .Select(g => new WeeklyRevenueStats
            {
                Year = g.Year,
                WeekNumber = g.Week,
                WeekStartDate = GetWeekStartDate(g.Year, g.Week),
                Revenue = g.Orders.SelectMany(o => o.OrderItems).Sum(oi => oi.PriceAtOrder * oi.Quantity)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.WeekNumber)
            .ToList();

        // Calculate monthly order stats
        var monthlyOrders = orders
            .GroupBy(o => new
            {
                Year = o.CreatedAt.Year,
                Month = o.CreatedAt.Month
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                Orders = g.ToList()
            })
            .Select(g => new MonthlyOrderStats
            {
                Year = g.Year,
                Month = g.Month,
                MonthStartDate = new DateTime(g.Year, g.Month, 1),
                OrderCount = g.Orders.Count,
                ItemCount = g.Orders.SelectMany(o => o.OrderItems).Sum(oi => oi.Quantity)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToList();

        // Calculate monthly revenue
        var monthlyRevenue = orders
            .GroupBy(o => new
            {
                Year = o.CreatedAt.Year,
                Month = o.CreatedAt.Month
            })
            .Select(g => new
            {
                g.Key.Year,
                g.Key.Month,
                Orders = g.ToList()
            })
            .Select(g => new MonthlyRevenueStats
            {
                Year = g.Year,
                Month = g.Month,
                MonthStartDate = new DateTime(g.Year, g.Month, 1),
                Revenue = g.Orders.SelectMany(o => o.OrderItems).Sum(oi => oi.PriceAtOrder * oi.Quantity)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToList();

        // Calculate overall stats
        var totalRevenue = orders.SelectMany(o => o.OrderItems).Sum(oi => oi.PriceAtOrder * oi.Quantity);
        var totalOrders = orders.Count;
        var totalItemsSold = orders.SelectMany(o => o.OrderItems).Sum(oi => oi.Quantity);
        var averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return new DashboardStatsResult
        {
            TopMenuItems = topMenuItems,
            DailyOrders = dailyOrders,
            DailyRevenue = dailyRevenue,
            WeeklyOrders = weeklyOrders,
            WeeklyRevenue = weeklyRevenue,
            MonthlyOrders = monthlyOrders,
            MonthlyRevenue = monthlyRevenue,
            Overall = new OverallStats
            {
                TotalOrders = totalOrders,
                TotalItemsSold = totalItemsSold,
                TotalRevenue = totalRevenue,
                AverageOrderValue = averageOrderValue
            }
        };
    }

    private static DateTime GetWeekStartDate(int year, int weekNumber)
    {
        var jan1 = new DateTime(year, 1, 1);
        var daysOffset = DayOfWeek.Monday - jan1.DayOfWeek;
        var firstMonday = jan1.AddDays(daysOffset);
        
        var calendar = CultureInfo.CurrentCulture.Calendar;
        var firstWeek = calendar.GetWeekOfYear(jan1, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
        
        if (firstWeek == 1)
        {
            return firstMonday.AddDays((weekNumber - 1) * 7);
        }
        else
        {
            return firstMonday.AddDays((weekNumber) * 7);
        }
    }
}

