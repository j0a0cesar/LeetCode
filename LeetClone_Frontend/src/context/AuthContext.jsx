// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {number} userId
 * @property {string} nomeUsuario
 * @property {string} nomeCompleto
 */

/**
 * @typedef {Object} AuthContextType
 * @property {LoginResponse|null} authUser
 * @property {React.Dispatch<React.SetStateAction<LoginResponse|null>>} setAuthUser
 */

// Passamos um defaultValue para satisfazer o checkJs/TS.
export const AuthContext = createContext(
  /** @type {AuthContextType} */ ({ authUser: null, setAuthUser: () => {} })
);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("leetcode-user")) || null;
    } catch {
      return null;
    }
  });

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
