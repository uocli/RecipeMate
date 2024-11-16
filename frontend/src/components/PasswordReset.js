import React, { useState } from "react";
import { TextField, Button, Alert, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

const ALERT_SEVERITY = {
    SUCCESS: "success",
    ERROR: "error",
};

const LABELS = {
    PASSWORDS_NOT_MATCH: "Passwords do not match",
    ERROR_RESETTING_PASSWORD: "Error resetting password",
};

const PasswordReset = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState(ALERT_SEVERITY.SUCCESS);
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    let navigate = useNavigate();
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setLoading(true);
            axios
                .post(
                    "/api/password-reset/",
                    {
                        password,
                        confirmPassword,
                        id,
                        token,
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
                        setAlertMessage(message);
                        setAlertSeverity(ALERT_SEVERITY.SUCCESS);
                        setTimeout(() => {
                            navigate("/login");
                        }, 500);
                    } else {
                        setAlertMessage(
                            message || LABELS.ERROR_RESETTING_PASSWORD,
                        );
                        setAlertSeverity(ALERT_SEVERITY.ERROR);
                    }
                })
                .finally(() => {
                    setLoading(false);
                    setTimeout(() => {
                        setAlertSeverity("");
                        setAlertMessage("");
                    }, 3000);
                });
        } else {
            setAlertMessage(LABELS.PASSWORDS_NOT_MATCH);
            setAlertSeverity(ALERT_SEVERITY.ERROR);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
            {alertMessage && (
                <Alert severity={alertSeverity}>{alertMessage}</Alert>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    disabled={loading}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    disabled={loading}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
            </form>
        </Box>
    );
};
export default PasswordReset;
