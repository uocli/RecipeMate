import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    CssBaseline,
    useMediaQuery,
    Link,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const ResponsiveHeader = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const NAVIGATION = [
        { text: "Home", path: "/" },
        { text: "About", path: "/about" },
        { text: "Services", path: "/services" },
        { text: "Contact", path: "/contact" },
    ];

    const drawerContent = (
        <List>
            {NAVIGATION.map(({ text, path }) => (
                <ListItem button key={text}>
                    <ListItemText
                        primary={text}
                        onClick={() => {
                            navigate(path);
                            setDrawerOpen(false);
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link
                            href="/"
                            style={{ textDecoration: "none", color: "white" }}
                        >
                            Meal Muse
                        </Link>
                    </Typography>
                    {!isMobile && (
                        <>
                            {NAVIGATION.map(({ text, path }) => (
                                <Button
                                    color="inherit"
                                    key={text}
                                    onClick={() => navigate(path)}
                                >
                                    {text}
                                </Button>
                            ))}
                        </>
                    )}
                </Toolbar>
            </AppBar>

            {/* Drawer for mobile */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerContent}
            </Drawer>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, mt: 3 }} // Adding margin to prevent overlap with AppBar
            ></Box>
        </Box>
    );
};

export default ResponsiveHeader;
