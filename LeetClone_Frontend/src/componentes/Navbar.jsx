import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import UseLogout from '../hooks/UseLogout';

const Navbar = () => {
    const { authUser } = useAuthContext();
    const { loading, logout } = UseLogout();
    const navigate = useNavigate();

    const handleStatClick = () => {
        navigate('/user-stat');
    };

    return (
        <nav className='bg-gray-800 text-white p-4 flex justify-between items-center shadow-md'>
            {/* Logo */}
            <Link to="/" className='text-2xl font-bold text-green-400 hover:text-green-300 transition-colors flex items-center gap-2'>
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
                LeetClone
            </Link>

            {/* User Info e Actions */}
            <div className='flex items-center gap-4'>
                {authUser ? (
                    <>
                        <button 
                            className='flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors'
                            onClick={handleStatClick}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                            </svg>
                            Olá, {authUser.nomeUsuario}
                        </button>
                        
                        <button 
                            className='btn btn-sm btn-outline-error'
                            onClick={logout}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className='loading loading-spinner loading-xs'></span>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                                    </svg>
                                    Logout
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    <Link to="/login" className='btn btn-sm btn-primary'>
                        Entrar
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;