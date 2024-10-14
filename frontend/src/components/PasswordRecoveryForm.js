import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    AlertTitle,
    Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PasswordRecoveryForm = () => {
    const [email, setEmail] = useState("");
    const [showAlert, setShowAlert] = useState(false); // Manage alert visibility
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowAlert(true);
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
            {showAlert && (
                <Alert
                    severity="success"
                    onClose={() => setShowAlert(false)}
                    style={{ marginBottom: "16px" }}
                >
                    <AlertTitle>Success</AlertTitle>A password recovery link has
                    been sent to <strong>{email}</strong>!
                </Alert>
            )}

            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                type="email"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "16px" }}
            >
                Submit
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
