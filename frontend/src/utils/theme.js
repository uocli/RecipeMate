import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#FE6B8B",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#FF8E53",
        },
    },
    typography: {
        fontFamily: "'Roboto', sans-serif",
    },
});

export default theme;
