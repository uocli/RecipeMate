import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const access_token = Cookies.get("access_token"); // Use a helper function to read cookies
    const [isAuthenticated, setIsAuthenticated] = useState(!!access_token);
    const navigate = useNavigate();

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = useCallback(async () => {
        await axios.post("auth/logout/");
        setIsAuthenticated(false);
        navigate("/login");
    }, [navigate]);

    // Verify token on page load or refresh
    useEffect(() => {
        const verifyToken = () => {
            if (access_token) {
                try {
                    axios
                        .post(
                            "/auth/token/verify/",
                            {},
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${Cookies.get("access_token")}`,
                                    "X-CSRFToken": Cookies.get("csrftoken"),
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
    }, [access_token, logout]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
