using System;

namespace LeetClone_Backend.Models
{
    public class Envio
    {
        public int Id { get; set; }
        public string UserCode { get; set; } // Código enviado (renomeie para Codigo se preferir)
        public string Status { get; set; } // "Aceito", "Erro", etc.
        public DateTime DataEnvio { get; set; }
        public string Linguagem { get; set; } // NOVO: javascript, python, etc.
        
        // Chave estrangeira para Problema
        public int ProblemaId { get; set; }
        public Problema Problema { get; set; }
        
        // NOVO: Chave estrangeira para Usuario
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}