import { useContext, useEffect, useState, useRef } from "react";
import {
    TextField,
    Button,
    Box,
    Link,
    Typography,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import { Turnstile } from "@marsidev/react-turnstile";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const captchaRef = useRef(null);
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

    const handleCaptchaChange = (token) => {
        setCaptchaValue(token);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            showAlert("Invalid email format!", "error");
            return;
        }
        if (!captchaValue) {
            showAlert("Please complete the CAPTCHA", "error");
            return;
        }
        setLoading(true);
        axios
            .post("/auth/send-invite/", {
                email,
                captcha: captchaValue,
            })
            .then((response) => {
                const { data, status } = response || {},
                    { message, success } = data || {};
                if (status === 200 && success === true) {
                    showAlert(message, "success", 5000);
                    setEmail("");
                    if (captchaRef.current) {
                        captchaRef.current.reset();
                    }
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
            })
            .finally(() => {
                setLoading(false);
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
                disabled={loading}
            />
            <Turnstile
                ref={captchaRef}
                siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
                onSuccess={handleCaptchaChange}
                style={{ textAlign: "center" }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
            >
                {loading ? "Submitting..." : "Register"}
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
