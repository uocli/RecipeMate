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
            <Grid container spacing={4}>
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
                                    }}
                                    image={recipe.image_url}
                                    alt={recipe.name}
                                />
                                <CardContent
                                    sx={{
                                        flex: "1 1 auto",
                                        overflow: "hidden",
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
                                                    sx={{ margin: "2px" }}
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
