import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Cookies from "js-cookie";
import useAxios from "./useAxios";

const ProtectedRoute = ({ children }) => {
    const axios = useAxios();
    const { isAuthenticated, authTokens, logout, setAuthTokens, setUser } =
        useContext(AuthContext);
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (authTokens) {
                axios
                    .post(
                        "/auth/token/verify/",
                        {},
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authTokens.access}`,
                                "X-CSRFToken": Cookies.get("csrftoken"),
                            },
                        },
                    )
                    .then((response) => {
                        const { status, data } = response || {},
                            { success, user } = data || {};
                        if (status === 200 && success) {
                            setUser(user || {});
                        } else {
                            // refresh token
                            axios
                                .post("/auth/token/refresh/", {
                                    refresh: authTokens.refresh,
                                })
                                .then((response) => {
                                    const { data } = response || {},
                                        { access, refresh, user } = data || {};
                                    setAuthTokens({ access, refresh });
                                    setUser(user || {});
                                    Cookies.set(
                                        "access_token",
                                        response.data.access,
                                    );
                                });
                        }
                    });
            }
        };
        verifyToken()
            .catch(() => {
                logout();
            })
            .finally(() => {
                setLoading(false);
            });
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
