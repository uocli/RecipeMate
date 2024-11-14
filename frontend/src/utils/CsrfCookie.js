import axios from "axios";

export async function getCsrfToken() {
    const response = await axios.post("/auth/csrf-token/", {
        credentials: "include", // Important to include credentials for CSRF
    });

    if (response.status !== 200) {
        throw new Error("Failed to fetch CSRF token");
    }

    const csrfToken = response.data?.csrfToken;
    if (!csrfToken) {
        throw new Error("No set-cookie header found in the response");
    }

    return csrfToken;
}
