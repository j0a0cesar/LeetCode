import toast from 'react-hot-toast';

// 1. SIMULAÇÃO do "Run Code"
export const executeCode = async (language, code, testCases) => {
    console.log("Executando código (simulado):", language, code);
    
    await new Promise(resolve => setTimeout(resolve, 750));

    toast.success("Código executado (simulado)!");
    return { success: true, output: "Executado com sucesso (simulado)." };
};

// 2. SUBMIT CODE -
export const submitCode = async (problemaId, usuarioId, linguagem, codigo) => {
    try {
        const res = await fetch("/api/envios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ProblemaId: problemaId,      
                UsuarioId: usuarioId,        
                Linguagem: linguagem,        
                UserCode: codigo,            
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || data.title || "Falha ao enviar o código");
        }
        
        toast.success("Código enviado com sucesso!");
        return { success: true, data: data };

    } catch (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
    }
};