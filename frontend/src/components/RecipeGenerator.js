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
  CircularProgress,
  FormControl,
  Select, MenuItem, InputLabel,
  Grid2 as Grid,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import useAxios from '../utils/useAxios'; 
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import { FavoriteBorder, Favorite as FavoriteIcon } from '@mui/icons-material';

const RecipeGenerator = () => {
  const axiosInstance = useAxios();
  const { showAlert } = useContext(AlertContext);
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [preferences, setPreferences] = useState({
    dietary_preference: '',
    cooking_time: ''
  });

  const dietaryOptions = [
    { value: 'none', label: 'None' },  // Added None options
    { value: 'gluten_free', label: 'Gluten Free & Coeliac' },
    { value: 'dairy_free', label: 'Dairy Free & Lactose Free' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'fodmap', label: 'FODMAP' },
    { value: 'nut_free', label: 'Tree Nut & Peanut Free' },
    { value: 'fish_free', label: 'Fish & Shellfish Free' },
    { value: 'keto', label: 'Ketogenic' }
  ];

  const cookingTimeOptions = [
    { value: 'limited', label: 'Limited (< 30 mins)' },
    { value: 'medium', label: 'Medium (~ 1 hour)' },
    { value: 'Extended', label: 'Extended (> 1 hour)' }
  ];

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handlePreferenceChange = (event) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value
    });
  };

  const handleFavorite = async () => {
    try {
      const response = await axiosInstance.post('/api/favorites/add/', {
        name: recipe.title,
        ingredients: JSON.stringify(recipe.ingredients),
        recipe: JSON.stringify(recipe.instructions)
      });
      
      if (response.data.success) {
        setIsFavorite(true);
        showAlert('Recipe added to favorites!', 'success');
        setOpenDialog(false);
      }
    } catch (error) {
      showAlert('Failed to add to favorites', 'error');
    }
  };

  const handleGenerateRecipe = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .post("/api/generate/", {
        ingredients,
        preferences: preferences
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
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 3, p: 3 }}>

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

      <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
        <Grid item xs={12} sm={6} minWidth='180px'>
          <FormControl fullWidth>
            <InputLabel>Dietary Preference</InputLabel>
            <Select
              name="dietary_preference"
              value={preferences.dietary_preference}
              label="Dietary Preference"
              onChange={handlePreferenceChange}
            >
              {dietaryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} minWidth='150px'>
        <FormControl fullWidth>
          <InputLabel>Cooking Time</InputLabel>
          <Select
            name="cooking_time"
            value={preferences.cooking_time}
            label="Cooking Time"
            onChange={handlePreferenceChange}
          >
            {cookingTimeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>

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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{recipe.title}</Typography>
            <Button
              startIcon={isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorder />}
              onClick={() => setOpenDialog(true)}
              color="primary"
            >
              {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
            </Button>
          </Box>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add to Favorites</DialogTitle>
        <DialogContent>
          Do you want to add "{recipe?.title}" to your favorites?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleFavorite} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeGenerator;