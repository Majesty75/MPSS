using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MPSSApi.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddedQuantityInParts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PurchaseId",
                table: "Records",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Parts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Parts");

            migrationBuilder.AlterColumn<int>(
                name: "PurchaseId",
                table: "Records",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
