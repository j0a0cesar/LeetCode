
import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { executeCode, submitCode } from '../api';
import toast from 'react-hot-toast';

const useSubmit = () => {
    const [isLoadingRun, setIsLoadingRun] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const { authUser } = useAuthContext();

    const runCode = async (language, code, testCases) => {
        setIsLoadingRun(true);
        try {
            await executeCode(language, code, testCases);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingRun(false);
        }
    };

    const submit = async (problemId, language, code) => {
        if (!authUser) {
            toast.error("Você precisa estar logado para enviar.");
            return;
        }

        setIsLoadingSubmit(true);
        try {
            // Usa authUser.userId em vez de authUser.id
            await submitCode(problemId, authUser.userId, language, code);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingSubmit(false);
        }
    };

    return { isLoadingRun, isLoadingSubmit, runCode, submit };
};

export default useSubmit;