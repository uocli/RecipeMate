import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    Grid2 as Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Box,
} from "@mui/material";

const RecipeList = () => {
    const SESSION_STORAGE_KEY = "recipemate__recipes";

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cachedRecipes = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (cachedRecipes) {
            setRecipes(JSON.parse(cachedRecipes));
            setLoading(false);
        } else {
            axios
                .get("/api/recipes/")
                .then((response) => {
                    setRecipes(response.data);
                    sessionStorage.setItem(
                        SESSION_STORAGE_KEY,
                        JSON.stringify(response.data),
                    );
                })
                .catch((error) => {
                    console.error(
                        "There was an error fetching the recipes!",
                        error,
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    return loading ? (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
        >
            <CircularProgress />
        </Box>
    ) : (
        <Container>
            {recipes.length === 0 ? (
                <></>
            ) : (
                <Typography variant="h5" gutterBottom>
                    Favorite Recipes
                </Typography>
            )}
            <Grid
                container
                spacing={4}
                justifyContent="center"
                alignItems="center"
            >
                {recipes.map((recipe) => (
                    <Grid
                        item
                        key={recipe.uuid}
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={3}
                    >
                        <Card
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: 300,
                                width: 300,
                                overflow: "hidden",
                                borderRadius: "16px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <CardActionArea
                                component={Link}
                                to={`/recipe/${recipe.uuid}`}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        height: 200,
                                        width: "100%",
                                        objectFit: "cover",
                                        borderRadius: "16px 16px 0 0",
                                    }}
                                    image={recipe.image_url}
                                    alt={recipe.name}
                                />
                                <CardContent
                                    sx={{
                                        flex: "1 1 auto",
                                        height: 300,
                                        width: 300,
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="div"
                                        noWrap
                                    >
                                        {recipe.name}
                                    </Typography>
                                    <div>
                                        {recipe.ingredients.map(
                                            (ingredient, index) => (
                                                <Chip
                                                    key={index}
                                                    label={ingredient.name}
                                                    size="small"
                                                    sx={{
                                                        margin: "2px",
                                                        background:
                                                            "linear-gradient(45deg, #FFB085, #FDA6B3)",
                                                        color: "#fff",
                                                        borderRadius: "8px",
                                                        boxShadow:
                                                            "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                        "&:hover": {
                                                            background:
                                                                "linear-gradient(45deg, #FDA6B3, #FFB085)",
                                                        },
                                                    }}
                                                />
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default RecipeList;
