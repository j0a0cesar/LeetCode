using Microsoft.EntityFrameworkCore;
using LeetClone_Backend.Data;
using LeetClone_Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Adicionar Serviços ---

// CORS para permitir que o React (porta 5173) acesse a API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// IMPORTANTE: Configura o JSON para ignorar ciclos de referência
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Adiciona o DbContext e lê a string de conexão
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlite(connectionString);
});

var app = builder.Build();

// --- 1.1 Seeder para importar dados do JSON ---
Console.WriteLine("🔧 Iniciando configuração do banco de dados...");

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    Console.WriteLine("📂 Diretório atual: " + Directory.GetCurrentDirectory());
    
    // Garante que o banco existe
    await context.Database.EnsureCreatedAsync();
    Console.WriteLine("✅ Banco de dados criado/verificado");
    
    // Caminho para o arquivo JSON
    var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "CodeDB_problemas.json");
    Console.WriteLine("📄 Procurando JSON em: " + jsonPath);
    Console.WriteLine("📄 Arquivo existe? " + File.Exists(jsonPath));
    
    // Importa os dados
    await JsonSeeder.SeedFromJson(context, jsonPath);
    Console.WriteLine("✅ Seeder executado!");
}

// --- 2. Configurar o Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

// --- 3. Endpoints de Autenticação ---

// POST /api/auth/signup
app.MapPost("/api/auth/signup", async (Usuario novoUsuario, AppDbContext db) =>
{
    var usuarioExistente = await db.Usuarios
        .FirstOrDefaultAsync(u => u.Username == novoUsuario.Username);
    
    if (usuarioExistente != null)
    {
        return Results.Conflict(new { message = "Este nome de usuário já está em uso." });
    }
    
    db.Usuarios.Add(novoUsuario);
    await db.SaveChangesAsync();
    
    // Remove a senha antes de retornar
    novoUsuario.Senha = null; 
    
    return Results.Created($"/api/usuarios/{novoUsuario.Id}", novoUsuario);
});

// POST /api/auth/login
app.MapPost("/api/auth/login", async (Usuario loginInfo, AppDbContext db) =>
{
    var usuario = await db.Usuarios
        .FirstOrDefaultAsync(u => u.Username == loginInfo.Username);
    
    if (usuario == null)
    {
        return Results.NotFound(new { message = "Usuário não encontrado." });
    }
    
    // Verificação de senha simplificada (na produção use hashing!)
    if (usuario.Senha != loginInfo.Senha)
    {
        return Results.Unauthorized();
    }
    
    // Remove a senha antes de retornar
    usuario.Senha = null;
    
    return Results.Ok(usuario);
});

// --- 4. Endpoints de Problemas ---

// GET /api/problemas - CORRIGIDO
app.MapGet("/api/problemas", async (AppDbContext db) =>
{
    try
    {
        var problemas = await db.Problemas
            .Include(p => p.TestCases)
            .ToListAsync();
        
        return Results.Ok(problemas);
    }
    catch (Exception ex)
    {
        // Log do erro para debug
        Console.WriteLine($"Erro ao buscar problemas: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        
        return Results.Problem(
            title: "Erro ao buscar problemas",
            detail: ex.Message,
            statusCode: 500
        );
    }
});

// GET /api/problemas/{id}
app.MapGet("/api/problemas/{id}", async (int id, AppDbContext db) =>
{
    try
    {
        var problema = await db.Problemas
            .Include(p => p.TestCases)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        if (problema == null)
        {
            return Results.NotFound(new { message = "Problema não encontrado" });
        }
        
        return Results.Ok(problema);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao buscar problema {id}: {ex.Message}");
        
        return Results.Problem(
            title: "Erro ao buscar problema",
            detail: ex.Message,
            statusCode: 500
        );
    }
});

// --- 5. Endpoints de Envios ---

// POST /api/envios
app.MapPost("/api/envios", async (Envio novoEnvio, AppDbContext db) =>
{
    try
    {
        novoEnvio.DataEnvio = DateTime.UtcNow;
        novoEnvio.Status = "Aceito"; // Lógica simplificada
        
        db.Envios.Add(novoEnvio);
        await db.SaveChangesAsync();
        
        return Results.Created($"/api/envios/{novoEnvio.Id}", novoEnvio);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao criar envio: {ex.Message}");
        
        return Results.Problem(
            title: "Erro ao criar envio",
            detail: ex.Message,
            statusCode: 500
        );
    }
});

// GET /api/envios/usuario/{usuarioId} - NOVO ENDPOINT
app.MapGet("/api/envios/usuario/{usuarioId}", async (int usuarioId, AppDbContext db) =>
{
    try
    {
        var envios = await db.Envios
            .Include(e => e.Problema)
            .Where(e => e.UsuarioId == usuarioId)
            .OrderByDescending(e => e.DataEnvio)
            .ToListAsync();
        
        return Results.Ok(envios);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao buscar envios do usuário {usuarioId}: {ex.Message}");
        
        return Results.Problem(
            title: "Erro ao buscar envios",
            detail: ex.Message,
            statusCode: 500
        );
    }
});

// Endpoint de DEBUG - REMOVA depois!
app.MapGet("/api/debug/db-status", async (AppDbContext db) =>
{
    try
    {
        var problemaCount = await db.Problemas.CountAsync();
        var testCaseCount = await db.TestCases.CountAsync();
        var usuarioCount = await db.Usuarios.CountAsync();
        var envioCount = await db.Envios.CountAsync();
        
        return Results.Ok(new {
            database = "OK",
            problemas = problemaCount,
            testCases = testCaseCount,
            usuarios = usuarioCount,
            envios = envioCount,
            connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title: "Erro ao acessar banco",
            detail: $"{ex.Message}\n\nInner: {ex.InnerException?.Message}\n\nStack: {ex.StackTrace}",
            statusCode: 500
        );
    }
});

app.Run();