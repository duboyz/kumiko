using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStripePriceConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "StripePriceIdMonthly", "StripePriceIdYearly" },
                values: new object[] { new DateTime(2025, 11, 12, 17, 30, 37, 187, DateTimeKind.Utc).AddTicks(2310), null, null });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "CreatedAt", "StripePriceIdMonthly", "StripePriceIdYearly" },
                values: new object[] { new DateTime(2025, 11, 12, 17, 30, 37, 187, DateTimeKind.Utc).AddTicks(2320), null, null });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "StripePriceIdMonthly", "StripePriceIdYearly" },
                values: new object[] { new DateTime(2025, 11, 12, 17, 30, 37, 187, DateTimeKind.Utc).AddTicks(2320), null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "CreatedAt", "StripePriceIdMonthly", "StripePriceIdYearly" },
                values: new object[] { new DateTime(2025, 11, 12, 17, 16, 33, 122, DateTimeKind.Utc).AddTicks(1980), "price_1QJy6tRsePuJe49XRwxjIXBr", "price_1QJy6tRsePuJe49XfT5UGKBl" });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "CreatedAt", "StripePriceIdMonthly", "StripePriceIdYearly" },
                values: new object[] { new DateTime(2025, 11, 12, 17, 16, 33, 122, DateTimeKind.Utc).AddTicks(1990), "price_1QJy7YRsePuJe49XNWlGMJqV", "price_1QJy7YRsePuJe49X5cEKyIQi" });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "CreatedAt", "StripePriceIdMonthly", "StripePriceIdYearly" },
                values: new object[] { new DateTime(2025, 11, 12, 17, 16, 33, 122, DateTimeKind.Utc).AddTicks(1990), "price_1QJy8ARsePuJe49X6xxfqRHb", "price_1QJy8ARsePuJe49XazFRO0J8" });
        }
    }
}
