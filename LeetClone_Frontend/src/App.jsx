import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserStat from "./pages/UserStat";
import Navbar from "./componentes/Navbar";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="h-screen flex flex-col bg-app text-default">
      <Navbar />

      {/* conteúdo das páginas */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/user-stat" element={authUser ? <UserStat /> : <Navigate to="/login" />} />
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
