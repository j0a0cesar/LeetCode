using Microsoft.EntityFrameworkCore;
using LeetClone_Backend.Data;
using LeetClone_Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Adicionar Serviços ---

// (Aulas 10/11) Adiciona o CORS para permitir que o React (porta 5173) acesse a API
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

// (Aula 4) Adiciona o DbContext e lê a string de conexão do appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Certifique-se de ter o appsettings.json com a ConnectionString
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlite(connectionString);
});

var app = builder.Build();

//1.1 Seeder recomendado por IA para resolver problema de "colocar" DB ja feito 

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Cria o banco se não existir
    await context.Database.EnsureCreatedAsync();
    
    // Caminho para o arquivo JSON
    var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "CodeDB_problemas.json");
    
    // Importa os dados
    await JsonSeeder.SeedFromJson(context, jsonPath);
}




// --- 2. Configurar o Pipeline ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//app.UseHttpsRedirection(); -->estava dando erro
app.UseCors("AllowFrontend"); // Habilita o CORS

// --- 3. Endpoints de Autenticação (Novos para "pages2") ---

// POST /api/auth/signup (Chamado por SignUp.jsx)
app.MapPost("/api/auth/signup", async (Usuario novoUsuario, AppDbContext db) =>
{
    var usuarioExistente = await db.Usuarios.FirstOrDefaultAsync(u => u.Username == novoUsuario.Username);
    if (usuarioExistente != null)
    {
        return Results.Conflict(new { message = "Este nome de usuário já está em uso." });
    }
    db.Usuarios.Add(novoUsuario);
    await db.SaveChangesAsync();
    novoUsuario.Senha = null; 
    return Results.Created($"/api/usuarios/{novoUsuario.Id}", novoUsuario);
});

// POST /api/auth/login (Chamado por Login.jsx)
app.MapPost("/api/auth/login", async (Usuario loginInfo, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Username == loginInfo.Username);
    if (usuario == null)
    {
        return Results.NotFound(new { message = "Usuário não encontrado." });
    }
    // Como solicitado, pulamos a verificação de senha.
    usuario.Senha = null;
    return Results.Ok(usuario);
});

// --- 4. Endpoints de Problemas (Atualizados para "pages2") ---

// GET /api/problemas (Chamado por Home.jsx)
app.MapGet("/api/problemas", async (AppDbContext db) =>
{
    var problemas = await db.Problemas.Include(p => p.TestCases).ToListAsync();
    return Results.Ok(problemas);
});

// GET /api/problemas/{id} (Chamado por Home.jsx)
app.MapGet("/api/problemas/{id}", async (int id, AppDbContext db) =>
{
    var problema = await db.Problemas.Include(p => p.TestCases).FirstOrDefaultAsync(p => p.Id == id);
    return problema is null ? Results.NotFound("Problema não encontrado") : Results.Ok(problema);
});

// --- 5. Endpoints de Envios ---
app.MapPost("/api/envios", async (Envio novoEnvio, AppDbContext db) =>
{
    novoEnvio.DataEnvio = DateTime.UtcNow;
    novoEnvio.Status = "Aceito"; // Lógica de execução simplificada
    db.Envios.Add(novoEnvio);
    await db.SaveChangesAsync();
    return Results.Created($"/api/envios/{novoEnvio.Id}", novoEnvio);
});

app.Run();