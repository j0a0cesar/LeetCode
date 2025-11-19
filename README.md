# LeetClone Frontend

## 📋 Descrição
Clone do LeetCode para prática de programação e preparação para entrevistas técnicas.

## 🚀 Tecnologias
- React + Vite
- DaisyUI
- React Router DOM
- Context API

## 🛠️ Pré-requisitos
- Node.js (versão 14+)
- npm

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/leetclone-frontend.git

# Entre na pasta
cd leetclone-frontend

# Instale as dependências
npm install
# ou
yarn install
```

## 🏃‍♂️ Executando o Projeto

```bash
# Modo desenvolvimento
npm run dev

```

Acesse `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── assets/         # Recursos estáticos
├── components/     # Componentes React
├── context/       # Contextos
├── hooks/         # Custom hooks
├── pages/         # Páginas
└── services/      # Serviços e APIs
```

## 🔍 Funcionalidades
- ✅ Autenticação
- 💻 Editor de código
- 📊 Estatísticas
- 📝 Lista de problemas
- 🔄 Sistema de submissão

## 🔐 Variáveis de Ambiente
Crie um arquivo `.env`:

```env
VITE_API_URL=sua_url_da_api
```

## 👥 Como Contribuir
1. Faça um Fork
2. Crie sua branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit (`git commit -m 'Add: nova funcionalidade'`)
4. Push (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença
MIT. Veja [LICENSE](LICENSE)

## 📞 Contato
Vitor Campos - [vitorcamposdsilva@gmail.com](mailto:vitorcamposdsilva@gmail.com)

Projeto: [https://github.com/j0a0cesar/LeetCode](https://github.com/j0a0cesar/LeetCode)

---


# LeetClone Backend

Projeto backend ASP.NET Core para um clone didático de plataforma de problemas (estilo LeetCode).

Principais arquivos e símbolos
- Arquivo de inicialização: [`Program`](Program.cs) — [Program.cs](Program.cs)  
- Contexto do EF Core: [`Data.AppDbContext`](Data/AppDbContext.cs) — [Data/AppDbContext.cs](Data/AppDbContext.cs)  
- Seeder que popula problemas: [`Data.JsonSeeder`](Data/JsonSeeder.cs) — [Data/JsonSeeder.cs](Data/JsonSeeder.cs)  
- Banco de dados de problemas (JSON usado pelo seeder): [Data/CodeDB_problemas.json](Data/CodeDB_problemas.json)  
- Modelos/entidades: [Models/](Models/)  
- Migrations EF Core: [Migrations/](Migrations/)  
- Configurações: [appsettings.json](appsettings.json) e [appsettings.Development.json](appsettings.Development.json)  
- Requisições de exemplo: [requests.http](requests.http)  
- Projeto / solução: [LeetClone_Backend.csproj](LeetClone_Backend.csproj) | [LeetClone_Backend.sln](LeetClone_Backend.sln)

Visão geral rápida
- Aplicação ASP.NET Core (.NET 8) com Entity Framework Core (SQLite/possivelmente configurável).
- Migrations já presentes em [Migrations/](Migrations/) para criar o esquema inicial.
- Um seeder lê [Data/CodeDB_problemas.json](Data/CodeDB_problemas.json) via [`Data.JsonSeeder`](Data/JsonSeeder.cs) para popular a base.
- Endpoints e exemplos de uso estão em [requests.http](requests.http).

Como executar localmente
1. Restaurar pacotes:
```sh
dotnet restore
