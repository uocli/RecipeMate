import { useContext, useState, useEffect } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertContext } from "../utils/AlertContext";

const CompleteEmailChange = () => {
    const { showAlert } = useContext(AlertContext);
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    let navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    const handleChangeEmail = async () => {
        if (!token) {
            showAlert("Token is required!", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "/api/email/change/complete/",
                null,
                {
                    params: { token },
                },
            );

            const { data, status } = response || {},
                { success, message } = data || {};
            if (status === 200 && success === true) {
                showAlert(message, "success");
                setTimeout(() => {
                    navigate("/login");
                }, 500);
            } else {
                showAlert(message || "Error changing email", "error");
            }
        } catch (error) {
            showAlert(
                error.response?.data?.message || "Error changing email",
                "error",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                onClick={handleChangeEmail}
                startIcon={loading && <CircularProgress size={20} />}
            >
                {loading ? "Processing..." : "Change Email"}
            </Button>
        </Box>
    );
};

export default CompleteEmailChange;
