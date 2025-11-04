import React from 'react';
import { LANGUAGE_VERSIONS } from '../constant.js'; // O arquivo que transformamos

const LanguageSelector = ({ language, onSelect }) => {
    const languages = Object.keys(LANGUAGE_VERSIONS);

    return (
        <div className=''>
            <select 
                className='select select-sm max-w-xs bg-gray-700 text-white'
                value={language}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="" disabled>Selecione a Linguagem</option>
                {languages.map((lang) => (
                    <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;