import axios from "axios";
import { getCsrfToken } from "./CsrfCookie";


// Setup Axios Instance
const http = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": await getCsrfToken(),
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
});


// Interceptor to handle token expiration and auto-refresh
http.interceptors.response.use(
    (response) => response, // If the request is successful, just return the response
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh_token");

            try {
                // Attempt to refresh the access token
                const response = await axios.post("/api/token/refresh/", {
                    refresh_token: refreshToken,
                });

                // Update localStorage with the new tokens
                const newAccessToken = response.data.access_token;
                const newRefreshToken = response.data.refresh_token;
                localStorage.setItem("access_token", newAccessToken);
                localStorage.setItem("refresh_token", newRefreshToken);

                // Retry the original request with the new access token
                originalRequest.headers["Authorization"] =
                    `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // Optionally, handle failed refresh (e.g., log out user)
                localStorage.removeItem("access_token");
                localStorage.removeItem("access_token");
            }
        }

        return Promise.reject(error);
    },
);


export default http;
