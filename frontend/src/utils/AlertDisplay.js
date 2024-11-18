import React, { useContext } from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AlertContext } from "./AlertContext";

const AlertDisplay = () => {
    const { alert, closeAlert } = useContext(AlertContext);

    return (
        <Snackbar
            open={alert.open}
            autoHideDuration={null}
            onClose={closeAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }} // Set the position to top center
            action={
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={closeAlert}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        >
            <Alert onClose={closeAlert} severity={alert.severity}>
                {alert.message}
            </Alert>
        </Snackbar>
    );
};

export default AlertDisplay;
