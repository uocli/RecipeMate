// frontend/src/components/RecipeGenerator.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import Cookies from "js-cookie";

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleGenerateRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/recipe/generate/', {
        ingredients,
        preferences: []  // Add preferences if needed
      },
      {
          headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": Cookies.get("csrftoken"),
          },
      },
    );

      if (response.data.success) {
        setRecipe(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate recipe');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {recipe && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5">{recipe.title}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Cooking Time: {recipe.cooking_time}
          </Typography>
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