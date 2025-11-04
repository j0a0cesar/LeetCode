import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast"; // 1. Mudamos para react-hot-toast

const useLogout = () => {
    const [loading, setLoading] = useState(false);
    // 2. Corrigido para 'authUser' e 'setAuthUser' (como está no seu AuthContext)
    const { authUser, setAuthUser } = useAuthContext(); 

    const logout = () => { // 3. 'async' não é mais necessário
        setLoading(true);
        try {
            // 4. REMOVEMOS O FETCH
            //    Como não estamos usando JWT, o logout é
            //    apenas uma operação no frontend.

            // 5. Corrigimos o nome do item no localStorage
            localStorage.removeItem("leetcode-user"); 
            
            // 6. Atualizamos o contexto para deslogar o usuário
            setAuthUser(null);
            
            toast.success("Logout realizado com sucesso!"); // 7. Usamos o toast simples

        } catch (error) {
            // 8. Usamos o toast de erro simples
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, logout };
};

export default useLogout;