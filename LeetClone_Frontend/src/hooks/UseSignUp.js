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
            // Chama o backend
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nomeCompleto, nomeUsuario, senha, genero }), 
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Erro ao criar conta"); 
            }

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

// Validação de inputs
function handleInputErrors({ nomeCompleto, nomeUsuario, senha, confirmaSenha, genero }) {
    if (!nomeCompleto || !nomeUsuario || !senha || !confirmaSenha || !genero) {
        toast.error("Por favor, preencha todos os campos.");
        return false;
    }
    if (senha !== confirmaSenha) {
        toast.error("As senhas não coincidem.");
        return false;
    }
    return true;
}