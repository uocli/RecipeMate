import React from "react";
import { Container, Typography } from "@mui/material";
import RecipeList from "./RecipeList";

const Home = () => {
    return (
        <Container>
            <Typography variant="h1" gutterBottom>
                Welcome to Recipe Mate!
            </Typography>
            <RecipeList />
        </Container>
    );
};

export default Home;
