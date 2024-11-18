import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    TextField,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Paper,
    Alert,
    Tabs,
    Tab,
    Box,
    CircularProgress,
    Grid2 as Grid,
} from "@mui/material";
import { AuthContext } from "../utils/AuthContext";
import useAxios from "../utils/useAxios";

const UserProfile = () => {
    const axiosInstance = useAxios();
    const { setUser } = useContext(AuthContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [dietaryPreference, setDietaryPreference] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    const [loading, setLoading] = useState(false);

    const [duration, setDuration] = useState("");

    // Handle button click
    const handleChangePassword = (event) => {
        event.preventDefault();
        setLoading(true);
        axiosInstance
            .post("/api/password/change/")
            .then((response) => {
                const { status, data } = response || {},
                    { success, message } = data || {};
                if (status === 200 && success) {
                    setAlertSeverity("success");
                } else {
                    setAlertSeverity("error");
                }
                setAlertMessage(message);
            })
            .catch((_) => {
                setAlertMessage("Error changing password!");
                setAlertSeverity("error");
            })
            .finally(() => {
                setLoading(false);
                setLoading(false);
                setTimeout(() => {
                    setAlertMessage("");
                }, 3000);
            });
    };

    useEffect(() => {
        // Fetch user data from the backend
        const initializeData = async () => {
            axiosInstance
                .get("/api/user-profile/")
                .then((response) => {
                    if (response.status === 200) {
                        const { user } = response.data || {},
                            { first_name, last_name, email, profile } =
                                user || {},
                            { dietary_preference, cooking_time } =
                                profile || {};
                        setFirstName(first_name);
                        setLastName(last_name);
                        setEmail(email);
                        setUser(user || {});
                        setDietaryPreference(dietary_preference || "");
                        setDuration(cooking_time || "");
                    }
                })
                .catch((_) => {
                    setAlertMessage("Error fetching user data!");
                    setAlertSeverity("error");
                });
        };
        initializeData()
            .catch((_) => {
                setAlertMessage("Error fetching user data!");
                setAlertSeverity("error");
            })
            .finally(() => {
                setTimeout(() => {
                    setAlertMessage("");
                }, 3000);
            });
    }, [setUser]);

    const handleAccountUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Handle account update logic
        axiosInstance
            .post("/api/user-profile/", {
                first_name: firstName,
                last_name: lastName,
                email: email,
            })
            .then((response) => {
                if (response.status === 200) {
                    setUser(response.data?.user);
                    setAlertMessage("Account updated successfully!");
                    setAlertSeverity("success");
                } else {
                    setAlertMessage("Error updating account!");
                    setAlertSeverity("error");
                }
            })
            .catch((_) => {
                setAlertMessage("Error updating account!");
                setAlertSeverity("error");
            })
            .finally(() => {
                setLoading(false);
                setTimeout(() => {
                    setAlertMessage("");
                }, 3000);
            });
    };

    const handlePreferenceUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Handle dietary preference update logic
        axiosInstance
            .put("api/user-profile/", {
                dietary_preference: dietaryPreference,
                cooking_time: duration,
            })
            .then((r) => {
                if (r.status === 200) {
                    setAlertMessage("Preferences updated successfully!");
                    setAlertSeverity("success");
                }
            })
            .catch((_) => {
                setAlertMessage("Error updating preferences!");
                setAlertSeverity("error");
            })
            .finally(() => {
                setLoading(false);
                setTimeout(() => {
                    setAlertMessage("");
                }, 3000);
            });
    };

    // Used to enhance accessibility (or a11y) for tab components in React.
    const a11yProps = (index) => {
        return {
            id: `tab-${index}`,
            "aria-controls": `tabpanel-${index}`,
        };
    };

    const settings = {
        "Account Settings": (
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Account Settings
                </Typography>
                <form onSubmit={handleAccountUpdate}>
                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        disabled={loading}
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        margin="normal"
                        disabled={loading}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        Update Account
                    </Button>
                </form>
            </Paper>
        ),
        "Dietary Preferences": (
            <Paper elevation={3} sx={{ padding: 2 }}>
                <form onSubmit={handlePreferenceUpdate}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h5" gutterBottom>
                                Dietary Preferences
                            </Typography>
                            <RadioGroup
                                value={dietaryPreference}
                                onChange={(e) =>
                                    setDietaryPreference(e.target.value)
                                }
                            >
                                <FormControlLabel
                                    value=""
                                    control={<Radio />}
                                    label="No Preference"
                                />
                                <FormControlLabel
                                    value="vegan"
                                    control={<Radio />}
                                    label="Vegan"
                                    disabled={loading}
                                />
                                <FormControlLabel
                                    value="vegetarian"
                                    control={<Radio />}
                                    label="Vegetarian"
                                    disabled={loading}
                                />
                                <FormControlLabel
                                    value="glutenFree"
                                    control={<Radio />}
                                    label="Gluten Free"
                                    disabled={loading}
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h5" gutterBottom>
                                Cooking Time
                            </Typography>
                            <RadioGroup
                                aria-label="duration"
                                name="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            >
                                <FormControlLabel
                                    value="limited"
                                    control={<Radio />}
                                    label="Limited (Less than 30 minutes)"
                                />
                                <FormControlLabel
                                    value="medium"
                                    control={<Radio />}
                                    label="Medium (About 1 hour)"
                                />
                                <FormControlLabel
                                    value="extended"
                                    control={<Radio />}
                                    label="Extended (More than 1 hour)"
                                />
                            </RadioGroup>
                        </Grid>
                        <Grid spacing={3} size={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                disabled={loading}
                            >
                                Save All Changes
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        ),
        "Security Settings": (
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Security Settings
                </Typography>
                <Box component="form" onSubmit={handleChangePassword}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                        startIcon={
                            loading && (
                                <CircularProgress size={24} color="inherit" />
                            )
                        }
                        style={{ position: "relative" }}
                    >
                        Change Password
                    </Button>
                </Box>
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
            {alertMessage && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setAlertMessage("")}
                    sx={{ mb: 2 }}
                >
                    {alertMessage}
                </Alert>
            )}
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
        </Box>
    );
};

export default UserProfile;
