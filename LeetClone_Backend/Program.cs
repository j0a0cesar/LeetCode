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
        // Permite acesso do seu app React (que rodará na porta 5173) [cite: 1125-1131]
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyMethod() // Permite POST, PUT, DELETE, etc. [cite: 1150]
              .AllowAnyHeader(); 
    });
});

// (Aula 4) Adiciona o DbContext [cite: 563]
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite("Data Source=leetcode.db"); 
});

// Adiciona o Swagger (OpenAPI) para documentação [cite: 5, 959]
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// --- 3. Endpoints CRUD ---

// GET: /api/problems (Lê todos os problemas) 

app.MapGet("/api/problems", async (AppDbContext db) =>  

    await db.Problems.ToListAsync()); 

 

// GET: /api/problems/{id} (Lê um problema específico) 

app.MapGet("/api/problems/{id}", async (int id, AppDbContext db) => 

{ 

    var problem = await db.Problems.FindAsync(id); 

    return problem is null ? Results.NotFound("Problema não encontrado") : Results.Ok(problem); 

}); 

 

// POST: /api/problems (Cria um problema) [Baseado na Aula 6] 

app.MapPost("/api/problems", async (Problema problem, AppDbContext db) => 

{ 

    db.Problems.Add(problem); 

    await db.SaveChangesAsync(); 

    return Results.Created($"/api/problems/{problem.Id}", problem); 

}); 

 

// PUT: /api/problems/{id} (Atualiza um problema) [Baseado na Aula 7] 

app.MapPut("/api/problems/{id}", async (int id, Problema updatedProblem, AppDbContext db) => 

{ 

    

    var problem = await db.Problems.FindAsync(id); 

    if (problem is null) 

    { 

        return Results.NotFound("Problema não encontrado"); 

    } 

 

    // Atualiza os campos manualmente, como na Aula 7 

    problem.Titulo = updatedProblem.Titulo; 

    problem.Descricao = updatedProblem.Descricao;

    problem.Dificuldade = updatedProblem.Dificuldade; 
    
    problem.CodeTemplate = updatedProblem.CodeTemplate; 


    await db.SaveChangesAsync(); 
    return Results.Ok(problem); 

}); 

 

// DELETE: /api/problems/{id} (Deleta um problema) [Baseado na Aula 8] 

app.MapDelete("/api/problems/{id}", async (int id, AppDbContext db) => 

{ 

    var problem = await db.Problems.FindAsync(id); 

    if (problem is null) 

    { 

        return Results.NotFound("Problema não encontrado");  

    } 

 

    db.Problems.Remove(problem); 

    await db.SaveChangesAsync(); 

    return Results.NoContent(); 

}); 

 

app.Run(); 