using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LeetClone_Backend.Models;

    public class Problema
{
    public int Id { get; set; }
    public string Titulo { get; set; }
    public string Descricao { get; set; }
    public string Dificuldade { get; set; } 
    public string CodeTemplate { get; set; } // O código inicial no editor

    public ICollection<TestCase> TestCases { get; set; }

}