import React, { useContext, useEffect, useState } from "react";
import { TextField, Button, Box, Alert, Link, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";

const RegisterForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /.*/;
        // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = formData;
        if (!validateEmail(email)) {
            showAlert("Invalid email format", "error");
            return;
        }

        if (!validatePassword(password)) {
            showAlert(
                "Password must contain uppercase, lowercase, numbers, special characters, and be at least 8 characters long.",
                "error",
            );
            return;
        }

        axios
            .post("/auth/signup/", formData)
            .then((response) => {
                if (response.status === 200) {
                    const { success, message } = response.data || {};
                    if (success) {
                        showAlert(message, "success", 5000);
                        navigate("/login");
                        setFormData({ email: "", password: "" });
                    } else {
                        showAlert(message, "error");
                    }
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
            sx={{ maxWidth: 400, margin: "auto", padding: 4 }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Register
            </Typography>

            <>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Register
                </Button>
                <Typography
                    variant="body2"
                    align="center"
                    style={{ marginTop: "16px" }}
                >
                    Already have an account?{" "}
                    <Link
                        component="button"
                        underline="hover"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Link>
                </Typography>
            </>
        </Box>
    );
};

export default RegisterForm;
