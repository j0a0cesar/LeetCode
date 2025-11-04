import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Home = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    // (Aula 13) Busca os problemas da API
    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                // Chama o backend
                const res = await fetch('/api/problemas'); 
                if (!res.ok) throw new Error("Não foi possível carregar os problemas");
                const data = await res.json();
                setProblems(data); // Salva no estado
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Carregando problemas...</div>;
    }

    // Renderiza a lista de problemas
    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-3xl font-bold mb-4'>Lista de Problemas</h1>
            <div className='bg-white shadow-md rounded-lg'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Título</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Dificuldade</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Descrição</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {problems.map((problem) => (
                            <tr key={problem.id} className='hover:bg-gray-50'>
                                <td className='px-6 py-4 whitespace-nowrap'>{problem.titulo}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>{problem.dificuldade}</td>
                                <td className='px-6 py-4'>{problem.descricao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;