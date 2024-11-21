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
    }, [axios, showAlert]);

    const handleRemoveFromFavorites = async (id) => {
        try {
            await axios.delete(`/api/favorites/${id}/`);
            setFavorites(favorites.filter((favorite) => favorite.id !== id));
            showAlert("Favorite recipe removed.", "success");
        } catch (error) {
            showAlert("Failed to remove favorite recipe.", "error");
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
                            <p className="text">{favorite.ingredients}</p>
                            <h3 className="subheading">Recipe</h3>
                            <p className="text">{favorite.recipe}</p>
                            <button
                                onClick={() => handleRemoveFromFavorites(favorite.id)}
                                className="button"
                            >
                                Remove from Favorites
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Favorites;
