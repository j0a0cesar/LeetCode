import React from 'react';
import list from '../assets/list.svg';
import tags from '../assets/tags.svg';

// Recebe 'problems' (da API) e 'onProblemSelect' (função) da Home.jsx
const ProblemBar = ({ problems, onProblemSelect }) => {
    
    // Define a cor da dificuldade
    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
            case 'fácil':
                return 'text-green-500';
            case 'medium':
            case 'médio':
                return 'text-yellow-500';
            case 'hard':
            case 'difícil':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className='w-1/4 h-full overflow-y-auto bg-white border-r border-gray-200'>
            <div className='flex items-center p-4 border-b border-gray-200'>
                {/* ... (inputs e botões de busca) ... */}
                <input
                    type='text'
                    placeholder='Buscar problemas...'
                    className='flex-1 ml-4 p-2 border border-gray-300 rounded'
                />
            </div>
            
            <table className='w-full text-left'>
                <thead>
                    <tr className='border-b border-gray-200'>
                        <th className='p-4 font-medium text-gray-600'>Título</th>
                        <th className='p-4 font-medium text-gray-600'>Dificuldade</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Mapeia os problemas vindos da API (passados por props) */}
                    {problems.map((problem) => (
                        <tr 
                            key={problem.id} 
                            // Chama a função da Home ao clicar
                            onClick={() => onProblemSelect(problem.id)}
                            className='border-b border-gray-100 hover:bg-gray-50 cursor-pointer'
                        >
                            {/* Usa 'titulo' e 'dificuldade' do seu modelo .NET */}
                            <td className='p-4 text-gray-800'>{problem.titulo}</td>
                            <td className={`p-4 ${getDifficultyColor(problem.dificuldade)}`}>
                                {problem.dificuldade}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProblemBar;