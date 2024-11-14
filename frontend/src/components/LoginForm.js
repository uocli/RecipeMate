import React, { useContext, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { AuthContext } from "../utils/AuthContext";
import http from "../utils/Http";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getCsrfToken } from "../utils/CsrfCookie";

const LoginForm = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [message, setMessage] = useState("");
        const [error, setError] = useState("");
        const { login } = useContext(AuthContext);

        const navigate = useNavigate();
        const location = useLocation();
        const from = location.state?.from?.pathname || "/";

        const handleSubmit = async (event) => {
            event.preventDefault();
            setMessage("");
            setError("");

            axios.post(
                "/auth/login/",
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": await getCsrfToken(),
                    }
                }
            )
                .then(({ status, data }) => {
                    if (status === 200) {
                        const {
                            success,
                            message,
                            access_token,
                            refresh_token,
                        } = data || {};
                        if (success) {
                            setMessage("Logged in successfully!");
                            navigate(from, { replace: true });
                            if (access_token) {
                                login(access_token);
                                localStorage.setItem(
                                    "access_token",
                                    access_token,
                                );
                            }
                            if (refresh_token) {
                                localStorage.setItem(
                                    "refresh_token",
                                    refresh_token,
                                );
                            }
                        } else {
                            setError(message);
                        }
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
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: "300px",
                    margin: "auto",
                    mt: 5,
                }}
            >
                <Typography variant="h5" textAlign="center">
                    Login
                </Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button variant="contained" color="primary" type="submit">
                    Login
                </Button>
                {message && <Alert severity="success">{message}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        );
    }
;

export default LoginForm;
