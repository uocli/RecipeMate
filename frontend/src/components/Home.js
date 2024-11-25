import React from "react";
import { Container, Box } from "@mui/material";
import RecipeList from "./RecipeList";

const Home = () => {
    return (
        <Container>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <RecipeList />
            </Box>
        </Container>
    );
};

export default Home;
