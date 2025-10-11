using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

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
            Overall = new OverallStats
            {
                TotalOrders = totalOrders,
                TotalItemsSold = totalItemsSold,
                TotalRevenue = totalRevenue,
                AverageOrderValue = averageOrderValue
            }
        };
    }
}

