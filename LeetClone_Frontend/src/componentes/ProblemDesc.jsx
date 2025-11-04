import React from 'react';
import next from '../assets/next.svg';
import prev from '../assets/prev.svg';

// Recebe o problema selecionado da Home.jsx
const ProblemDesc = ({ problem }) => {
    
    if (!problem) return null; // Não renderiza nada se nenhum problema for selecionado

    return (
        <div className='w-1/4 h-full overflow-y-auto bg-white p-6 border-r border-gray-200'>
            <div className='flex justify-between items-center mb-4'>
                {/* ... (botões de navegação) ... */}
                <h2 className='text-xl font-semibold text-gray-800'>{problem.titulo}</h2>
                {/* ... */}
            </div>

            <div className='mb-4'>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    problem.dificuldade?.toLowerCase() === 'fácil' ? 'bg-green-100 text-green-700' :
                    problem.dificuldade?.toLowerCase() === 'médio' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    {problem.dificuldade}
                </span>
            </div>

            {/* Mostra a descrição vinda da API */}
            <div className='text-gray-700 leading-relaxed'>
                <p>{problem.descricao}</p>
            </div>

            {/* Mostra os Casos de Teste como exemplos */}
            <div className='mt-6'>
                <h3 className='font-semibold mb-2'>Exemplos:</h3>
                {problem.testCases && problem.testCases.map((tc, index) => (
                    <div key={tc.id || index} className='bg-gray-50 p-3 rounded mb-2'>
                        <p className='font-mono'><strong>Entrada:</strong> {tc.input}</p>
                        <p className='font-mono'><strong>Saída:</strong> {tc.output}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProblemDesc;