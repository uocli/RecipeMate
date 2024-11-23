import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../utils/AuthContext";
import { AlertContext } from "../utils/AlertContext";
import useAxios from "../utils/useAxios";
import {
    Button,
    IconButton,
    TextField,
    Typography,
    Paper,
    Box,
    Grid,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ShoppingListEdit = () => {
    const axiosInstance = useAxios();
    const { showAlert } = useContext(AlertContext);
    const { setUser } = useContext(AuthContext);
    const [shoppingList, setShoppingList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/api/shopping-list/")
            .then((response) => {
                if (response.status === 200) {
                    setShoppingList(response.data);
                }
            })
    }, [setUser]);

    const handleQuantityChange = (index, newQuantity) => {
        setShoppingList(prevList => {
            const updatedList = [...prevList];
            updatedList[index].quantity = newQuantity;
            return updatedList;
        });
    };

    const handleIsOwnedChange = (index, isOwned) => {
        setShoppingList(prevList => {
            const updatedList = [...prevList];
            updatedList[index].is_owned = isOwned;
            return updatedList;
        });
    };

    const handleDeleteItem = (index) => {
        setShoppingList(prevList => {
            const updatedList = [...prevList];
            updatedList[index].quantity = -1;
            return updatedList;
        });
    };

    const handleDeleteAll = () => {
        if (window.confirm("Are you sure you want to delete all items? This change will only be submitted when you click Save.")) {
            setShoppingList(prevList => prevList.map(item => ({ ...item, quantity: -1 })));
        }
    };

    const handleSaveAll = async () => {
        if (window.confirm("Are you sure you want to save these changes?")) {
            const response = await axiosInstance.
                post(
                    '/api/shopping-list/',
                    { items: shoppingList },
                );
            if (response.data.success) {
                showAlert("Changes saved successfully!", "success");
                setTimeout(() => navigate('/shopping-list'), 1000);
            } else {
                showAlert("Failed to save changes!", "error");
            }
        }
    };

    const handleCancel = () => {
        navigate('/shopping-list');
    };

    return (
        <Box sx={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" sx={{ color: '#333' }}>
                    Edit Shopping List
                </Typography>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAll}
                    disableElevation
                >
                    Delete All
                </Button>
            </Box>
            <Paper elevation={3} sx={{ padding: 2, marginTop: '20px' }}>
                <ul style={{ listStyleType: 'none', padding: '0' }}>
                    {shoppingList.filter(item => item.quantity >= 0).map((item, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd', color: item.is_owned ? 'gray' : 'black' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={item.is_owned}
                                    onChange={(e) => handleIsOwnedChange(index, e.target.checked)}
                                    style={{ marginRight: '10px' }}
                                />
                                <span style={{ textDecoration: item.is_owned ? 'line-through' : 'none' }}>
                                    {item.ingredient}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                                <IconButton
                                    aria-label="decrease"
                                    onClick={() => handleQuantityChange(index, Math.max(1, item.quantity - 1))}
                                    sx={{ minWidth: '40px', marginRight: '10px', height: '40px' }}
                                >
                                    <ArrowBackIosIcon />
                                </IconButton>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        handleQuantityChange(index, value === '' ? '' : Math.max(1, parseInt(value)));
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === '') {
                                            handleQuantityChange(index, 1);
                                        }
                                    }}
                                    sx={{ width: '80px', marginRight: '10px' }}
                                    InputProps={{ sx: { textAlign: 'left' } }}
                                />
                                <IconButton
                                    aria-label="increase"
                                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                    sx={{ minWidth: '40px', height: '40px' }}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                                <span style={{ marginLeft: '10px', marginRight: '10px', width: '60px', textAlign: 'left' }}>{item.unit}</span>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDeleteItem(index)}
                                    sx={{ minWidth: '40px', height: '40px' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </li>
                    ))}
                </ul>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCancel}
                    sx={{ marginRight: '10px' }}
                >
                    Discard Changes
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveAll}
                    disableElevation
                >
                    Save
                </Button>
            </Box>
        </Box>
    );
};

export default ShoppingListEdit;