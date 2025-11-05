using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeetCloneBackend.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Linguagem",
                table: "Envios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Envios",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Envios_UsuarioId",
                table: "Envios",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Envios_Usuarios_UsuarioId",
                table: "Envios",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Envios_Usuarios_UsuarioId",
                table: "Envios");

            migrationBuilder.DropIndex(
                name: "IX_Envios_UsuarioId",
                table: "Envios");

            migrationBuilder.DropColumn(
                name: "Linguagem",
                table: "Envios");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Envios");
        }
    }
}
