import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("authToken"),
    );
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const login = (token) => {
        localStorage.setItem("authToken", token);
        setAuthToken(token);
        setIsAuthenticated(true);
    };

    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setIsAuthenticated(false);
        navigate("/login");
    }, [navigate]);

    // Verify token on page load or refresh
    useEffect(() => {
        const verifyToken = () => {
            if (authToken) {
                try {
                    axios
                        .post(
                            "/auth/verify-token/",
                            {},
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${authToken}`,
                                },
                            },
                        )
                        .then((response) => {
                            if (response.status === 200) {
                                setIsAuthenticated(true);
                            } else {
                                logout();
                            }
                        })
                        .catch(() => {
                            logout();
                        });
                } catch (_) {
                    logout();
                }
            } else {
                setIsAuthenticated(false);
            }
        };
        verifyToken();
    }, [authToken, logout]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
