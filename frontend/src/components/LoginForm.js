import { useContext, useEffect, useState } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const LoginForm = () => {
    const { showAlert } = useContext(AlertContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, setUser, isAuthenticated } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

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
                    showAlert("Logged in successfully!", "success");
                    const access = Cookies.get("access_token");
                    const refresh = Cookies.get("refresh_token");
                    login(access && refresh ? { access, refresh } : null);
                    setUser(data.user || {});
                    navigate(from, { replace: true });
                } else {
                    showAlert(data?.message, "error", null);
                }
            })
            .catch((error) => {
                showAlert(error.response?.data?.message, "error");
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
