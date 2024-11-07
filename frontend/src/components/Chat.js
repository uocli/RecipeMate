import {
    Avatar,
    Box,
    Divider,
    Grid2 as Grid,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { deepOrange, green } from "@mui/material/colors";
import Face6Icon from "@mui/icons-material/Face6";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useState } from "react";

const Chat = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState("");

    const handleSubmit = () => {
        setLoading(true);
        setChatHistory((prevState) => [
            {
                from: "User",
                message: question,
                time: new Date().toLocaleTimeString(),
            },
            ...prevState,
        ]);
        // TODO: Implement the API call to the backend
        setTimeout(() => {
            setChatHistory((prevState) => [
                {
                    from: "Bot",
                    message: "Hello, I am a bot. How can I help you?",
                    time: new Date().toLocaleTimeString(),
                },
                ...prevState,
            ]);
            setLoading(false);
        }, 1000);
    };
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Grid size={12}>
                <Box
                    component="form"
                    sx={{ m: 2 }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                    }}
                >
                    <TextField
                        disabled={loading}
                        fullWidth
                        label="Type in your question here"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </Box>
            </Grid>
            <Grid size={12}>{loading ? <LinearProgress /> : null}</Grid>
            <Grid size={12}>
                <List
                    sx={{
                        width: "100%",
                        maxWidth: 500,
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 500,
                    }}
                >
                    {chatHistory.map(({ message, from, time }, index) => {
                        return (
                            <>
                                {index === 0 ? null : (
                                    <Divider variant="inset" component="li" />
                                )}
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                bgcolor:
                                                    from === "User"
                                                        ? deepOrange[500]
                                                        : green[500],
                                            }}
                                        >
                                            {from === "User" ? (
                                                <Face6Icon />
                                            ) : (
                                                <SmartToyIcon />
                                            )}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={from}
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{
                                                        color: "text.primary",
                                                        display: "block",
                                                    }}
                                                >
                                                    {time}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{
                                                        color: "text.primary",
                                                        display: "inline",
                                                    }}
                                                >
                                                    {message}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            </>
                        );
                    })}
                </List>
            </Grid>
        </Grid>
    );
};

export default Chat;
