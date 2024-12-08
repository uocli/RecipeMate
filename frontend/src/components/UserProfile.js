import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    TextField,
    Paper,
    Tabs,
    Tab,
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Backdrop,
    Grid2 as Grid,
} from "@mui/material";
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import useAxios from "../utils/useAxios";

const UserProfile = () => {
    const axiosInstance = useAxios();
    const { showAlert } = useContext(AlertContext);
    const { setUser } = useContext(AuthContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleChangePassword = (event) => {
        event.preventDefault();
        setLoading(true);
        axiosInstance
            .post("/api/password/change/")
            .then((response) => {
                const { status, data } = response || {},
                    { success, message } = data || {};
                if (status === 200 && success) {
                    showAlert(message, "success");
                } else {
                    showAlert(message, "error");
                }
            })
            .catch((_) => {
                showAlert("Error changing password!", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleUpdateEmail = (event) => {
        event.preventDefault();
        setEmailLoading(true);
        axiosInstance
            .post("/api/email/change/", { new_email: newEmail })
            .then((response) => {
                const { status, data } = response || {},
                    { success, message } = data || {};
                if (status === 200 && success) {
                    showAlert(message, "success");
                    setIsDialogOpen(false);
                    setNewEmail("");
                } else {
                    showAlert(message, "error");
                }
            })
            .catch((_) => {
                showAlert("Error updating email!", "error");
            })
            .finally(() => {
                setEmailLoading(false);
            });
    };

    useEffect(() => {
        const initializeData = async () => {
            axiosInstance
                .get("/api/user-profile/")
                .then((response) => {
                    if (response.status === 200) {
                        const { user } = response.data || {},
                            { first_name, last_name } = user || {};
                        setFirstName(first_name);
                        setLastName(last_name);
                        setUser(user || {});
                    }
                })
                .catch((_) => {
                    showAlert("Error fetching user data!", "error");
                });
        };
        initializeData().catch((_) => {
            showAlert("Error fetching user data!", "error");
        });
    }, []);

    const handleAccountUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        axiosInstance
            .post("/api/user-profile/", {
                first_name: firstName,
                last_name: lastName,
            })
            .then((response) => {
                if (response.status === 200) {
                    setUser(response.data?.user);
                    showAlert("Account updated successfully!", "success");
                } else {
                    showAlert("Error updating account!", "error");
                }
            })
            .catch((_) => {
                showAlert("Error updating account!", "error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const a11yProps = (index) => {
        return {
            id: `tab-${index}`,
            "aria-controls": `tabpanel-${index}`,
        };
    };

    const settings = {
        General: (
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Box
                    component="form"
                    onSubmit={handleAccountUpdate}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: { xs: "100%", md: "33%" },
                        margin: 0,
                    }}
                >
                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        disabled={loading}
                        sx={{
                            "& .MuiInputLabel-root": { color: "primary.main" },
                        }}
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        margin="normal"
                        disabled={loading}
                        sx={{
                            "& .MuiInputLabel-root": { color: "primary.main" },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            mt: 2,
                            background:
                                "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                            color: "white",
                        }}
                        disabled={loading}
                    >
                        Update Account
                    </Button>
                </Box>
            </Paper>
        ),
        Securities: (
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid
                        component="form"
                        onSubmit={handleChangePassword}
                        item
                        xs={12}
                        md={4}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            startIcon={
                                loading && (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                )
                            }
                            style={{ position: "relative" }}
                            sx={{
                                background:
                                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                color: "white",
                            }}
                        >
                            Change Password
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            onClick={() => setIsDialogOpen(true)}
                            disabled={emailLoading}
                            sx={{
                                background:
                                    "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                color: "white",
                            }}
                        >
                            Change Email
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        ),
    };

    const [value, setValue] = useState(0);
    const tabLabels = Object.keys(settings);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
            >
                {tabLabels.map((label, index) => (
                    <Tab label={label} key={index} {...a11yProps(index)} />
                ))}
            </Tabs>
            {tabLabels.map((label, index) => (
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`tabpanel-${index}`}
                    aria-labelledby={`tab-${index}`}
                    key={index}
                >
                    {value === index && settings[label]}
                </div>
            ))}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="md"
                fullWidth
                sx={{
                    "& .MuiPaper-root": {
                        borderRadius: 2,
                        boxShadow: 3,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        background:
                            "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                        color: "white",
                        padding: 2,
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    Change Email
                </DialogTitle>
                <DialogContent sx={{ padding: 3 }}>
                    <DialogContentText
                        sx={{
                            marginBottom: 2,
                            fontSize: "1.1rem",
                            color: "#333",
                        }}
                    >
                        Please enter your new email address.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Email"
                        type="email"
                        fullWidth
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        sx={{
                            "& .MuiInputLabel-root": { color: "primary.main" },
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                            },
                            marginBottom: 1,
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ padding: 2, justifyContent: "center" }}>
                    <Button
                        onClick={() => setIsDialogOpen(false)}
                        variant="outlined"
                        sx={{
                            color: "#D84315",
                            borderColor: "#D84315",
                            "&:hover": {
                                borderColor: "#FF8E53",
                                backgroundColor: "rgba(255, 142, 83, 0.1)",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateEmail}
                        color="primary"
                        variant="contained"
                        sx={{
                            background:
                                "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                            color: "white",
                            marginLeft: 2,
                            "&:hover": {
                                background:
                                    "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
                            },
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={emailLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Dialog>
        </Box>
    );
};

export default UserProfile;
