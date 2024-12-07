import React, { useContext, useState, useRef } from "react";
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
    const captchaRef = useRef(null);
    const navigate = useNavigate();

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
            sx={{ maxWidth: 400, margin: "auto", padding: 4 }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                Recover Your Password
            </Typography>
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                disabled={loading}
                margin="normal"
                type="email"
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
                >
                    Login
                </Link>
            </Typography>
        </Box>
    );
};

export default PasswordRecoveryForm;
