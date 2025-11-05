import React, { useState } from 'react';

const ProblemBar = ({ problems, onProblemSelect }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const getDifficultyClass = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
            case 'fácil':
                return 'difficulty-easy';
            case 'medium':
            case 'médio':
                return 'difficulty-medium';
            case 'hard':
            case 'difícil':
                return 'difficulty-hard';
            default:
                return 'difficulty-medium';
        }
    };

    const handleProblemClick = (problem) => {
        setSelectedId(problem.id);
        onProblemSelect(problem.id);
    };

    const filteredProblems = problems.filter(p => 
        p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='w-1-4 h-full overflow-hidden bg-white border-r border-gray-200 flex flex-col'>
            {/* Header com busca */}
            <div className='p-4 border-b border-gray-200 bg-gray-50'>
                <h2 className='text-lg font-semibold mb-3 text-gray-800'>Problemas</h2>
                <input
                    type='text'
                    placeholder='Buscar problemas...'
                    className='w-full input'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Lista de problemas */}
            <div className='flex-1 overflow-y-auto'>
                <table className='w-full'>
                    <thead className='sticky top-0 bg-gray-50 z-10'>
                        <tr>
                            <th className='text-left'>Título</th>
                            <th className='text-left'>Dificuldade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProblems.map((problem) => (
                            <tr 
                                key={problem.id} 
                                onClick={() => handleProblemClick(problem)}
                                className={`problem-row ${selectedId === problem.id ? 'selected' : ''}`}
                            >
                                <td className='text-gray-800 font-medium'>{problem.titulo}</td>
                                <td>
                                    <span className={`difficulty-badge ${getDifficultyClass(problem.dificuldade)}`}>
                                        {problem.dificuldade}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredProblems.length === 0 && (
                    <div className='p-8 text-center text-gray-500'>
                        Nenhum problema encontrado
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemBar;