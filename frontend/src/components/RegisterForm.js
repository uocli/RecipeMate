import { useContext, useEffect, useState, useRef } from "react";
import {
    TextField,
    Button,
    Box,
    Link,
    Typography,
    CircularProgress,
    Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import { Turnstile } from "@marsidev/react-turnstile";

const RegisterForm = () => {
    const [backgroundImage, setBackgroundImage] = useState("");
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

    useEffect(() => {
        // Fetch the background image URL from your API
        axios
            .get("/api/background-image/")
            .then((response) => {
                setBackgroundImage(response.data.imageUrl);
            })
            .catch((error) => {
                console.error("Error fetching background image:", error);
            });
    }, []);

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
            sx={{
                position: "relative",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                marginTop: "-64px", // Adjust this value based on the height of your header
            }}
        >
            {/* Background Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                }}
            />

            {/* Register Form */}
            <Paper
                elevation={6}
                sx={{
                    padding: "40px 30px",
                    borderRadius: "16px",
                    maxWidth: "400px",
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Typography
                    variant="h4"
                    textAlign="center"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        background:
                            "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Register
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
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
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Turnstile
                            ref={captchaRef}
                            siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
                            onSuccess={handleCaptchaChange}
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            background:
                                "linear-gradient(to right, #FE6B8B, #FF8E53)",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "10px",
                            borderRadius: "8px",
                            transition: "0.3s ease",
                            "&:hover": {
                                background:
                                    "linear-gradient(to left, #FE6B8B, #FF8E53)",
                                transform: "scale(1.05)",
                            },
                        }}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        {loading ? "Submitting..." : "Register"}
                    </Button>
                </Box>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ marginTop: 2, color: "#777" }}
                >
                    Already have an account?{" "}
                    <Link
                        component="button"
                        underline="hover"
                        onClick={() => navigate("/login")}
                        sx={{
                            color: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                            "&:hover": {
                                textDecoration: "underline",
                            },
                        }}
                    >
                        Login
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default RegisterForm;
