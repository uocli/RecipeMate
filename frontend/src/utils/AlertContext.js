import { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children, defaultTimeout = 3000 }) => {
    const [alert, setAlert] = useState({
        message: "",
        severity: "success",
        open: false,
    });

    const showAlert = (
        message,
        severity = "success",
        timeout = defaultTimeout,
    ) => {
        setAlert({ message, severity, open: true });
        if (timeout !== null) {
            setTimeout(() => {
                setAlert({ message: "", severity: "success", open: false });
            }, timeout);
        }
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
