import React from 'react';

const ProblemDesc = ({ problem }) => {
    
    if (!problem) {
        return (
            <div className='w-1-4 h-full bg-white p-6 border-r border-gray-200 flex items-center justify-center'>
                <p className='text-gray-500'>Selecione um problema</p>
            </div>
        );
    }

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

    return (
        <div className='w-1-4 h-full overflow-y-auto bg-white border-r border-gray-200 animate-fade-in'>
            <div className='p-6'>
                {/* Cabeçalho do problema */}
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-3'>
                        {problem.titulo}
                    </h2>
                    <span className={`difficulty-badge ${getDifficultyClass(problem.dificuldade)}`}>
                        {problem.dificuldade}
                    </span>
                </div>

                {/* Descrição */}
                <div className='mb-6'>
                    <h3 className='text-sm font-semibold text-gray-600 uppercase mb-2 tracking-wide'>
                        Descrição
                    </h3>
                    <div className='text-gray-700 leading-relaxed'>
                        <p>{problem.descricao}</p>
                    </div>
                </div>

                {/* Casos de Teste como Exemplos */}
                {problem.testCases && problem.testCases.length > 0 && (
                    <div>
                        <h3 className='text-sm font-semibold text-gray-600 uppercase mb-3 tracking-wide'>
                            Exemplos
                        </h3>
                        {problem.testCases.map((tc, index) => (
                            <div key={tc.id || index} className='test-case mb-3'>
                                <div className='mb-2'>
                                    <span className='text-xs font-semibold text-gray-600 uppercase'>
                                        Exemplo {index + 1}
                                    </span>
                                </div>
                                <div className='test-case-input mb-1'>
                                    <strong>Entrada:</strong> {tc.input}
                                </div>
                                <div className='test-case-output'>
                                    <strong>Saída:</strong> {tc.output}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemDesc;