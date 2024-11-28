import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./components/App";
import AuthProvider from "./utils/AuthContext";
import { AlertProvider } from "./utils/AlertContext";
import AlertDisplay from "./utils/AlertDisplay";

// Register the service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-workers/service-worker.js")
            .then(
                (registration) => {
                    console.log(
                        "ServiceWorker registration successful with scope: ",
                        registration.scope,
                    );
                },
                (error) => {
                    console.log("ServiceWorker registration failed: ", error);
                },
            );
    });
}

// Unregister the service worker
window.addEventListener("beforeunload", () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            registrations.forEach((registration) => {
                registration.unregister();
            });
        });
    }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <AlertProvider>
                <AlertDisplay />
                <AuthProvider>
                    <App />
                </AuthProvider>
            </AlertProvider>
        </Router>
    </React.StrictMode>,
);
