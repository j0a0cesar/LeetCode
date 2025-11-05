import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { CODE_SNIPPETS } from '../constant.js';
import useSubmit from '../hooks/UseSubmit';

const CodeSpace = ({ problem }) => {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(CODE_SNIPPETS["javascript"]);
    
    const { isLoadingRun, isLoadingSubmit, runCode, submit } = useSubmit();

    useEffect(() => {
        setCode(CODE_SNIPPETS[language] || "");
    }, [language, problem]);

    const onSelectLanguage = (lang) => {
        setLanguage(lang);
    };

    const handleRun = () => {
        runCode(language, code, problem.testCases);
    };

    const handleSubmit = () => {
        submit(problem.id, language, code);
    };

    return (
        <div className='flex-1 flex flex-col h-1-2 bg-gray-900 text-white'>
            {/* Barra de ferramentas */}
            <div className='bg-gray-800 p-3 flex justify-between items-center border-b border-gray-700'>
                <LanguageSelector language={language} onSelect={onSelectLanguage} />
                <div className='flex gap-3'>
                    <button 
                        className='btn btn-sm btn-success'
                        onClick={handleRun}
                        disabled={isLoadingRun}
                    >
                        {isLoadingRun ? (
                            <span className='loading loading-spinner loading-xs'></span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                </svg>
                                Run Code
                            </>
                        )}
                    </button>
                    <button 
                        className='btn btn-sm btn-primary'
                        onClick={handleSubmit}
                        disabled={isLoadingSubmit}
                    >
                        {isLoadingSubmit ? (
                            <span className='loading loading-spinner loading-xs'></span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                Submit
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Editor de código */}
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className='code-editor flex-1 p-4 outline-none resize-none'
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
            />
        </div>
    );
};

export default CodeSpace;