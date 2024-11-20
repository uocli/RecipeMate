// frontend/src/components/RecipeGenerator.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Chip,
  Button,
  Stack,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import axios from 'axios';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  // Fetch user preferences from backend
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/api/user/preferences/');
        setPreferences(response.data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };
    fetchPreferences();
  }, []);

  // Handle ingredient input
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  // Handle preference selection
  const handlePreferenceChange = (event, newPreferences) => {
    setSelectedPreferences(newPreferences);
  };

  // Handle generate recipe
  const handleGenerateRecipe = async () => {
    try {
      const response = await axios.post('/api/custom/generate-recipe/', {
        ingredients,
        preferences: selectedPreferences
      });
      // Handle the generated recipe response
      console.log(response.data);
    } catch (error) {
      console.error('Error generating recipe:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
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

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dietary Preferences
        </Typography>
        <ToggleButtonGroup
          value={selectedPreferences}
          onChange={handlePreferenceChange}
          multiple
        >
          {preferences.map((pref) => (
            <ToggleButton key={pref.id} value={pref.id}>
              {pref.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleGenerateRecipe}
        disabled={ingredients.length === 0}
      >
        Generate Recipe
      </Button>
    </Box>
  );
};

export default RecipeGenerator;