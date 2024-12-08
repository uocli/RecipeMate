import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./components/App";
import AuthProvider from "./utils/AuthContext";
import { AlertProvider } from "./utils/AlertContext";
import AlertDisplay from "./utils/AlertDisplay";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./utils/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <AlertProvider>
                <AlertDisplay />
                <AuthProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <App />
                    </ThemeProvider>
                </AuthProvider>
            </AlertProvider>
        </Router>
    </React.StrictMode>,
);
