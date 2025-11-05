using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using LeetClone_Backend.Models;

namespace LeetClone_Backend.Helpers
{
    public static class JwtHelper
    {
        public static string GerarTokenJWT(Usuario usuario, string jwtKey)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.ASCII.GetBytes(jwtKey);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Username),
                new Claim("NomeCompleto", usuario.NomeCompleto)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
