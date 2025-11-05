import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import UseLogout from '../hooks/UseLogout';

// SVGs (ícones) add dps mudei para  ?url assim como IA sugeriu OU USAR  vite-plugin-svgr --save-dev
import list from '../assets/list.svg';
import next from '../assets/next.svg';
import prev from '../assets/prev.svg';

// Este é o Navbar principal, usado no App.jsx
const Navbar = () => {
    const { authUser } = useAuthContext();
    const { loading, logout } = UseLogout();
    const navigate = useNavigate();

    const handleStatClick = () => {
        navigate('/user-stat'); // Navega para a página de estatísticas
    };

    return (
        <nav className='bg-gray-800 text-white p-4 flex justify-between items-center'>
            {/* 1. Título do App */}
            <Link to="/" className='text-2xl font-bold text-blue-400'>
                LeetClone
            </Link>

            {/* 2. Botões de Ação (Simplificados) */}
            {/* Em nossa arquitetura, os botões "Run" e "Submit"
                ficam no componente CodeSpace.jsx, não no Navbar.
                Os botões "Next" e "Prev" ficam na página Home.jsx.
                Esta Navbar só se preocupa com a sessão do usuário.
            */}

            {/* 3. Informações do Usuário e Logout */}
            <div className='flex items-center gap-4'>
                {authUser ? (
                    <>
                        {/* Botão que leva para a página de estatísticas */}
                        <button 
                            className='font-medium hover:text-blue-300'
                            onClick={handleStatClick}
                        >
                            PERFIL {authUser.nomeUsuario}
                        </button>
                        
                        <button 
                            className='btn btn-sm btn-outline btn-error'
                            onClick={logout}
                            disabled={loading}
                        >
                            {loading ? <span className='loading loading-spinner loading-xs'></span> : "Logout"}
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className='btn btn-sm btn-primary'>
                            Login
                        </Link>
                        <Link to="/signup" className='btn btn-sm btn-secondary'>
                            Sign up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;