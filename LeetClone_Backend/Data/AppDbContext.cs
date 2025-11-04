using LeetClone_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace LeetClone_Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Problema> Problemas { get; set; }
        public DbSet<TestCase> TestCases { get; set; }
        public DbSet<Envio> Envios { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        // Aqui você pode configurar os relacionamentos, se necessário
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Ex: Configurando o relacionamento 1-para-Muitos entre Problem e TestCase
            modelBuilder.Entity<Problema>()
                .HasMany(p => p.TestCases)
                .WithOne(t => t.Problema)
                .HasForeignKey(t => t.ProblemaId);
        }
    }
}