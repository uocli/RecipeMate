import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import Cookies from "js-cookie";
import { AlertContext } from "./AlertContext";

let refresh = false;

const useAxios = () => {
    const { authTokens, setAuthTokens, logout } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);

    const axiosInstance = axios.create({
        baseURL: "/",
        withCredentials: true, // Ensure cookies (including JWT) are sent with each request
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
            Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            if (!authTokens) {
                return config;
            }

            const now = Math.floor(Date.now() / 1000);
            const tokenExpiry = Math.floor(
                new Date(authTokens.access_expiry).getTime() / 1000,
            );

            if (tokenExpiry < now) {
                try {
                    const response = await axios.post("/auth/token/refresh/", {
                        refresh: authTokens.refresh,
                    });
                    setAuthTokens(response.data);
                    Cookies.set("access_token", response.data.access);
                    Cookies.set("refresh_token", response.data.refresh);
                    Cookies.set("access_expiry", response.data.access_expiry);
                    config.headers.Authorization = `Bearer ${response.data.access}`;
                } catch (error) {
                    showAlert(
                        "Session expired. Please log in again.",
                        "error",
                        5000,
                    );
                    logout();
                }
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    axiosInstance.interceptors.response.use(
        (resp) => resp,
        async (error) => {
            if (error.response.status === 401 && !refresh) {
                refresh = true;
                try {
                    const response = await axios.post(
                        "/auth/token/refresh/",
                        {
                            refresh: Cookies.get("refresh_token"),
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        },
                        { withCredentials: true },
                    );
                    if (response.status === 200) {
                        axios.defaults.headers.common["Authorization"] =
                            `Bearer ${response.data["access"]}`;
                        setAuthTokens(response.data);
                        Cookies.set("access_token", response.data.access);
                        Cookies.set("refresh_token", response.data.refresh);
                        Cookies.set(
                            "access_expiry",
                            response.data.access_expiry,
                        );
                        return axios(error.config);
                    }
                } catch (error) {
                    showAlert(
                        "Session expired. Please log in again.",
                        "error",
                        5000,
                    );
                    logout();
                }
            }
            refresh = false;
            return Promise.reject(error);
        },
    );

    return axiosInstance;
};

export default useAxios;
