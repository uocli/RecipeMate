import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
} from "@mui/material";

const RecipeDetail = () => {
    const { uuid } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        axios
            .get(`/api/recipe/${uuid}/`)
            .then((response) => {
                setRecipe(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the recipe!", error);
            });
    }, [uuid]);

    if (!recipe) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container>
            <Card>
                <CardMedia
                    component="img"
                    height="300"
                    image={recipe.image_url}
                    alt={recipe.name}
                />
                <CardContent>
                    <Typography variant="h3" component="div">
                        {recipe.name}
                    </Typography>
                    <Typography variant="body1" component="p">
                        {recipe.description}
                    </Typography>
                    <Typography variant="h5" component="div">
                        Ingredients
                    </Typography>
                    <Typography variant="body1" component="p">
                        {recipe.ingredients}
                    </Typography>
                    <Typography variant="h5" component="div">
                        Instructions
                    </Typography>
                    <Typography variant="body1" component="p">
                        {recipe.instructions}
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RecipeDetail;
