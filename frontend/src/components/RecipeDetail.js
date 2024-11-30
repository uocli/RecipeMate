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
    Box,
    CircularProgress,
    Collapse,
    IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AlertContext } from "../utils/AlertContext";
import { AuthContext } from "../utils/AuthContext";
import useAxios from "../utils/useAxios";

const RecipeDetail = () => {
    const SESSION_STORAGE_KEY = "recipemate__recipes";
    const { uuid } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [rating, setRating] = useState(0);
    const [expanded, setExpanded] = useState(true);
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
            .then((response) => {
                const { status, data } = response || {},
                    { success, message, recipes: updatedRecipes } = data || {};
                if (status === 200 && success) {
                    showAlert(message, "success");
                    // Update the local sessionStorage with the latest recipes list
                    sessionStorage.setItem(
                        SESSION_STORAGE_KEY,
                        JSON.stringify(updatedRecipes),
                    );
                } else {
                    showAlert(message || "Error updating rating!", "error");
                }
            })
            .catch((error) => {
                console.error("There was an error updating the rating!", error);
            });
    };

    const handleAnonymousRating = () => {
        showAlert("Please log in to rate this recipe!", "warning");
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    if (!recipe) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Card
                sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                }}
            >
                <CardMedia
                    component="img"
                    height="300"
                    image={recipe.image_url}
                    alt={recipe.name}
                    sx={{
                        borderRadius: "16px 16px 0 0",
                        transform: "translateY(-20%)",
                        transition: "transform 0.5s ease-in-out",
                        "&:hover": {
                            transform: "translateY(0)",
                        },
                    }}
                />
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Typography
                            variant="h3"
                            component="div"
                            sx={{
                                fontWeight: "bold",
                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                                animation: "fadeIn 1s ease-in-out",
                                flex: "1 1 auto",
                                minWidth: "200px",
                            }}
                        >
                            {recipe.name}
                        </Typography>
                        {isAuthenticated ? (
                            <Button onClick={handleAnonymousRating}>
                                <Rating
                                    name="recipe-rating"
                                    value={rating}
                                    readOnly
                                    size="large"
                                    sx={{
                                        color: "#FD6B8B",
                                        animation: "bounce 1s ease-in-out",
                                        "@media (max-width: 600px)": {
                                            fontSize: "1.5rem", // Adjust the size for mobile devices
                                        },
                                    }}
                                />
                            </Button>
                        ) : (
                            <Button onClick={handleAnonymousRating}>
                                <Rating
                                    name="recipe-rating"
                                    value={rating}
                                    readOnly
                                    size="large"
                                    sx={{
                                        color: "#FD6B8B",
                                        animation: "bounce 1s ease-in-out",
                                    }}
                                />
                            </Button>
                        )}
                    </Box>
                    <Typography
                        variant="body1"
                        component="p"
                        sx={{ margin: "16px 0" }}
                    >
                        {recipe.description}
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ marginTop: "16px" }}
                    >
                        Ingredients
                        <IconButton
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </Typography>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                margin: "8px 0",
                            }}
                        >
                            {recipe.ingredients.map((ingredient, index) => (
                                <Chip
                                    key={index}
                                    label={ingredient.name}
                                    size="small"
                                    sx={{
                                        margin: "4px",
                                        background:
                                            "linear-gradient(45deg, #FFB085, #FDA6B3)",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        boxShadow:
                                            "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            ))}
                        </Box>
                    </Collapse>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ marginTop: "16px" }}
                    >
                        Instructions
                    </Typography>
                    <Typography
                        variant="body1"
                        component="p"
                        sx={{ margin: "16px 0", whiteSpace: "pre-line" }}
                    >
                        {recipe.instructions}
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RecipeDetail;
