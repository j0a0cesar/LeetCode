using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeetCloneBackend.Migrations
{
    /// <inheritdoc />
    public partial class RenomeandoEnviosEAdicionandoUsuarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_Problems_ProblemaId",
                table: "Submissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Submissions",
                table: "Submissions");

            migrationBuilder.RenameTable(
                name: "Submissions",
                newName: "Envios");

            migrationBuilder.RenameIndex(
                name: "IX_Submissions_ProblemaId",
                table: "Envios",
                newName: "IX_Envios_ProblemaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Envios",
                table: "Envios",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Envios_Problems_ProblemaId",
                table: "Envios",
                column: "ProblemaId",
                principalTable: "Problems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Envios_Problems_ProblemaId",
                table: "Envios");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Envios",
                table: "Envios");

            migrationBuilder.RenameTable(
                name: "Envios",
                newName: "Submissions");

            migrationBuilder.RenameIndex(
                name: "IX_Envios_ProblemaId",
                table: "Submissions",
                newName: "IX_Submissions_ProblemaId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Submissions",
                table: "Submissions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_Problems_ProblemaId",
                table: "Submissions",
                column: "ProblemaId",
                principalTable: "Problems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
