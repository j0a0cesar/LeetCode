// src/pages/SignUp.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import UseSignUp from '../hooks/UseSignUp';

const SignUp = () => {
    const [inputs, setInputs] = useState({
        nomeCompleto: "",
        nomeUsuario: "",
        senha: "",
        confirmaSenha: "",
        genero: "masculino",
    });

    const { loading, signup } = UseSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs);
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
                            Criar Conta
                        </h1>
                        <p className='text-gray-600 mt-2'>Junte-se a nós e comece a codar</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='label'>
                                <span className='label-text'>Nome Completo</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder='Seu nome completo' 
                                className='input input-bordered w-full'
                                value={inputs.nomeCompleto} 
                                onChange={(e) => setInputs({ ...inputs, nomeCompleto: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='label-text'>Username</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder='Escolha um username' 
                                className='input input-bordered w-full'
                                value={inputs.nomeUsuario} 
                                onChange={(e) => setInputs({ ...inputs, nomeUsuario: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='label-text'>Senha</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder='Crie uma senha'
                                className='input input-bordered w-full'
                                value={inputs.senha} 
                                onChange={(e) => setInputs({ ...inputs, senha: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='label-text'>Confirmar Senha</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder='Confirme sua senha'
                                className='input input-bordered w-full'
                                value={inputs.confirmaSenha} 
                                onChange={(e) => setInputs({ ...inputs, confirmaSenha: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className='label'>
                                <span className='label-text'>Gênero</span>
                            </label>
                            <select 
                                className='select select-bordered w-full' 
                                value={inputs.genero} 
                                onChange={(e) => setInputs({ ...inputs, genero: e.target.value })}
                            >
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>

                        <button 
                            className='btn btn-primary btn-block mt-6' 
                            disabled={loading}
                        >
                            {loading ? (
                                <span className='loading loading-spinner'></span>
                            ) : (
                                'Criar Conta'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className='text-center mt-6'>
                        <p className='text-sm text-gray-600'>
                            Já tem uma conta?{' '}
                            <Link to='/login' className='text-green-600 hover:text-green-700 font-semibold'>
                                Fazer login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;