import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Rating,
} from "@mui/material";
import { AlertContext } from "../utils/AlertContext";

const RecipeDetail = () => {
    const { uuid } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [rating, setRating] = useState(0);
    const { showAlert } = React.useContext(AlertContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`/api/recipe/${uuid}/`)
            .then((response) => {
                setRecipe(response.data);
                setRating(response.data.user_rating || 0); // Assuming user_rating is returned from the API
            })
            .catch((error) => {
                showAlert(
                    error?.response?.data?.message ||
                        "Error getting the recipe!",
                    "error",
                    5000,
                );
                navigate("/");
            });
    }, [uuid]);

    const handleRatingChange = (event, newValue) => {
        setRating(newValue);
        // Send the new rating to the server
        axios
            .post(`/api/recipe/${uuid}/rate/`, { rating: newValue })
            .then((response) => {
                console.log("Rating updated successfully");
            })
            .catch((error) => {
                console.error("There was an error updating the rating!", error);
            });
    };

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
                    <div>
                        {recipe.ingredients.map((ingredient, index) => (
                            <Chip
                                key={index}
                                label={ingredient.name}
                                size="small"
                                style={{ margin: "2px" }}
                            />
                        ))}
                    </div>
                    <Typography variant="h5" component="div">
                        Instructions
                    </Typography>
                    <Typography variant="body1" component="p">
                        {recipe.instructions}
                    </Typography>
                    <Typography variant="h5" component="div">
                        Rate this recipe
                    </Typography>
                    <Rating
                        name="recipe-rating"
                        value={rating}
                        onChange={handleRatingChange}
                        size="large"
                    />
                </CardContent>
            </Card>
        </Container>
    );
};

export default RecipeDetail;
