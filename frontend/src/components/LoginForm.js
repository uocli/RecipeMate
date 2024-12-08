// import { useContext, useEffect, useState } from "react";
// import { Box, Button, Link, TextField, Typography } from "@mui/material";
// import { AuthContext } from "../utils/AuthContext";
// import { AlertContext } from "../utils/AlertContext";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Cookies from "js-cookie";

// const LoginForm = () => {
//     const { showAlert } = useContext(AlertContext);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const { login, setUser, isAuthenticated } = useContext(AuthContext);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const from = location.state?.from?.pathname || "/";

//     useEffect(() => {
//         if (isAuthenticated) {
//             navigate("/");
//         }
//     }, [isAuthenticated, navigate]);

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         axios
//             .post(
//                 "/auth/login/",
//                 { email, password },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         "X-CSRFToken": Cookies.get("csrftoken"),
//                     },
//                 },
//             )
//             .then(({ status, data }) => {
//                 if (status === 200) {
//                     showAlert("Logged in successfully!", "success");
//                     const access = Cookies.get("access_token");
//                     const refresh = Cookies.get("refresh_token");
//                     login(access && refresh ? { access, refresh } : null);
//                     setUser(data.user || {});
//                     navigate(from, { replace: true });
//                 } else {
//                     showAlert(data?.message, "error", null);
//                 }
//             })
//             .catch((error) => {
//                 showAlert(error.response?.data?.message, "error");
//             });
//     };

//     return (
//         <Box
//             component="form"
//             onSubmit={handleSubmit}
//             sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 2,
//                 width: "300px",
//                 margin: "auto",
//                 mt: 5,
//             }}
//         >
//             <Typography variant="h5" textAlign="center">
//                 Login
//             </Typography>
//             <TextField
//                 label="Email"
//                 variant="outlined"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//             />
//             <TextField
//                 label="Password"
//                 variant="outlined"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//             />
//             <Button variant="contained" color="primary" type="submit">
//                 Login
//             </Button>
//             <Typography
//                 variant="body2"
//                 align="center"
//                 style={{ marginTop: "16px" }}
//             >
//                 <Link
//                     component="button"
//                     underline="hover"
//                     onClick={() => navigate("/password-recovery")}
//                 >
//                     Forget your password?
//                 </Link>
//             </Typography>
//         </Box>
//     );
// };

// export default LoginForm;


import { useContext, useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Link,
    TextField,
    Typography,
    CircularProgress,
    Paper,
} from "@mui/material";
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { Turnstile } from "@marsidev/react-turnstile";
import backgroundImage from "../assets/images/login-background.jpg";

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
            sx={{
                position: "relative",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: `url(${backgroundImage})`,
                overflow: "hidden",
                backgroundSize: "cover",
                backgroundPosition: "center center",
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
                    background: "rgba(28, 146, 210, 0.7)",
                    filter: "blur(8px)",
                }}
            />

            {/* Login Form */}
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
                        color: "#1c92d2",
                    }}
                >
                    Welcome Back!
                </Typography>
                <Typography
                    variant="body1"
                    textAlign="center"
                    mb={3}
                    sx={{ color: "#555" }}
                >
                    Please login to continue
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
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />
                    <Turnstile
                        ref={captchaRef}
                        siteKey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
                        onSuccess={handleCaptchaChange}
                        style={{ textAlign: "center" }}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{
                            background: "linear-gradient(to right, #1c92d2, #f2fcfe)",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "10px",
                            borderRadius: "8px",
                            transition: "0.3s ease",
                            "&:hover": {
                                background: "linear-gradient(to left, #1c92d2, #f2fcfe)",
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        Login
                    </Button>
                </Box>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ marginTop: 2, color: "#777" }}
                >
                    <Link
                        component="button"
                        underline="hover"
                        onClick={() => navigate("/password-recovery")}
                        sx={{
                            color: "#1c92d2",
                            "&:hover": {
                                textDecoration: "underline",
                            },
                        }}
                    >
                        Forget your password?
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
};

export default LoginForm;
