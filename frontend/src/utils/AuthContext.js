import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("authToken"),
    );
    const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);

    // Update login state if the token changes
    useEffect(() => {
        setIsAuthenticated(!!authToken);
    }, [authToken]);

    const login = (token) => {
        localStorage.setItem("authToken", token);
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setAuthToken(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
