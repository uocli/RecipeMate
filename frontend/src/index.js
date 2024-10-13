import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import AuthProvider from "./utils/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
);
