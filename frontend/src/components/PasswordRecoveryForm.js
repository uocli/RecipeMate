import React, { useContext, useState, useRef, useEffect } from "react";
import {
    TextField,
    Button,
    Typography,
    Link,
    Box,
    CircularProgress,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { AlertContext } from "../utils/AlertContext";
import { Turnstile } from "@marsidev/react-turnstile";

const PasswordRecoveryForm = () => {
    const { showAlert } = useContext(AlertContext);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState("");
    const captchaRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the background image URL from the backend
        axios
            .get("/api/background-image/")
            .then((response) => {
                setBackgroundImage(response.data.imageUrl);
            })
            .catch((error) => {
                console.error("Error fetching background image:", error);
            });
    }, []);

    const handleCaptchaChange = (token) => {
        setCaptchaValue(token);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!captchaValue) {
            showAlert("Please complete the CAPTCHA", "error");
            return;
        }
        if (email?.trim()) {
            setLoading(true);
            axios
                .post(
                    "/api/password/forgot/",
                    {
                        email,
                        captcha: captchaValue,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": Cookies.get("csrftoken"),
                        },
                    },
                )
                .then((response) => {
                    const { data, status } = response || {},
                        { success, message } = data || {};
                    if (status === 200 && success === true) {
                        showAlert(message, "success");
                        setEmail("");
                    } else {
                        showAlert(message, "error");
                    }
                })
                .finally(() => {
                    setLoading(false);
                    if (captchaRef.current) {
                        captchaRef.current.reset();
                    }
                });
        }
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
                backgroundSize: "cover",
                backgroundImage: `url(${backgroundImage})`,
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
                    background: "white",
                }}
            />

            {/* Password Recovery Form */}
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
                    Recover Your Password
                </Typography>
                <Typography
                    variant="body1"
                    textAlign="center"
                    mb={3}
                    sx={{ color: "#555" }}
                >
                    Please enter your email to receive a password reset link
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
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Turnstile
                            ref={captchaRef}
                            siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
                            onSuccess={handleCaptchaChange}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        type="submit"
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
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </Box>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ marginTop: 2, color: "#777" }}
                >
                    Remembered your password?{" "}
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

export default PasswordRecoveryForm;
