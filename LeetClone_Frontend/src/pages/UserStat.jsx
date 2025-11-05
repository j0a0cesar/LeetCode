import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UserStat = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authUser } = useAuthContext();

    // Busca todas as submissões do usuário logado
    useEffect(() => {
        if (!authUser) return; // Garante que o usuário está logado

        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                // Chama o endpoint do backend
                const res = await fetch(`/api/envios/usuario/${authUser.id}`);
                if (!res.ok) throw new Error("Não foi possível carregar o histórico");
                
                const data = await res.json();
                setSubmissions(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [authUser]); // Roda quando 'authUser' é carregado

    if (loading) {
        return <div className="text-center p-10">Carregando estatísticas...</div>;
    }

    return (
        <div className='container mx-auto p-4 w-full max-w-4xl'>
            <h1 className='text-3xl font-bold mb-4'>
                Minhas Submissões ({authUser.nomeUsuario})
            </h1>
            <div className='bg-white shadow-md rounded-lg overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Data</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Problema</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Status</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Linguagem</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className='td-empty'>
                                 Nenhuma submissão encontrada.
                                </td>
                            </tr>
                        ) : (
                            submissions.map((sub) => (
                                <tr key={sub.id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap'>{new Date(sub.dataEnvio).toLocaleString()}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{sub.problema.titulo}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                                        sub.status.toLowerCase() === 'aceito' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {sub.status}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{sub.linguagem}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserStat;