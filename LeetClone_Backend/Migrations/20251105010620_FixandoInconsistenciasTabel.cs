using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeetCloneBackend.Migrations
{
    /// <inheritdoc />
    public partial class FixandoInconsistenciasTabel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProblemId",
                table: "Envios");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProblemId",
                table: "Envios",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
