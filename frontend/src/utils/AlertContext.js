import { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children, defaultTimeout = 5000 }) => {
    const [alert, setAlert] = useState({
        message: "",
        severity: "success",
        open: false,
        timeout: defaultTimeout,
    });

    const showAlert = (
        message,
        severity = "success",
        timeout = defaultTimeout,
    ) => {
        setAlert({ message, severity, open: true, timeout });
    };

    const closeAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
