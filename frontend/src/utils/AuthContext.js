import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const access = Cookies.get("access_token");
        const refresh = Cookies.get("refresh_token");
        return access && refresh ? { access, refresh } : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!authTokens);
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    const login = (tokens) => {
        setAuthTokens(tokens);
        setIsAuthenticated(true);
        Cookies.set("access_token", tokens.access);
        Cookies.set("refresh_token", tokens.refresh);
    };

    const logout = useCallback(async () => {
        await axios.post("/auth/logout/");
        setAuthTokens(null);
        setIsAuthenticated(false);
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        navigate("/");
    }, [navigate]);

    const refreshToken = useCallback(async () => {
        try {
            const response = await axios.post("/auth/token/refresh/", {
                refresh: authTokens.refresh,
            });
            setAuthTokens(response.data);
            Cookies.set("access_token", response.data.access);
        } catch (error) {
            logout();
        }
    }, [authTokens, logout]);

    useEffect(() => {
        const verifyToken = async () => {
            if (authTokens) {
                try {
                    await axios.post(
                        "/auth/token/verify/",
                        {},
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authTokens.access}`,
                                "X-CSRFToken": Cookies.get("csrftoken"),
                            },
                        }
                    );
                    setIsAuthenticated(true);
                } catch {
                    refreshToken();
                }
            } else {
                setIsAuthenticated(false);
            }
        };
        verifyToken();
    }, [authTokens, refreshToken]);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, login, logout, user, setUser, authTokens }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;