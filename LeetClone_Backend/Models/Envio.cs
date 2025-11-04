using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeetClone_Backend.Models
{
    public class Envio
{
    public int Id { get; set; }
    public string UserCode { get; set; }
    public string Status { get; set; } // Ex: "Aceito", "Errado", "Erro de Compilação"
    public DateTime DataEnvio  { get; set; }

    public int ProblemId { get; set; } // Chave estrangeira
    public Problema Problema { get; set; } 
}
}