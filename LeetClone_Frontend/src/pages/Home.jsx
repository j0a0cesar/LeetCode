import React, { useState, useEffect } from 'react';
import ProblemBar from '../components/ProblemBar';
import ProblemDesc from '../components/ProblemDesc';
import CodeSpace from '../components/CodeSpace';
import TestSpace from '../components/TestSpace';
import toast from 'react-hot-toast';

const Home = () => {
    const [allProblems, setAllProblems] = useState([]); // Guarda todos os problemas
    const [selectedProblem, setSelectedProblem] = useState(null); // Guarda o problema clicado
    const [loading, setLoading] = useState(true);

    // (Aula 13) Busca todos os problemas da API quando a página carrega
    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                // Chama o endpoint GET /api/problemas do backend
                const res = await fetch('/api/problemas'); 
                if (!res.ok) throw new Error("Não foi possível carregar os problemas");
                const data = await res.json();
                setAllProblems(data); // Salva a lista de problemas no estado
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []); // O array vazio [] faz isso rodar só uma vez

    // Função chamada pelo ProblemBar quando um problema é clicado
    const handleProblemSelect = async (problemId) => {
        try {
            // Busca os detalhes completos do problema (incluindo casos de teste)
            const res = await fetch(`/api/problemas/${problemId}`);
            if (!res.ok) throw new Error("Não foi possível carregar o problema");
            const data = await res.json();
            setSelectedProblem(data); // Atualiza o estado
        } catch (error) {
            toast.error(error.message);
        }
    };

    // (Esta função será usada pelo CodeSpace)
    const handleCodeSubmit = async (codigo, linguagem) => {
        if (!selectedProblem) {
            toast.error("Selecione um problema primeiro.");
            return;
        }

        // Lógica de POST /api/envios viria aqui
        // Por enquanto, apenas mostramos no console
        console.log("Código enviado:", {
            problemaId: selectedProblem.id,
            codigo,
            linguagem,
        });

        toast.success("Código enviado para avaliação!");
    };


    if (loading) {
        return <div className="text-center p-10">Carregando problemas...</div>;
    }

    return (
        <div className='flex h-[calc(100vh-64px)]'>
            {/* Passa a lista de problemas e a função de clique */}
            <ProblemBar 
                problems={allProblems} 
                onProblemSelect={handleProblemSelect} 
            />

            {/* O restante da UI depende do problema selecionado */}
            {!selectedProblem ? (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    Selecione um problema na lista para começar.
                </div>
            ) : (
                <>
                    <ProblemDesc problem={selectedProblem} />
                    <div className='flex flex-col w-1/2'>
                        <CodeSpace 
                            problem={selectedProblem} 
                            onSubmit={handleCodeSubmit} 
                        />
                        <TestSpace 
                            problem={selectedProblem} 
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;