import React, { useContext, useState } from "react";
import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import { AuthContext } from "../utils/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { login, setUser } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");

        axios
            .post(
                "/auth/login/",
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": Cookies.get("csrftoken"),
                    },
                },
            )
            .then(({ status, data }) => {
                if (status === 200) {
                    setMessage("Logged in successfully!");
                    login();
                    setUser(data.user || {});
                    navigate(from, { replace: true });
                } else {
                    setError(data?.message);
                }
            })
            .catch((error) => {
                setError(error.response?.data?.message);
            });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 400, margin: "auto", padding: 4 }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Login
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                type="submit"
            >
                Login
            </Button>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <Typography
                variant="body2"
                align="center"
                style={{ marginTop: "16px" }}
            >
                <Link
                    component="button"
                    underline="hover"
                    onClick={() => navigate("/password-recovery")}
                >
                    Forget your password?
                </Link>
            </Typography>
        </Box>
    );
};

export default LoginForm;
