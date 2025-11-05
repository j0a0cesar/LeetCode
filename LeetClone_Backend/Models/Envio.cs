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
        public string Status { get; set; } 
        public DateTime DataEnvio { get; set; }

        // Chave estrangeira 
        public int ProblemaId { get; set; }
        
        public Problema Problema { get; set; }
    }
}