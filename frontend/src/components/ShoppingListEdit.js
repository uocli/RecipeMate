import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../utils/AuthContext";
import useAxios from "../utils/useAxios";
//import './ShoppingList.css';

const ShoppingListEdit = () => {
    const axiosInstance = useAxios();
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
                alert("Changes saved successfully!");
                setTimeout(() => navigate('/shopping-list'), 500);
            } else {
                alert("Failed to save changes.");
            }
        }
    };

    const handleCancel = () => {
        navigate('/shopping-list');
    };

    return (
        <div className="shopping-list-container">
            <h1>Edit Shopping List</h1>
            <button className="delete-all-button" onClick={handleDeleteAll}>Delete All</button>
            <ul>
                {shoppingList.filter(item => item.quantity >= 0).map((item, index) => (
                    <li key={index} style={{ color: item.is_owned ? 'gray' : 'black' }}>
                        <input
                            type="checkbox"
                            checked={item.is_owned}
                            onChange={(e) => handleIsOwnedChange(index, e.target.checked)}
                        />
                        <span style={{ textDecoration: item.is_owned ? 'line-through' : 'none' }}>
                            {item.ingredient}
                        </span>
                        <div>
                            <button onClick={() => handleQuantityChange(index, Math.max(1, item.quantity - 1))}>-</button>
                            <input
                                type="number"
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
                            />
                            <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
                            <span>{item.unit}</span>
                            <button onClick={() => handleDeleteItem(index)}>
                                <img src="https://img.icons8.com/ios-glyphs/30/000000/trash.png" alt="Delete" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="buttons-row">
                <div className="right-buttons">
                    <button className="cancel-button" onClick={handleCancel}>Discard Changes</button>
                    <button className="save-button" onClick={handleSaveAll}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingListEdit;