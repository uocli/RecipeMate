import { useContext, useState } from "react";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { AlertContext } from "../utils/AlertContext";

const LABELS = {
    PASSWORDS_NOT_MATCH: "Passwords do not match",
    ERROR_RESETTING_PASSWORD: "Error resetting password",
};

const PasswordReset = () => {
    const { showAlert } = useContext(AlertContext);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
                    "/api/password/reset/",
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
                        showAlert(message, "success");
                        setTimeout(() => {
                            navigate("/login");
                        }, 500);
                    } else {
                        message(
                            message || LABELS.ERROR_RESETTING_PASSWORD,
                            "error",
                        );
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            showAlert(LABELS.PASSWORDS_NOT_MATCH, "error");
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
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
