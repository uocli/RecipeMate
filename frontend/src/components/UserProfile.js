import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Paper,
    Container,
    Alert,
} from "@mui/material";
import http from "../utils/Http";

const UserProfile = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dietaryPreference, setDietaryPreference] = useState("none");
    const [accountSettingAlertMessage, setAccountSettingAlertMessage] =
        useState("");
    const [accountSettingAlertSeverity, setAccountSettingAlertSeverity] =
        useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    useEffect(() => {
        // Fetch user data from the backend
        http.get("/api/user-profile/").then((response) => {
            console.log(response.data);
        });
    }, []);

    const handleAccountUpdate = (e) => {
        e.preventDefault();
        // Handle account update logic
        setAccountSettingAlertMessage("Account updated successfully!");
        setAccountSettingAlertSeverity("success");
        setTimeout(() => {
            setAccountSettingAlertMessage("");
        }, 3000);
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

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            {/* Alert for notifications */}
            {accountSettingAlertMessage && (
                <Alert
                    severity={accountSettingAlertSeverity}
                    onClose={() => setAccountSettingAlertMessage("")}
                    sx={{ mb: 2 }}
                >
                    {accountSettingAlertMessage}
                </Alert>
            )}

            {/* Account Settings Section */}
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
                        error={firstName.length < 1}
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!email.includes("@")}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={password.length < 6}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Update Account
                    </Button>
                </form>
            </Paper>

            {/* Dietary Preferences Section */}
            {alertMessage && (
                <Alert
                    severity={alertSeverity}
                    onClose={() => setAlertMessage("")}
                    sx={{ mb: 2 }}
                >
                    {alertMessage}
                </Alert>
            )}
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
                        />
                        <FormControlLabel
                            value="vegetarian"
                            control={<Radio />}
                            label="Vegetarian"
                        />
                        <FormControlLabel
                            value="glutenFree"
                            control={<Radio />}
                            label="Gluten Free"
                        />
                    </RadioGroup>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Save Preferences
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default UserProfile;
