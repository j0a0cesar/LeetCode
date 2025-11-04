import { useState, useEffect } from 'react'; 

import './App.css'; // Opcional 

 

function App() { 

  // (Aula 13) Cria estados para guardar os problemas e os erros 

  const [problems, setProblems] = useState([]); // Começa como um array vazio 

  const [error, setError] = useState(null); // Começa como nulo 

 

  // (Aula 13) URL da sua API Backend .NET 

  

  const API_URL = "http://localhost:5178/api/problems"; 

 

  // (Aula 13) useEffect roda quando o componente carrega 

  useEffect(() => { 

    // (Aula 13) Define a função assíncrona para buscar dados 

    const getProblems = async () => { 

      try { 

        // (Aula 11/13) Faz a requisição fetch 

        const response = await fetch(API_URL); 

 

        // (Aula 11/13) Se a resposta não for OK, lança um erro 

        if (!response.ok) { 

          throw new Error('Erro ao buscar dados da API'); 

        } 

 

        // (Aula 11/13) Converte a resposta para JSON 

        const data = await response.json(); 

 

        // (Aula 13) Atualiza o estado 'problems' com os dados recebidos 

        setProblems(data); 

      } catch (err) { 

        // (Aula 13) Se der erro, atualiza o estado 'error' 

        setError(err.message); 

      } 

    }; 

 

    getProblems(); // Chama a função 

  }, []); // O array vazio faz o useEffect rodar só uma vez 

 

  // (Aula 13) Renderiza o JSX (HTML no React) 

  return ( 

    <div> 

      <h1>Meu Clone do LeetCode</h1> 

 

      {/* (Aula 13) Se houver erro */} 

      {error && <p style={{ color: 'red' }}>{error}</p>} 

 

      {/* (Aula 13) Cria a lista <ul> */} 

      <ul> 

        {/* (Aula 13) Usa .map() para iterar sobre os problemas */} 

        {problems.map((problem) => ( 

          // 'key' é obrigatório no React para listas  

          <li key={problem.id}>  

            {problem.title} ({problem.difficulty}) 

          </li> 

        ))} 

      </ul> 

    </div> 

  ); 

} 

 

export default App; 