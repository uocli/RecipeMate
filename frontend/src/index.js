import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./components/App";
import AuthProvider from "./utils/AuthContext";
import { AlertProvider } from "./utils/AlertContext";
import AlertDisplay from "./utils/AlertDisplay";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <AuthProvider>
                <AlertProvider>
                    <AlertDisplay />
                    <App />
                </AlertProvider>
            </AuthProvider>
        </Router>
    </React.StrictMode>,
);
