import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { executeCode, submitCode } from '../api'; // Importa nossa API adaptada

// Este hook substitui a lógica do 'tester.js'
const useSubmit = () => {
    const [isLoadingRun, setIsLoadingRun] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const { authUser } = useAuthContext();

    // Lógica para o botão "Run Code" (Simulado)
    const runCode = async (language, code, testCases) => {
        setIsLoadingRun(true);
        try {
            // Chama a simulação
            await executeCode(language, code, testCases);
            // Aqui você poderia atualizar um estado de "Output" se quisesse
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingRun(false);
        }
    };

    // Lógica para o botão "Submit Code" (Real)
    const submit = async (problemId, language, code) => {
        if (!authUser) {
            toast.error("Você precisa estar logado para enviar.");
            return;
        }

        setIsLoadingSubmit(true);
        try {
            // Chama nossa API .NET real
            await submitCode(problemId, authUser.id, language, code);
            // Após o submit, você pode querer recarregar as submissões
            // na aba "Submissões" (TestSpace.jsx)
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    return { isLoadingRun, isLoadingSubmit, runCode, submit };
};

export default useSubmit;