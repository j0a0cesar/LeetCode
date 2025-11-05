import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ProblemBar from '../componentes/ProblemBar';
import ProblemDesc from '../componentes/ProblemDesc';
import CodeSpace from '../componentes/CodeSpace';
import TestSpace from '../componentes/TestSpace';

const Home = () => {
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    // Busca todos os problemas da API
    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/problemas'); 
                if (!res.ok) throw new Error("Não foi possível carregar os problemas");
                const data = await res.json();
                setProblems(data);
                
                // Seleciona o primeiro problema automaticamente
                if (data.length > 0) {
                    fetchProblemDetails(data[0].id);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    // Busca os detalhes de um problema específico (incluindo Test Cases)
    const fetchProblemDetails = async (problemId) => {
        try {
            const res = await fetch(`/api/problemas/${problemId}`);
            if (!res.ok) throw new Error("Não foi possível carregar o problema");
            const data = await res.json();
            setSelectedProblem(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Função chamada quando um problema é clicado na ProblemBar
    const handleProblemSelect = (problemId) => {
        fetchProblemDetails(problemId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* 1. Barra lateral com lista de problemas */}
            <ProblemBar 
                problems={problems} 
                onProblemSelect={handleProblemSelect} 
            />

            {/* 2. Descrição do problema selecionado */}
            {selectedProblem && (
                <ProblemDesc problem={selectedProblem} />
            )}

            {/* 3. Área de código e testes */}
            <div className='flex-1 flex flex-col'>
                {selectedProblem ? (
                    <>
                        {/* Editor de código */}
                        <CodeSpace problem={selectedProblem} />
                        
                        {/* Área de Test Cases e Submissões */}
                        <TestSpace problem={selectedProblem} />
                    </>
                ) : (
                    <div className='flex items-center justify-center h-full text-gray-500'>
                        Selecione um problema para começar
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;