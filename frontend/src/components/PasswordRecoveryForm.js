import React, { useContext, useState, useRef, useEffect } from "react";
import {
    TextField,
    Button,
    Typography,
    Link,
    Box,
    CircularProgress,
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
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "300px",
                margin: "auto",
                mt: 5,
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Add a white background with some transparency
            }}
        >
            <Typography
                variant="h5"
                textAlign="center"
                sx={{ color: "#FF8E53" }}
            >
                Recover Your Password
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#FF8E53",
                        },
                        "&:hover fieldset": {
                            borderColor: "#FE6B8B",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#FF8E53",
                        },
                    },
                }}
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
                fullWidth
                sx={{
                    marginTop: 2,
                    background:
                        "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    color: "white",
                    "&:hover": {
                        background:
                            "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
                    },
                }}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
            >
                {loading ? "Submitting..." : "Submit"}
            </Button>
            <Typography
                variant="body2"
                align="center"
                style={{ marginTop: "16px" }}
            >
                Remembered your password?{" "}
                <Link
                    component="button"
                    underline="hover"
                    onClick={() => navigate("/login")}
                    sx={{ color: "#FF8E53" }}
                >
                    Login
                </Link>
            </Typography>
        </Box>
    );
};

export default PasswordRecoveryForm;
