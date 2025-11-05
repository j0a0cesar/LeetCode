import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector'; // Criaremos este
import { CODE_SNIPPETS } from '../constant.js'; // O arquivo que transformamos
import useSubmit from '../hooks/UseSubmit';// O hook que transformamos
// (Nota: O editor de código real @monaco-editor/react precisaria ser instalado)
// npm install @monaco-editor/react
// tecnicamente não estamos ultilizando
const CodeSpace = ({ problem }) => {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(CODE_SNIPPETS["javascript"]);
    
    // Nosso hook transformado de 'tester.js'
    const { isLoadingRun, isLoadingSubmit, runCode, submit } = useSubmit();

    // Atualiza o código boilerplate quando o problema ou a linguagem mudam
    useEffect(() => {
        setCode(CODE_SNIPPETS[language] || "");
    }, [language, problem]);

    const onSelectLanguage = (lang) => {
        setLanguage(lang);
    };

    const handleRun = () => {
        // 'problem.testCases' vem da Home.jsx
        runCode(language, code, problem.testCases);
    };

    const handleSubmit = () => {
        submit(problem.id, language, code);
    };

    return (
        <div className='flex-1 flex flex-col h-1/2 bg-gray-900 text-white'>
            <div className='bg-gray-800 p-2 flex justify-between items-center'>
                <LanguageSelector language={language} onSelect={onSelectLanguage} />
                <div className='flex gap-2'>
                    <button 
                        className='btn btn-sm btn-success'
                        onClick={handleRun}
                        disabled={isLoadingRun}
                    >
                        {isLoadingRun ? <span className='loading loading-spinner loading-xs'></span> : "Run Code"}
                    </button>
                    <button 
                        className='btn btn-sm btn-primary'
                        onClick={handleSubmit}
                        disabled={isLoadingSubmit}
                    >
                        {isLoadingSubmit ? <span className='loading loading-spinner loading-xs'></span> : "Submit"}
                    </button>
                </div>
            </div>

            {/* Simulação do Editor de Código (Monaco Editor) */}
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className='flex-1 bg-gray-900 text-white p-4 font-mono outline-none resize-none'
                style={{ tabSize: 4 }}
            />
        </div>
    );
};

export default CodeSpace;