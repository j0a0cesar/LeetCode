// src/pages/UserStat.jsx
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserStat = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        aceitos: 0,
        rejeitados: 0,
        taxaAceitacao: 0
    });
    const { authUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authUser) return;

        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/envios/usuario/${authUser.userId}`);
                if (!res.ok) throw new Error("Não foi possível carregar o histórico");
                
                const data = await res.json();
                setSubmissions(data);
                
                // Calcular estatísticas
                const total = data.length;
                const aceitos = data.filter(s => s.status.toLowerCase() === 'aceito').length;
                const rejeitados = total - aceitos;
                const taxaAceitacao = total > 0 ? ((aceitos / total) * 100).toFixed(1) : 0;
                
                setStats({ total, aceitos, rejeitados, taxaAceitacao });
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [authUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 py-8 px-4'>
            <div className='container mx-auto max-w-6xl animate-fade-in'>
                {/* Header */}
                <div className='mb-8 flex items-center justify-between'>
                    <div>
                        <h1 className='text-4xl font-bold text-gray-800 mb-2'>
                            Estatísticas
                        </h1>
                        <p className='text-gray-600'>
                            Bem-vindo, <span className='font-semibold text-green-600'>{authUser.nomeUsuario}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className='btn btn-sm btn-outline'
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                        </svg>
                        Voltar
                    </button>
                </div>

                {/* Cards de Estatísticas */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-600 text-sm font-medium'>Total</p>
                                <p className='text-3xl font-bold text-gray-800 mt-2'>{stats.total}</p>
                            </div>
                            <div className='bg-blue-100 p-3 rounded-lg'>
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-600 text-sm font-medium'>Aceitos</p>
                                <p className='text-3xl font-bold text-green-600 mt-2'>{stats.aceitos}</p>
                            </div>
                            <div className='bg-green-100 p-3 rounded-lg'>
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-600 text-sm font-medium'>Rejeitados</p>
                                <p className='text-3xl font-bold text-red-600 mt-2'>{stats.rejeitados}</p>
                            </div>
                            <div className='bg-red-100 p-3 rounded-lg'>
                                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-gray-600 text-sm font-medium'>Taxa de Aceitação</p>
                                <p className='text-3xl font-bold text-yellow-600 mt-2'>{stats.taxaAceitacao}%</p>
                            </div>
                            <div className='bg-yellow-100 p-3 rounded-lg'>
                                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabela de Submissões */}
                <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                    <div className='p-6 border-b border-gray-200'>
                        <h2 className='text-xl font-semibold text-gray-800'>Histórico de Submissões</h2>
                    </div>
                    
                    {submissions.length === 0 ? (
                        <div className='p-12 text-center'>
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                            </svg>
                            <p className='text-gray-500 text-lg'>Nenhuma submissão ainda</p>
                            <p className='text-gray-400 text-sm mt-2'>Comece resolvendo problemas!</p>
                            <button 
                                onClick={() => navigate('/')}
                                className='btn btn-primary mt-4'
                            >
                                Resolver Problemas
                            </button>
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className='min-w-full'>
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Problema</th>
                                        <th>Status</th>
                                        <th>Linguagem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub) => (
                                        <tr key={sub.id}>
                                            <td className='whitespace-nowrap'>
                                                {new Date(sub.dataEnvio).toLocaleString('pt-BR')}
                                            </td>
                                            <td className='font-medium'>
                                                {sub.problemaTitulo}
                                            </td>
                                            <td>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    sub.status.toLowerCase() === 'aceito' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className='px-2 py-1 bg-gray-100 rounded text-xs font-mono'>
                                                    {sub.linguagem}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserStat;