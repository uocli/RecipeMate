import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, authTokens, logout, setAuthTokens } = useContext(AuthContext);
    const location = useLocation();
    const [loading, setLoading] = useState(true);

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
                    setLoading(false);
                } catch {
                    try {
                        const response = await axios.post("/auth/token/refresh/", {
                            refresh: authTokens.refresh,
                        });
                        setAuthTokens(response.data);
                        Cookies.set("access_token", response.data.access);
                        setLoading(false);
                    } catch {
                        logout();
                        setLoading(false);
                    }
                }
            } else {
                setLoading(false);
            }
        };
        verifyToken();
    }, [authTokens, logout, setAuthTokens]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;