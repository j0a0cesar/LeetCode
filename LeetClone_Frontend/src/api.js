import toast from 'react-hot-toast';

// 1. SIMULAÇÃO do "Run Code"
// Em vez de chamar uma API externa, apenas simulamos um sucesso
// para manter o projeto simples.
export const executeCode = async (language, code, testCases) => {
    console.log("Executando código (simulado):", language, code);
    
    // Simula um delay de API
    await new Promise(resolve => setTimeout(resolve, 750));

    // Retorna um resultado simulado de sucesso
    // (Na nossa arquitetura, a aba "Test Cases" já mostra as respostas)
    toast.success("Código executado (simulado)!");
    return { success: true, output: "Executado com sucesso (simulado)." };
};


// 2. ADAPTAÇÃO do "Submit Code"
// Esta função chama o NOSSO backend .NET
export const submitCode = async (problemaId, usuarioId, linguagem, codigo) => {
    try {
        const res = await fetch("/api/envios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                problemaId: problemaId,
                usuarioId: usuarioId,
                linguagem: linguagem,
                codigo: codigo,
                // O backend definirá o Status e a DataEnvio
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Falha ao enviar o código");
        }
        
        toast.success("Código enviado com sucesso!");
        return { success: true, data: data };

    } catch (error) {
        toast.error(error.message);
        return { success: false, error: error.message };
    }
};