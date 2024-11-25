import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import Cookies from "js-cookie";

let refresh = false;

const useAxios = () => {
    const { authTokens, setAuthTokens, logoutUser } = useContext(AuthContext);

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
            const tokenExpiry = authTokens.access_expiry;

            if (tokenExpiry < now) {
                try {
                    const response = await axios.post("/api/token/refresh/", {
                        refresh: authTokens.refresh,
                    });
                    setAuthTokens(response.data);
                    config.headers.Authorization = `Bearer ${response.data.access}`;
                } catch (error) {
                    logoutUser();
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
                    Cookies.set("access_token", response.data.access);
                    Cookies.set("refresh_token", response.data.refresh);
                    return axios(error.config);
                }
            }
            refresh = false;
            return error;
        },
    );

    return axiosInstance;
};

export default useAxios;
