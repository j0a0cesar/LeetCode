import { useState } from 'react';
import { Link } from 'react-router-dom';
import UseSignUp from '../hooks/UseSignUp';

const SignUp = () => {
    const [inputs, setInputs] = useState({
        nomeCompleto: "",
        nomeUsuario: "",
        senha: "",
        confirmaSenha: "",
        genero: "masculino", // Valor padrão
    });

    const { loading, signup } = UseSignUp();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs);
    };

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-md bg-gray-200 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-70 border border-gray-100' style={{maxWidth: '450px'}}>
                <h1 className='text-3xl font-semibold text-center text-gray-500'>
                    Sign Up <span className='text-blue-800'>To Code</span>
                </h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'><span className='text-base label-text'>Nome Completo</span></label>
                        <input type="text" placeholder='Seu Nome' className='w-full input input-bordered h-10'
                            value={inputs.nomeCompleto} onChange={(e) => setInputs({ ...inputs, nomeCompleto: e.target.value })} />
                    </div>
                    <div>
                        <label className='label p-2'><span className='text-base label-text'>Username</span></label>
                        <input type="text" placeholder='username' className='w-full input input-bordered h-10'
                            value={inputs.nomeUsuario} onChange={(e) => setInputs({ ...inputs, nomeUsuario: e.target.value })} />
                    </div>
                    <div>
                        <label className='label'><span className='text-base label-text'>Password</span></label>
                        <input type="password" placeholder='Enter Password'
                            className='w-full input input-bordered h-10'
                            value={inputs.senha} onChange={(e) => setInputs({ ...inputs, senha: e.target.value })} />
                    </div>
                    <div>
                        <label className='label'><span className='text-base label-text'>Confirm Password</span></label>
                        <input type="password" placeholder='Confirm Password'
                            className='w-full input input-bordered h-10'
                            value={inputs.confirmaSenha} onChange={(e) => setInputs({ ...inputs, confirmaSenha: e.target.value })} />
                    </div>
                    
                    {/* Gênero (opcional, mas está no seu backend) */}
                    <div>
                        <label className='label'><span className='text-base label-text'>Gênero</span></label>
                        <select className='w-full input input-bordered h-10' value={inputs.genero} onChange={(e) => setInputs({ ...inputs, genero: e.target.value })}>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                        </select>
                    </div>

                    <Link to='/login' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
                        Already have an account?
                    </Link>
                    <div>
                        <button className='btn btn-block btn-sm mt-2' disabled={loading}>
                            {loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default SignUp;