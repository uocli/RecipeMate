import { useContext, useEffect, useState } from "react";
import { TextField, Button, Box, Link, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
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

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            showAlert("Invalid email format!", "error");
            return;
        }

        axios
            .post("/auth/send-invite/", { email })
            .then((response) => {
                const { data, status } = response || {},
                    { message, success } = data || {};
                if (status === 200 && success === true) {
                    showAlert(message, "success", 5000);
                    navigate("/login");
                } else {
                    showAlert(
                        message || "Failed to send invite email!",
                        "error",
                    );
                }
            })
            .catch((error) => {
                showAlert(
                    error.response?.data?.message ||
                        "Error sending invite email",
                    "error",
                );
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
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                value={email}
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
        </Box>
    );
};

export default RegisterForm;
