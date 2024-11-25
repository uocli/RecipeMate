import axios from "axios";
import Cookies from "js-cookie";

// Setup Axios Instance
const http = axios.create({
    baseURL: "/",
    withCredentials: true, // Ensure cookies (including JWT) are sent with each request
    headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
        Authorization: `Bearer ${Cookies.get("access_token")}`,
    },
});

// Interceptor to handle token expiration and auto-refresh
http.interceptors.response.use(
    (response) => response, // If the response is successful, just return it
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401 error (Unauthorized), try to refresh the token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the access token using the refresh token in the cookie
                await axios.post("/auth/token/refresh/", {
                    refresh_token: Cookies.get("refresh_token"),
                }); // POST request to refresh token
                return axios(originalRequest); // Retry the original request
            } catch (refreshError) {
                // If refreshing the token fails, direct the user to login
                console.error("Token refresh failed", refreshError);
                window.location.href = "/login"; // Redirect to login or show an error
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default http;
