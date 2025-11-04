import React, { useState } from 'react';

// Recebe o problema selecionado da Home.jsx
const TestSpace = ({ problem }) => {
    const [activeTab, setActiveTab] = useState('testcases'); // testcases | submissions

    return (
        <div className='flex-1 flex flex-col h-1/2 border-t border-gray-200 bg-white'>
            <div className='flex border-b border-gray-200'>
                <button 
                    onClick={() => setActiveTab('testcases')}
                    className={`px-4 py-2 font-medium ${activeTab === 'testcases' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >
                    Casos de Teste
                </button>
                <button 
                    onClick={() => setActiveTab('submissions')}
                    className={`px-4 py-2 font-medium ${activeTab === 'submissions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                >
                    Submissões
                </button>
            </div>
            
            <div className='flex-1 p-4 overflow-y-auto'>
                {activeTab === 'testcases' && (
                    <div>
                        <h3 className='font-semibold mb-3'>Casos de Teste:</h3>
                        {/* Mapeia e exibe os casos de teste do problema */}
                        {problem?.testCases?.map((tc) => (
                            <div key={tc.id} className='bg-gray-50 p-3 rounded mb-2'>
                                <p className='font-mono text-sm'>
                                    <strong>Entrada:</strong> {tc.input}
                                </p>
                                <p className='font-mono text-sm'>
                                    <strong>Saída Esperada:</strong> {tc.output}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                
                {activeTab === 'submissions' && (
                    <div>
                        <h3 className='font-semibold mb-3'>Minhas Submissões:</h3>
                        {/* (Aqui você pode fazer um fetch para /api/envios/usuario/{id} 
                           para buscar o histórico de envios) */}
                        <p className='text-gray-500'>Nenhuma submissão ainda.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestSpace;