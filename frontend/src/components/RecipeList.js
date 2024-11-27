import React, { useEffect, useState } from "react";
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
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get("/api/recipes/")
            .then((response) => {
                setRecipes(response.data);
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
                    <Grid item key={recipe.uuid} xs={12} sm={6} md={4}>
                        <Card
                            style={{
                                width: "100%",
                                maxWidth: "300px",
                                height: "auto",
                            }}
                        >
                            <CardActionArea
                                component={Link}
                                to={`/recipe/${recipe.uuid}`}
                                style={{ height: "100%" }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={recipe.image_url}
                                    alt={recipe.name}
                                    style={{ objectFit: "cover" }}
                                />
                                <CardContent>
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
                                                    style={{ margin: "2px" }}
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
