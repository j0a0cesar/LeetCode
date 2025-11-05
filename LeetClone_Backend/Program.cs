using Microsoft.EntityFrameworkCore;
using LeetClone_Backend.Data;
using LeetClone_Backend.Models;
using LeetClone_Backend.DTOs;
using LeetClone_Backend.Helpers;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Microsoft.AspNetCore.OpenApi;


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

// Configuração de Autenticação JWT
var jwtKey = "ChaveSecretaSuperSeguraParaJWT123456789"; // Em produção, use appsettings.json/secret
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; 
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Configuração do Swagger para suportar JWT
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando o esquema Bearer. Exemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configura o JSON para ignorar ciclos de referência
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Adiciona o DbContext
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

    await context.Database.EnsureCreatedAsync();
    Console.WriteLine("✅ Banco de dados criado/verificado");

    var jsonPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "CodeDB_problemas.json");
    Console.WriteLine("📄 Procurando JSON em: " + jsonPath);
    Console.WriteLine("📄 Arquivo existe? " + File.Exists(jsonPath));

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

// IMPORTANTE: Adicionar autenticação e autorização
app.UseAuthentication();
app.UseAuthorization();


// --- 3. Endpoints de Autenticação (ATUALIZADOS) ---

// POST /api/auth/signup - Usando DTO
app.MapPost("/api/auth/signup", async (SignupRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Senha))
        return Results.BadRequest(new { message = "Username e senha são obrigatórios." });

    var usuarioExistente = await db.Usuarios.FirstOrDefaultAsync(u => u.Username == request.Username);
    if (usuarioExistente != null)
        return Results.Conflict(new { message = "Este nome de usuário já está em uso." });

    var novoUsuario = new Usuario
    {
        NomeCompleto = request.NomeCompleto,
        Username = request.Username,
        Senha = request.Senha, // TODO: Implementar hash com BCrypt
        Genero = request.Genero
    };

    db.Usuarios.Add(novoUsuario);
    await db.SaveChangesAsync();

    var token = JwtHelper.GerarTokenJWT(novoUsuario, jwtKey);

    var response = new LoginResponse(
        novoUsuario.Id,
        novoUsuario.NomeCompleto,
        novoUsuario.Username,
        novoUsuario.Genero,
        token
    );

    return Results.Created($"/api/usuarios/{novoUsuario.Id}", response);
})
.WithName("Signup")
.WithDescription("Cria uma nova conta de usuário")
.WithOpenApi();

// POST /api/auth/login - Usando DTO
app.MapPost("/api/auth/login", async (LoginRequest request, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Username == request.Username);
    if (usuario == null) return Results.NotFound(new { message = "Usuário não encontrado." });

    if (usuario.Senha != request.Senha) return Results.Unauthorized();

    var token = JwtHelper.GerarTokenJWT(usuario, jwtKey);

    var response = new LoginResponse(
        usuario.Id,
        usuario.NomeCompleto,
        usuario.Username,
        usuario.Genero,
        token
    );

    return Results.Ok(response);
})
.WithName("Login")
.WithDescription("Autentica um usuário e retorna um token JWT")
.WithOpenApi();

// --- 4. NOVOS ENDPOINTS SEGUROS ---

// GET /api/me
app.MapGet("/api/me", async (ClaimsPrincipal user, AppDbContext db) =>
{
    var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();

    var userId = int.Parse(userIdClaim.Value);
    var usuario = await db.Usuarios.FindAsync(userId);
    if (usuario == null) return Results.NotFound(new { message = "Usuário não encontrado." });

    var response = new UsuarioResponse(
        usuario.Id,
        usuario.NomeCompleto,
        usuario.Username,
        usuario.Genero
    );

    return Results.Ok(response);
})
.RequireAuthorization()
.WithName("GetCurrentUser")
.WithDescription("Retorna informações do usuário autenticado (requer token JWT)")
.WithOpenApi();

// DELETE /api/me
app.MapDelete("/api/me", async (ClaimsPrincipal user, AppDbContext db) =>
{
    var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
    if (userIdClaim == null) return Results.Unauthorized();

    var userId = int.Parse(userIdClaim.Value);
    var usuario = await db.Usuarios.FindAsync(userId);
    if (usuario == null) return Results.NotFound(new { message = "Usuário não encontrado." });

    db.Usuarios.Remove(usuario);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Conta deletada com sucesso." });
})
.RequireAuthorization()
.WithName("DeleteCurrentUser")
.WithDescription("Deleta permanentemente a conta do usuário autenticado")
.WithOpenApi();

// --- 5. Endpoints de Problemas ---

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
        Console.WriteLine($"Erro ao buscar problemas: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");

        return Results.Problem(
            title: "Erro ao buscar problemas",
            detail: ex.Message,
            statusCode: 500
        );
    }
})
.WithName("GetAllProblemas")
.WithDescription("Retorna todos os problemas disponíveis")
.WithOpenApi();

app.MapGet("/api/problemas/{id}", async (int id, AppDbContext db) =>
{
    try
    {
        var problema = await db.Problemas
            .Include(p => p.TestCases)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (problema == null)
            return Results.NotFound(new { message = "Problema não encontrado" });

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
})
.WithName("GetProblemaById")
.WithDescription("Retorna um problema específico pelo ID")
.WithOpenApi();

// --- 6. Endpoints de Envios ---

// POST /api/envios - requer autenticação
app.MapPost("/api/envios", async (EnvioRequest request, ClaimsPrincipal user, AppDbContext db) =>
{
    try
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Results.Unauthorized();

        var userId = int.Parse(userIdClaim.Value);

        var novoEnvio = new Envio
        {
            UserCode = request.UserCode,
            Linguagem = request.Linguagem,
            ProblemaId = request.ProblemaId,
            UsuarioId = userId,
            DataEnvio = DateTime.UtcNow,
            Status = "Aceito"
        };

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
})
.RequireAuthorization()
.WithName("CreateEnvio")
.WithDescription("Cria um novo envio de solução (requer autenticação)")
.WithOpenApi();

// GET /api/envios/me - envios do usuário autenticado
app.MapGet("/api/envios/me", async (ClaimsPrincipal user, AppDbContext db) =>
{
    try
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Results.Unauthorized();

        var userId = int.Parse(userIdClaim.Value);

        var envios = await db.Envios
            .Include(e => e.Problema)
            .Where(e => e.UsuarioId == userId)
            .OrderByDescending(e => e.DataEnvio)
            .ToListAsync();

        return Results.Ok(envios);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao buscar envios: {ex.Message}");

        return Results.Problem(
            title: "Erro ao buscar envios",
            detail: ex.Message,
            statusCode: 500
        );
    }
})
.RequireAuthorization()
.WithName("GetMyEnvios")
.WithDescription("Retorna todos os envios do usuário autenticado")
.WithOpenApi();

// Endpoint de DEBUG
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
})
.WithName("DatabaseStatus")
.WithDescription("Endpoint de debug para verificar status do banco")
.WithOpenApi();

app.Run();
