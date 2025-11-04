using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeetClone_Backend.Models
{
   public class TestCase
{
    public int Id { get; set; }
    public string Input { get; set; }
    public string OutputSolucao { get; set; }

    public int ProblemaId { get; set; } // Chave estrangeira
    public Problema Problema { get; set; } // Propriedade de navegação
}
}