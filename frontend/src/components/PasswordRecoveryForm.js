import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    Box,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const ALERT_SEVERITY = {
    SUCCESS: "success",
    ERROR: "error",
};

const PasswordRecoveryForm = () => {
    const [email, setEmail] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState(ALERT_SEVERITY.SUCCESS);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email?.trim()) {
            setLoading(true);
            axios
                .post(
                    "/api/password/forgot/",
                    {
                        email,
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
                        setAlertSeverity(ALERT_SEVERITY.SUCCESS);
                    } else {
                        setAlertSeverity(ALERT_SEVERITY.ERROR);
                    }
                    setAlertMessage(message);
                })
                .finally(() => {
                    setLoading(false);
                    setTimeout(() => {
                        setAlertMessage("");
                    }, 3000);
                });
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 400, margin: "auto", padding: 4 }}
        >
            {alertMessage && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
            )}
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
