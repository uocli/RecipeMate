// frontend/src/components/RecipeGenerator.js
import React, { useContext,useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import useAxios from '../utils/useAxios'; 
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";

const RecipeGenerator = () => {
  const axiosInstance = useAxios();
  const { showAlert } = useContext(AlertContext);
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const { setUser } = useContext(AuthContext);
  // const [error, setError] = useState(null);
  // const [preferences, setPreferences] = useState({
  //   dietary_preference: '',
  //   cooking_time: ''
  // });

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleGenerateRecipe = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post("/api/generate/", {
        ingredients
      })
      .then((response) => {
        const { status, data } = response || {};
        const { success, data: recipeData } = data || {};
        
        if (status === 200 && success) {
          setRecipe(recipeData);
          showAlert("Recipe generated successfully!", "success");
        } else {
          // setError(data?.message || "Failed to generate recipe");
          showAlert(data?.message || "Failed to generate recipe", "error");
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Failed to generate recipe";
        // setError(errorMessage);
        showAlert(errorMessage, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 8, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Recipe Generator
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Enter Your Ingredients
        </Typography>
        <TextField
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type ingredient and press Enter"
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {ingredients.map((ingredient, index) => (
            <Chip
              key={index}
              label={ingredient}
              onDelete={() => {
                setIngredients(ingredients.filter((_, i) => i !== index));
              }}
            />
          ))}
        </Stack>
      </Paper>

      <Button
        variant="contained"
        fullWidth
        onClick={handleGenerateRecipe}
        disabled={ingredients.length === 0 || loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Generate Recipe'}
      </Button>

      {recipe && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5">{recipe.title}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Cooking Time: {recipe.cooking_time}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Cooking Difficulty: {recipe.difficulty}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Ingredients:
          </Typography>
          <List>
            {recipe.ingredients.map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText 
                  primary={`${item.ingredient} - ${item.quantity}`}
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Instructions:
          </Typography>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </Paper>
      )}
    </Box>
  );
};

export default RecipeGenerator;