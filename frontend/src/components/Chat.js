import { Avatar, Divider, Grid2 as Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { deepOrange, green } from "@mui/material/colors";
import Face6Icon from "@mui/icons-material/Face6";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const Chat = (props) => {
    const { history } = props;
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
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
                {history.map(({ message, from, time }, index) => {
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
                                                from === "User" ? deepOrange[500] : green[500],
                                        }}
                                    >
                                        {from === "User" ? <Face6Icon /> : <SmartToyIcon />}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={from}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                sx={{ color: "text.primary", display: "block" }}
                                            >
                                                {time}
                                            </Typography>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                sx={{ color: "text.primary", display: "inline" }}
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
    );
};

export default Chat;