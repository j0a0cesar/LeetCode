// src/pages/Home.jsx
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

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/problemas'); 
                if (!res.ok) throw new Error("Não foi possível carregar os problemas");
                const data = await res.json();
                setProblems(data);
                
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

    const handleProblemSelect = (problemId) => {
        fetchProblemDetails(problemId);
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <span className="loading loading-spinner"></span>
            </div>
        );
    }

    return (
        <div className='flex h-screen overflow-hidden page-transition'>
            <ProblemBar 
                problems={problems} 
                onProblemSelect={handleProblemSelect} 
            />

            {selectedProblem && (
                <ProblemDesc problem={selectedProblem} />
            )}

            <div className='flex-1 flex flex-col'>
                {selectedProblem ? (
                    <>
                        <CodeSpace problem={selectedProblem} />
                        <TestSpace problem={selectedProblem} />
                    </>
                ) : (
                    <div className='flex items-center justify-center h-full text-gray-500 bg-white'>
                        <div className='text-center'>
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                            </svg>
                            <p className='text-lg font-medium'>Selecione um problema para começar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;