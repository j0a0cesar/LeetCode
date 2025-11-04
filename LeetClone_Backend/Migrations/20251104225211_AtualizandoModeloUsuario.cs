using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LeetCloneBackend.Migrations
{
    /// <inheritdoc />
    public partial class AtualizandoModeloUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Envios_Problems_ProblemaId",
                table: "Envios");

            migrationBuilder.DropForeignKey(
                name: "FK_TestCases_Problems_ProblemaId",
                table: "TestCases");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Problems",
                table: "Problems");

            migrationBuilder.RenameTable(
                name: "Problems",
                newName: "Problemas");

            migrationBuilder.RenameColumn(
                name: "PasswordHash",
                table: "Usuarios",
                newName: "Senha");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Usuarios",
                newName: "NomeCompleto");

            migrationBuilder.RenameColumn(
                name: "EnvioData",
                table: "Envios",
                newName: "DataEnvio");

            migrationBuilder.AddColumn<string>(
                name: "Genero",
                table: "Usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Problemas",
                table: "Problemas",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Envios_Problemas_ProblemaId",
                table: "Envios",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Envios_Problemas_ProblemaId",
                table: "Envios");

            migrationBuilder.DropForeignKey(
                name: "FK_TestCases_Problemas_ProblemaId",
                table: "TestCases");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Problemas",
                table: "Problemas");

            migrationBuilder.DropColumn(
                name: "Genero",
                table: "Usuarios");

            migrationBuilder.RenameTable(
                name: "Problemas",
                newName: "Problems");

            migrationBuilder.RenameColumn(
                name: "Senha",
                table: "Usuarios",
                newName: "PasswordHash");

            migrationBuilder.RenameColumn(
                name: "NomeCompleto",
                table: "Usuarios",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "DataEnvio",
                table: "Envios",
                newName: "EnvioData");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Problems",
                table: "Problems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Envios_Problems_ProblemaId",
                table: "Envios",
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
    }
}
