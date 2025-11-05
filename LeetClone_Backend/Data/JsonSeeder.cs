using LeetClone_Backend.Models;
using System.Text.Json;

//Essa classe seeder foi feita devido a um problema para Colocar os dados corretamente no leetcode.db
//ela faz um "contorno" no caminho, não se se esse metodo via gerar algum problema 

namespace LeetClone_Backend.Data
{
    // Classes para mapear o JSON 
    public class MongoProblema
    {
        public string problem_name { get; set; }
        public string problem_desc { get; set; }
        public string category { get; set; }
        public SolutionSkeleton solution_skeleton { get; set; }
        public TestCasesWrapper testcases { get; set; }
    }

    public class SolutionSkeleton
    {
        public string javascript { get; set; }
    }

    public class TestCasesWrapper
    {
        public List<TestCaseData> sample { get; set; }
        public List<TestCaseData> all_test_cases { get; set; }
    }

    public class TestCaseData
    {
        public string input { get; set; }
        public string output { get; set; }
    }

    // Classe para fazer o seed
    public static class JsonSeeder
    {
        public static async Task SeedFromJson(AppDbContext context, string jsonPath)
        {
            // Verifica se já existem problemas
            if (context.Problemas.Any())
            {
                Console.WriteLine("✓ Banco já possui problemas.");
                return;
            }

            // Verifica se o arquivo existe
            if (!File.Exists(jsonPath))
            {
                Console.WriteLine($"✗ Arquivo não encontrado: {jsonPath}");
                return;
            }

            Console.WriteLine("📥 Importando problemas do JSON...");

            // Lê e desserializa o JSON
            var jsonContent = await File.ReadAllTextAsync(jsonPath);
            var mongoProblemas = JsonSerializer.Deserialize<List<MongoProblema>>(jsonContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (mongoProblemas == null || !mongoProblemas.Any())
            {
                Console.WriteLine("✗ Nenhum problema encontrado no JSON.");
                return;
            }

            // Converte para o modelo do EF Core
            var problemas = new List<Problema>();

            foreach (var mp in mongoProblemas)
            {
                var problema = new Problema
                {
                    Titulo = mp.problem_name,
                    Descricao = mp.problem_desc,
                    Dificuldade = mp.category switch
                    {
                        "easy" => "Fácil",
                        "medium" => "Médio",
                        "hard" => "Difícil",
                        _ => "Médio"
                    },
                    CodeTemplate = mp.solution_skeleton?.javascript ?? "// Seu código aqui",
                    TestCases = new List<TestCase>()
                };

                // Adiciona todos os test cases
                if (mp.testcases?.all_test_cases != null)
                {
                    foreach (var tc in mp.testcases.all_test_cases)
                    {
                        problema.TestCases.Add(new TestCase
                        {
                            Input = tc.input,
                            OutputSolucao = tc.output
                        });
                    }
                }

                problemas.Add(problema);
            }

            // Salva no banco
            context.Problemas.AddRange(problemas);
            await context.SaveChangesAsync();

            Console.WriteLine($"✓ {problemas.Count} problemas importados com sucesso!");
        }
    }
}