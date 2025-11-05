import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext'; // 1. Importamos o AuthContext
import toast from 'react-hot-toast'; // 2. Importamos o react-hot-toast

// Recebe o 'problem' selecionado da Home.jsx
const TestSpace = ({ problem }) => {
    const [activeTab, setActiveTab] = useState('testcases'); // testcases | submissions
    
    // --- Lógica do UserSubmission.jsx adaptada ---
    const { authUser } = useAuthContext(); // 3. Pegamos o usuário logado
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [selectedCode, setSelectedCode] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 4. Função para buscar as submissões do backend
    const fetchSubmissions = async () => {
        if (!authUser) return; // Não faz nada se não houver usuário

        setLoadingSubmissions(true);
        try {
            // 5. Usamos o endpoint do NOSSO backend
            const res = await fetch(`/api/envios/usuario/${authUser.id}`);
            
            if (!res.ok) {
                throw new Error("Não foi possível carregar as submissões");
            }

            const data = await res.json();
            setSubmissions(data);

        } catch (error) {
            // 6. Usamos o toast do react-hot-toast
            toast.error(error.message);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    // 7. Efeito para buscar as submissões quando a aba é clicada
    useEffect(() => {
        if (activeTab === 'submissions') {
            fetchSubmissions();
        }
    }, [activeTab, authUser]); // Roda quando a aba muda ou o usuário é carregado

    // 8. Filtra as submissões para mostrar apenas as do problema atual
    //    Isso mantém nosso backend simples (só busca por usuário)
    const filteredSubmissions = submissions.filter(s => s.problemaId === problem.id);

    // 9. Funções para o Modal (janela) que mostra o código
    const handleCodeClick = (code) => {
        setSelectedCode(code);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCode(null);
    };
    // --- Fim da lógica adaptada ---


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
                {/* --- Aba Casos de Teste (Sem mudanças) --- */}
                {activeTab === 'testcases' && (
                    <div>
                        <h3 className='font-semibold mb-3'>Casos de Teste:</h3>
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
                
                {/* --- Aba Submissões (Lógica nova) --- */}
                {activeTab === 'submissions' && (
                    <div>
                        <h3 className='font-semibold mb-3'>Minhas Submissões (para este problema):</h3>
                        {loadingSubmissions ? (
                            <span>Carregando submissões...</span>
                        ) : (
                            <div>
                                {filteredSubmissions.length === 0 ? (
                                    <span>Nenhuma submissão encontrada para este problema.</span>
                                ) : (
                                    filteredSubmissions.map((submission, index) => (
                                        <div key={submission.id} className='flex flex-col gap-1 mb-2'>
                                            {/* 10. JSX adaptado para o nosso modelo de dados */}
                                            <div
                                                className={`flex gap-3 p-3 rounded-lg text-sm font-medium ${
                                                    submission.status.toLowerCase() === "aceito" 
                                                        ? "bg-green-100 text-green-800" 
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                <span>{index + 1})</span>
                                                <span className='font-bold'>{submission.status}</span>
                                                <span>{new Date(submission.dataEnvio).toLocaleString()}</span>
                                                <span>{submission.linguagem}</span>
                                                <button 
                                                    onClick={() => handleCodeClick(submission.codigo)} 
                                                    className='ml-auto text-blue-900 underline font-bold'
                                                >
                                                    Ver Código
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- Modal (Janela) para ver o código --- */}
            {showModal && (
                <div className='absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold'>Código Enviado:</h2>
                            <button 
                                onClick={handleCloseModal} 
                                className='text-black text-2xl font-bold hover:text-gray-800'
                            >
                                &times;
                            </button>
                        </div>
                        <pre className='whitespace-pre-wrap bg-gray-900 text-white p-4 rounded overflow-auto'>
                            {selectedCode}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestSpace;