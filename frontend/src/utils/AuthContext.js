import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCsrfToken } from "./CsrfCookie";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("access_token")
    );
    const navigate = useNavigate();

    const login = (access_token) => {
        localStorage.setItem("access_token", access_token);
        setIsAuthenticated(true);
    };

    const logout = useCallback(() => {
        localStorage.removeItem("access_token");
        setIsAuthenticated(false);
        navigate("/login");
    }, [navigate]);

    // Verify token on page load or refresh
    useEffect(() => {
        const verifyToken = () => {
            const access_token = localStorage.getItem("access_token");
            if (access_token) {
                try {
                    axios.post(
                        "/auth/token/verify/",
                        {},
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${access_token}`,
                                "X-CSRFToken": getCsrfToken(),
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
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
