using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeetClone_Backend.DTOs
{
    // DTO para signup - apenas os dados necessários que o usuário fornece
    public record SignupRequest(
        string NomeCompleto, 
        string Username, 
        string Senha, 
        string Genero
    );

    // DTO para login - apenas credenciais
    public record LoginRequest(
        string Username, 
        string Senha
    );

    // DTO para resposta de login - inclui o token JWT
    public record LoginResponse(
        int Id, 
        string NomeCompleto, 
        string Username, 
        string Genero, 
        string Token
    );

    // DTO para resposta do usuário (sem senha)
    public record UsuarioResponse(
        int Id, 
        string NomeCompleto, 
        string Username, 
        string Genero
    );

    // DTO para criação de envio - sem usuarioId (vem do token)
    public record EnvioRequest(
        string UserCode, 
        string Linguagem, 
        int ProblemaId
    );
}