using Microsoft.EntityFrameworkCore;
using LeetClone_Backend.Data;
using LeetClone_Backend.Models;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Adicionar Serviços ---

// (Aula 10/11) Adiciona o CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // Permite acesso do seu app React (que rodará na porta 5173) 
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyMethod() // Permite POST, PUT, DELETE, etc. 
              .AllowAnyHeader(); 
    });
});



// Adiciona o Swagger (OpenAPI) para documentação 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Adiciona o DbContext e lê a string de conexão do appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlite(connectionString);
});


var app = builder.Build();

// --- 2. Configurar o Pipeline ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//Habilita a política de CORS 
app.UseCors("AllowFrontend"); 

/// --- 3. Endpoints de Autenticação (Novos e Simplificados) ---
// O frontend 'frontend' espera por rotas /api/auth/...

// POST /api/auth/signup (Cria um novo usuário)

app.MapPost("/api/auth/signup", async (Usuario novoUsuario, AppDbContext db) =>
{
    // Verifica se o usuário já existe
    var usuarioExistente = await db.Usuarios
        .FirstOrDefaultAsync(u => u.Username == novoUsuario.Username);
    
    if (usuarioExistente != null)
    {
        // Retorna 409 Conflict (Conflito)
        return Results.Conflict(new { message = "Este nome de usuário já está em uso." });
    }

    db.Usuarios.Add(novoUsuario);
    await db.SaveChangesAsync();

    // Retorna o usuário criado (sem a senha, por segurança básica)
    novoUsuario.Senha = null; 
    return Results.Created($"/api/usuarios/{novoUsuario.Id}", novoUsuario);
});

// POST /api/auth/login (Login simples)
// (Sem JWT, apenas encontra o usuário pelo nome e "ignora" a senha)
app.MapPost("/api/auth/login", async (Usuario loginInfo, AppDbContext db) =>
{
    // Apenas verifica se o usuário existe pelo NOME
    var usuario = await db.Usuarios
        .FirstOrDefaultAsync(u => u.Username == loginInfo.Username);

    if (usuario == null)
    {
        return Results.NotFound(new { message = "Usuário não encontrado." });
    }

    // Em um app real, verificaríamos a senha com BCrypt aqui.
    // Como pedido, pulamos essa etapa e confiamos que a senha está correta.

    // Retorna o usuário encontrado (sem a senha)
    usuario.Senha = null;
    return Results.Ok(usuario);
});

// --- 4. Endpoints de Problemas (Atualizados) ---

// GET /api/problemas (Lê todos, agora inclui TestCases)
app.MapGet("/api/problemas", async (AppDbContext db) =>
{
    // Usa Include() para carregar os Casos de Teste junto com os problemas
    var problemas = await db.Problemas
                            .Include(p => p.TestCases) 
                            .ToListAsync();
    return Results.Ok(problemas);
});

// GET /api/problemas/{id} (Lê um, agora inclui TestCases)
app.MapGet("/api/problemas/{id}", async (int id, AppDbContext db) =>
{
    var problema = await db.Problemas
                           .Include(p => p.TestCases) // Inclui os casos de teste
                           .FirstOrDefaultAsync(p => p.Id == id);

    return problema is null ? Results.NotFound("Problema não encontrado") : Results.Ok(problema);
});

// POST /api/problemas (Cria um Problema)
app.MapPost("/api/problemas", async (Problema problema, AppDbContext db) =>
{
    db.Problemas.Add(problema);
    await db.SaveChangesAsync();
    return Results.Created($"/api/problemas/{problema.Id}", problema);
});

// PUT /api/problemas/{id} (Atualiza um Problema)
app.MapPut("/api/problemas/{id}", async (int id, Problema updatedProblema, AppDbContext db) =>
{
    var problema = await db.Problemas.FindAsync(id);
    if (problema is null) return Results.NotFound("Problema não encontrado");

    problema.Titulo = updatedProblema.Titulo;
    problema.Descricao = updatedProblema.Descricao;
    problema.Dificuldade = updatedProblema.Dificuldade;
    
    await db.SaveChangesAsync();
    return Results.Ok(problema);
});

// DELETE /api/problemas/{id} (Deleta um Problema)
app.MapDelete("/api/problemas/{id}", async (int id, AppDbContext db) =>
{
    var problema = await db.Problemas.FindAsync(id);
    if (problema is null) return Results.NotFound("Problema não encontrado");

    db.Problemas.Remove(problema);
    await db.SaveChangesAsync();
    return Results.NoContent();
});


// --- 5. Endpoints de Envios (Submissões) ---

// POST /api/envios (Cria um novo envio de código)
app.MapPost("/api/envios", async (Envio novoEnvio, AppDbContext db) =>
{
    // O frontend enviará UsuarioId, ProblemaId, Codigo, Linguagem
    novoEnvio.EnvioData = DateTime.UtcNow;
    
    // Lógica de "Execução" (Simples)
    // No futuro, você pode adicionar uma lógica de execução de código aqui.
    // Por enquanto, vamos apenas marcar como "Aceito".
    novoEnvio.Status = "Aceito"; 

    db.Envios.Add(novoEnvio);
    await db.SaveChangesAsync();
    return Results.Created($"/api/envios/{novoEnvio.Id}", novoEnvio);
});

// GET /api/envios/usuario/{id} (Pega todos os envios de um usuário)
app.MapGet("/api/envios/usuario/{usuarioId}", async (int usuarioId, AppDbContext db) =>
{
    var envios = await db.Envios
                         .Where(e => e.Id == usuarioId)
                         .Include(e => e.Problema) // Mostra qual problema foi
                         .OrderByDescending(e => e.EnvioData)
                         .ToListAsync();
    
    return Results.Ok(envios);
});
 

app.Run(); 