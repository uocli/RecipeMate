import {
    createContext,
    useState,
    useCallback,
    useEffect,
    useContext,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { AlertContext } from "./AlertContext";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const access = Cookies.get("access_token");
        const refresh = Cookies.get("refresh_token");
        const access_expiry = Cookies.get("access_expiry");
        return access && refresh && access_expiry
            ? { access, refresh, access_expiry }
            : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!authTokens);
    const [user, setUser] = useState({});

    const { showAlert } = useContext(AlertContext);

    const login = (tokens) => {
        setAuthTokens(tokens);
        setIsAuthenticated(true);
        Cookies.set("access_token", tokens.access);
        Cookies.set("refresh_token", tokens.refresh);
        Cookies.set("access_expiry", tokens.access_expiry);
    };

    const logout = useCallback(() => {
        setAuthTokens(null);
        setIsAuthenticated(false);
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        Cookies.remove("access_expiry");
    }, []);

    const verifyToken = useCallback(async () => {
        if (!authTokens) {
            setIsAuthenticated(false);
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        const tokenExpiry = authTokens.access_expiry;

        if (tokenExpiry < now) {
            try {
                const response = await axios.post("/auth/token/refresh/", {
                    refresh: authTokens.refresh,
                });
                const newTokens = {
                    ...response.data,
                };
                setAuthTokens(newTokens);
                Cookies.set("access_token", newTokens.access);
                Cookies.set("refresh_token", newTokens.refresh);
                Cookies.set("access_expiry", newTokens.access_expiry);
                setIsAuthenticated(true);
            } catch (error) {
                showAlert(
                    "Session expired. Please log in again.",
                    "error",
                    5000,
                );
            }
        } else {
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
                    },
                );
                setIsAuthenticated(true);
            } catch (error) {
                logout();
            }
        }
    }, [authTokens, logout]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                login,
                logout,
                user,
                setUser,
                authTokens,
                setAuthTokens,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
