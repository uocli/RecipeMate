import { useContext, useState } from "react";
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
    Avatar,
    MenuItem,
    Menu,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

const ResponsiveHeader = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const NAVIGATION = [
        { text: "Home", path: "/" },
        { text: "About", path: "/about" },
        { text: "Services", path: "/services" },
        { text: "Shopping List", path: "/shopping-list" },
        { text: "Contact", path: "/contact" },
        { text: "Favorites", path: "/favorites" },
        
    ];

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget); // Open menu on avatar click
    };
    const handleClose = () => {
        setAnchorEl(null); // Close menu
    };
    const handleProfile = () => {
        handleClose();
        navigate("/profile"); // Navigate to profile page
    };

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
                            component="button"
                            style={{ textDecoration: "none", color: "white" }}
                            onClick={() => navigate("/")}
                            underline="none"
                        >
                            Recipe Mate
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
                    {!isAuthenticated ? (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/login")}
                            >
                                Sign In
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </Button>
                        </>
                    ) : (
                        <>
                            <IconButton
                                onClick={handleAvatarClick}
                                sx={{ p: 0 }}
                            >
                                <Avatar>{user?.acronym || "U"}</Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                <MenuItem onClick={handleProfile}>
                                    Account Settings
                                </MenuItem>
                                <MenuItem onClick={logout}>Sign Out</MenuItem>
                            </Menu>
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
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: 3,
                }} // Adding margin to prevent overlap with AppBar
            ></Box>
        </Box>
    );
};

export default ResponsiveHeader;
