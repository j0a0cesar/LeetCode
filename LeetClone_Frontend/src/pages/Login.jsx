// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UseLogin from '../hooks/UseLogin';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loading, login } = UseLogin();
    
    const handleSubmit = async (e) => {
        e.preventDefault();    
        await login(username, password);
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4'>
            <div className='w-full max-w-md animate-fade-in'>
                <div className='bg-white rounded-lg shadow-lg p-8'>
                    {/* Logo/Header */}
                    <div className='text-center mb-8'>
                        <div className='flex justify-center mb-4'>
                            <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                        </div>
                        <h1 className='text-3xl font-bold text-gray-800'>
                            Bem-vindo de volta
                        </h1>
                        <p className='text-gray-600 mt-2'>Entre para continuar codando</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='label'>
                                <span className='label-text'>Username</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder='Digite seu username' 
                                className='input input-bordered w-full' 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='label-text'>Senha</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder='Digite sua senha'
                                className='input input-bordered w-full'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            className='btn btn-primary btn-block mt-6'
                            disabled={loading}
                        >
                            {loading ? (
                                <span className='loading loading-spinner'></span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className='text-center mt-6'>
                        <p className='text-sm text-gray-600'>
                            Não tem uma conta?{' '}
                            <Link to='/signup' className='text-green-600 hover:text-green-700 font-semibold'>
                                Criar conta
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;