import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import useAxios from "../utils/useAxios";
import {
    Button,
    TextField,
    Typography,
    Paper,
    Box,
    Grid,
} from "@mui/material";

const ShoppingList = () => {
    const axiosInstance = useAxios();
    const { showAlert } = useContext(AlertContext);
    const { setUser } = useContext(AuthContext);
    const [shoppingList, setShoppingList] = useState([]);
    const [newItem, setNewItem] = useState({ ingredient: '', quantity: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/api/shopping-list/")
            .then((response) => {
                if (response.status === 200) {
                    setShoppingList(response.data);
                }
            })
    }, [setUser]);

    const handleIsOwnedChange = async (index, isOwned) => {
        const updatedList = [...shoppingList];
        updatedList[index].is_owned = isOwned;
        setShoppingList(updatedList);

        await axiosInstance.
            post(
                '/api/shopping-list/',
                { items: updatedList },
            );
    };

    const handleAddItem = async () => {
        if (!newItem.ingredient) {
            showAlert("Ingredient name should not be empty.", "error");
            setNewItem({ ingredient: '', quantity: 0 });
            return;
        }

        if (isNaN(newItem.quantity)) {
            newItem.quantity = 0;
        }

        const existingItemIndex = shoppingList.findIndex(item => item.ingredient.toLowerCase() === newItem.ingredient.toLowerCase());
        let updatedList;

        if (existingItemIndex !== -1) {
            // Item already exists, update its quantity
            updatedList = [...shoppingList];
            updatedList[existingItemIndex].quantity += newItem.quantity;
        } else {
            // Item does not exist, add as new item
            updatedList = [...shoppingList, { ...newItem, is_owned: false }];
        }

        setShoppingList(updatedList);

        await axiosInstance.post(
            '/api/shopping-list/',
            { items: updatedList },
        );

        setNewItem({ ingredient: '', quantity: 0 });
    };

    return (
        <Box sx={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ color: '#333' }}>
                    Shopping List
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/shopping-list-edit')}
                >
                    Edit
                </Button>
            </Box>
            <Box component="form" sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <TextField
                    label="Ingredient"
                    size="small"
                    value={newItem.ingredient}
                    onChange={(e) => setNewItem({ ...newItem, ingredient: e.target.value })}
                    fullWidth
                    margin="normal"
                    sx={{ marginRight: '10px' }}
                />
                <TextField
                    label="Quantity"
                    size="small"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(0, parseInt(e.target.value)) })}
                    fullWidth
                    margin="normal"
                    sx={{ marginRight: '10px' }}
                />
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleAddItem}
                >
                    Add
                </Button>
            </Box>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    {shoppingList.map((item, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd', textDecoration: item.is_owned ? 'line-through' : 'none', color: item.is_owned ? 'gray' : 'black' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={item.is_owned}
                                    onChange={(e) => handleIsOwnedChange(index, e.target.checked)}
                                    style={{ marginRight: '10px' }}
                                />
                                <span>{item.ingredient}</span>
                            </div>
                            {item.quantity > 0 && (
                                <span>{item.quantity}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </Paper>
        </Box>
    );
};

export default ShoppingList;