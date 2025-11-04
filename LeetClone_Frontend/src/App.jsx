import './App.css'
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserStat from "./pages/UserStat"; // 1. Importe a nova página
import Navbar from "./components/Navbar"; // 2. Importe o Navbar
import { useAuthContext } from './context/AuthContext';

function App() {
  const { authUser } = useAuthContext();

  return (
    // 3. Modificamos a estrutura para ter o Navbar no topo
    <div className='h-screen flex flex-col'>
      {/* O Navbar agora é renderizado em todas as páginas */}
      <Navbar /> 
      
      {/* O conteúdo da página é renderizado abaixo do Navbar */}
      <div className='flex-1 p-4 flex items-center justify-center bg-gray-100'>
        <Routes>
          {/* A Home (/) é protegida */}
          <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
          
          {/* A página de estatísticas (/user-stat) também é protegida */}
          <Route path='/user-stat' element={authUser ? <UserStat /> : <Navigate to={"/login"} />} />

          {/* Login e SignUp só aparecem se o usuário NÃO estiver logado */}
          <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
          <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
        </Routes>
      </div>
    </div>
  )
}

export default App