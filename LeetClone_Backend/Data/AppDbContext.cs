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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuração dos nomes das tabelas (para garantir consistência)
            modelBuilder.Entity<Problema>().ToTable("Problemas");
            modelBuilder.Entity<TestCase>().ToTable("TestCases");
            modelBuilder.Entity<Envio>().ToTable("Envios");
            modelBuilder.Entity<Usuario>().ToTable("Usuarios");

            // Configuração do relacionamento 1-para-Muitos entre Problema e TestCase
            modelBuilder.Entity<Problema>()
                .HasMany(p => p.TestCases)
                .WithOne(t => t.Problema)
                .HasForeignKey(t => t.ProblemaId);

            // Configuração do relacionamento entre Envio e Problema
            modelBuilder.Entity<Envio>()
                .HasOne(e => e.Problema)
                .WithMany()
                .HasForeignKey(e => e.ProblemaId);
        }
    }
}