import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({ nomeCompleto, nomeUsuario, senha, confirmaSenha, genero }) => {
        const success = handleInputErrors({ nomeCompleto, nomeUsuario, senha, confirmaSenha, genero });
        if (!success) return;

        setLoading(true);
        try {
            
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Enviamos os dados 
                body: JSON.stringify({ nomeCompleto, nomeUsuario, senha, genero }), 
            });

            const data = await res.json();
            
            if (!res.ok) {
                // Mostra o erro vindo da API (
                throw new Error(data.message || "Erro ao criar conta"); 
            }

            // Salva o usuário no localStorage e no contexto
            localStorage.setItem("leetcode-user", JSON.stringify(data));
            setAuthUser(data);
            toast.success("Conta criada com sucesso!");

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignUp;

// (Função de validação, sem mudanças)
function handleInputErrors({ nomeCompleto, nomeUsuario, senha, confirmaSenha, genero }) {
    if (!nomeCompleto || !nomeUsuario || !senha || !confirmaSenha || !genero) {
        toast.error("Por favor, preencha todos os campos.");
        return false;
    }
    if (senha !== confirmaSenha) {
        toast.error("As senhas não coincidem.");
        return false;
    }
    if (senha.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
        return false;
    }
    return true;
}