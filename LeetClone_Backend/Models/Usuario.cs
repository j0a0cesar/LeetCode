using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeetClone_Backend.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string NomeCompleto { get; set; } 
        public string Username { get; set; } 
        public string Senha { get; set; }
        public string Genero { get; set; }
    }
}