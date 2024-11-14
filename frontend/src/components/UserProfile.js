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
} from "@mui/material";
import http from "../utils/Http";
import { AuthContext } from "../utils/AuthContext";

const UserProfile = () => {
    const { setUser } = useContext(AuthContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dietaryPreference, setDietaryPreference] = useState("none");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        // Fetch user data from the backend
        http.get("/api/user-profile/")
            .then((response) => {
                if (response.status === 200) {
                    const { user } = response.data || {},
                        { first_name, last_name, email } = user || {};
                    setFirstName(first_name);
                    setLastName(last_name);
                    setEmail(email);
                    setUser(user || {});
                }
            })
            .catch((_) => {
                setAlertMessage("Error fetching user data!");
                setAlertSeverity("error");
            });
    }, []);

    const handleAccountUpdate = (e) => {
        e.preventDefault();
        setDisabled(true);
        // Handle account update logic
        http.post("/api/user-profile/", {
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
                setDisabled(false);
                setTimeout(() => {
                    setAlertMessage("");
                }, 3000);
            });
    };

    const handlePreferenceUpdate = (e) => {
        e.preventDefault();
        // Handle dietary preference update logic
        setAlertMessage("Preferences updated successfully!");
        setAlertSeverity("success");
        setTimeout(() => {
            setAlertMessage("");
        }, 3000);
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
                        disabled={disabled}
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        margin="normal"
                        disabled={disabled}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        disabled={disabled}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={disabled}
                    >
                        Update Account
                    </Button>
                </form>
            </Paper>
        ),
        "Dietary Preferences": (
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Dietary Preferences
                </Typography>
                <form onSubmit={handlePreferenceUpdate}>
                    <RadioGroup
                        value={dietaryPreference}
                        onChange={(e) => setDietaryPreference(e.target.value)}
                    >
                        <FormControlLabel
                            value="none"
                            control={<Radio />}
                            label="No Preference"
                        />
                        <FormControlLabel
                            value="vegan"
                            control={<Radio />}
                            label="Vegan"
                            disabled={disabled}
                        />
                        <FormControlLabel
                            value="vegetarian"
                            control={<Radio />}
                            label="Vegetarian"
                            disabled={disabled}
                        />
                        <FormControlLabel
                            value="glutenFree"
                            control={<Radio />}
                            label="Gluten Free"
                            disabled={disabled}
                        />
                    </RadioGroup>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={disabled}
                    >
                        Save Preferences
                    </Button>
                </form>
            </Paper>
        ),
        "Security Settings": (
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Account Settings
                </Typography>
                <form onSubmit={handleAccountUpdate}>
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        disabled={disabled}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={disabled}
                    >
                        Save Password
                    </Button>
                </form>
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
