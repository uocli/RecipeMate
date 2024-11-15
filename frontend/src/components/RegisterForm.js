import React, { useContext, useEffect, useState } from "react";
import { TextField, Button, Box, Alert, Link, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

const RegisterForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

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
            setError("Invalid email format");
            return;
        }

        if (!validatePassword(password)) {
            setError(
                "Password must contain uppercase, lowercase, numbers, special characters, and be at least 8 characters long.",
            );
            return;
        }

        axios.post("/auth/signup/", formData)
            .then((response) => {
                if (response.status === 200) {
                    const { success, message } = response.data || {};
                    if (success) {
                        setSuccess(true);
                        setFormData({ email: "", password: "" });
                        setError("");
                    } else {
                        setError(message);
                        setSuccess(false)
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
            sx={{ maxWidth: 400, margin: "auto", padding: 4 }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Register
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success ? (
                <Alert severity="success">
                    You have successfully registered. Go to{" "}
                    <Link underline="hover" onClick={() => navigate("/login")}>
                        login
                    </Link>{" "}
                    page to login.
                </Alert>
            ) : (
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
            )}
        </Box>
    );
};

export default RegisterForm;
