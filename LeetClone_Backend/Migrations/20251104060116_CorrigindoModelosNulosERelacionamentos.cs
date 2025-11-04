using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeetCloneBackend.Migrations
{
    /// <inheritdoc />
    public partial class CorrigindoModelosNulosERelacionamentos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_Problemas_ProblemaId",
                table: "Submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_TestCases_Problemas_ProblemaId",
                table: "TestCases");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Problemas",
                table: "Problemas");

            migrationBuilder.RenameTable(
                name: "Problemas",
                newName: "Problems");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Problems",
                table: "Problems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_Problems_ProblemaId",
                table: "Submissions",
                column: "ProblemaId",
                principalTable: "Problems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TestCases_Problems_ProblemaId",
                table: "TestCases",
                column: "ProblemaId",
                principalTable: "Problems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Submissions_Problems_ProblemaId",
                table: "Submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_TestCases_Problems_ProblemaId",
                table: "TestCases");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Problems",
                table: "Problems");

            migrationBuilder.RenameTable(
                name: "Problems",
                newName: "Problemas");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Problemas",
                table: "Problemas",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Submissions_Problemas_ProblemaId",
                table: "Submissions",
                column: "ProblemaId",
                principalTable: "Problemas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TestCases_Problemas_ProblemaId",
                table: "TestCases",
                column: "ProblemaId",
                principalTable: "Problemas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
