import { useEffect, useState, useContext } from "react";
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
    Button,
} from "@mui/material";
import { AlertContext } from "../utils/AlertContext";
import { AuthContext } from "../utils/AuthContext";
import useAxios from "../utils/useAxios";

const RecipeDetail = () => {
    const { uuid } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [rating, setRating] = useState(0);
    const { showAlert } = useContext(AlertContext);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    useEffect(() => {
        axios
            .get(`/api/recipe/${uuid}/`)
            .then((response) => {
                const { data } = response || {},
                    { average_rating } = data || {};
                setRecipe(data || {});
                setRating(average_rating || 0);
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
        axiosInstance
            .post(`/api/recipe/${uuid}/rate/`, { rating: newValue })
            .then((_) => {
                showAlert("Rating updated successfully", "success");
            })
            .catch((error) => {
                console.error("There was an error updating the rating!", error);
            });
    };

    const handleAnonymousRating = () => {
        showAlert("Please log in to rate this recipe!", "warning");
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
                    {isAuthenticated ? (
                        <Rating
                            name="recipe-rating"
                            value={rating}
                            onChange={handleRatingChange}
                            size="large"
                        />
                    ) : (
                        <Button onClick={handleAnonymousRating}>
                            <Rating
                                name="recipe-rating"
                                value={rating}
                                readOnly
                                size="large"
                            />
                        </Button>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default RecipeDetail;
