import { useContext, useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Link,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Turnstile } from "@marsidev/react-turnstile";

const LoginForm = () => {
    const { showAlert } = useContext(AlertContext);
    const [password, setPassword] = useState("");
    const { login, setUser, isAuthenticated } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [captchaValue, setCaptchaValue] = useState(null);
    const captchaRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const queryParams = new URLSearchParams(location.search);
    const initialEmail = queryParams.get("un") || "";
    const [email, setEmail] = useState(initialEmail || "");

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleCaptchaChange = (token) => {
        setCaptchaValue(token);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!captchaValue) {
            showAlert("Please complete the CAPTCHA", "error");
            return;
        }
        setLoading(true);
        axios
            .post(
                "/auth/login/",
                { email, password, captcha: captchaValue },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": Cookies.get("csrftoken"),
                    },
                },
            )
            .then(({ status, data }) => {
                if (status === 200) {
                    showAlert("Logged in successfully!", "success");
                    const access = Cookies.get("access_token");
                    const refresh = Cookies.get("refresh_token");
                    login(access && refresh ? { access, refresh } : null);
                    setUser(data.user || {});
                    navigate(from, { replace: true });
                } else {
                    showAlert(data?.message, "error", null);
                }
            })
            .catch((error) => {
                showAlert(error.response?.data?.message, "error");
            })
            .finally(() => {
                setLoading(false);
                if (captchaRef.current) {
                    captchaRef.current.reset();
                }
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
                Login
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Turnstile
                ref={captchaRef}
                siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
                onSuccess={handleCaptchaChange}
                style={{ textAlign: "center" }}
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
            >
                {loading ? "Submitting..." : "Login"}
            </Button>
            <Typography
                variant="body2"
                align="center"
                style={{ marginTop: "16px" }}
            >
                <Link
                    component="button"
                    underline="hover"
                    onClick={() => navigate("/password-recovery")}
                >
                    Forget your password?
                </Link>
            </Typography>
        </Box>
    );
};

export default LoginForm;
