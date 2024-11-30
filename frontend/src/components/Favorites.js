import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import { AlertContext } from "../utils/AlertContext";
import "./Favorites.css"; // Import the external CSS file

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const axios = useAxios();
    const { showAlert } = useContext(AlertContext);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get("/api/favorites/");
                setFavorites(response.data);
            } catch (error) {
                showAlert("Failed to fetch favorite recipes.", "error");
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveFromFavorites = async (id) => {
        try {
            await axios.delete(`/api/favorites/${id}/`);
            setFavorites(favorites.filter((favorite) => favorite.id !== id));
            showAlert("Favorite recipe removed.", "success");
        } catch (error) {
            showAlert("Failed to remove favorite recipe.", "error");
        }
    };

    const handleAddToShoppingList = async (id) => {
        try {
            const response = await axios.post(`/api/favorites/${id}/add-to-shopping-list/`);
            showAlert(response.data.message, "success");
        } catch (error) {
            showAlert("Failed to add ingredients to the shopping list.", "error");
        }
    };

    const handleTogglePublic = async (id, isPublic) => {
        if (isPublic) {
            try {
                const response = await axios.post(`/api/favorites/share/${id}/`);
                showAlert(response.data.message, "success");
            } catch (error) {
                showAlert("Failed to make the recipe public.", "error");
            }
        }
    };

    return (
        <div className="container">
            <h1 className="header">Your Favorite Recipes</h1>
            {favorites.length === 0 ? (
                <p className="empty-message">No favorite recipes yet.</p>
            ) : (
                <ul className="list">
                    {favorites.map((favorite) => (
                        <li key={favorite.id} className="card">
                            <h2 className="title">{favorite.name}</h2>
                            <h3 className="subheading">Ingredients</h3>
                            <div className="text">
                                {JSON.parse(favorite.ingredients).map((ingredient, index) => (
                                    <p key={index}>{ingredient.ingredient} - {ingredient.quantity}</p>
                                ))}
                            </div>
                            <h3 className="subheading">Recipe</h3>
                            <div className="text">
                                {JSON.parse(favorite.recipe).map((step, index) => (
                                    <p key={index}>{index + 1}. {step}</p>
                                ))}
                            </div>
                            <button
                                onClick={() => handleRemoveFromFavorites(favorite.id)}
                                className="button"
                            >
                                Remove from Favorites
                            </button>
                            <button
                                onClick={() => handleAddToShoppingList(favorite.id)}
                                className="button"
                            >
                                Add Ingredients to Shopping List
                            </button>
                            <label className="toggle-label">
                                <input
                                    type="checkbox"
                                    onChange={(e) => handleTogglePublic(favorite.id, e.target.checked)}
                                />
                                Make Public
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Favorites;

