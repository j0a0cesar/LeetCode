import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (nomeUsuario, senha) => {
        
        if (!nomeUsuario || !senha) {
            toast.error("Por favor, preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: nomeUsuario,
                    senha: senha
                }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || data.title || "Erro ao fazer login");
            }

            // O backend agora retorna: { token, userId, nomeUsuario, nomeCompleto }
            // Salvamos tudo no localStorage
            localStorage.setItem("leetcode-user", JSON.stringify(data));
            setAuthUser(data);
            toast.success("Login realizado com sucesso!");

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;