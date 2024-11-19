import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../utils/AuthContext";
import useAxios from "../utils/useAxios";
//import './ShoppingList.css';

const ShoppingList = () => {
    const axiosInstance = useAxios();
    const { setUser } = useContext(AuthContext);
    const [shoppingList, setShoppingList] = useState([]);
    const [newItem, setNewItem] = useState({ ingredient: '', quantity: 1, unit: '' });
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

        setNewItem({ ingredient: '', quantity: 1, unit: '' });
    };

    return (
        <div className="shopping-list-container">
            <h1>Shopping List</h1>
            <div className="add-item-form">
                <input
                    type="text"
                    placeholder="Ingredient"
                    value={newItem.ingredient}
                    onChange={(e) => setNewItem({ ...newItem, ingredient: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    min="1"
                    onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value)) })}
                />
                <input
                    type="text"
                    placeholder="Unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                />
                <button onClick={handleAddItem}>Add</button>
            </div>
            <button onClick={() => navigate('/shopping-list-edit')}>Edit</button>
            <ul>
                {shoppingList.map((item, index) => (
                    <li key={index} style={{ textDecoration: item.is_owned ? 'line-through' : 'none', color: item.is_owned ? 'gray' : 'black' }}>
                        <input
                            type="checkbox"
                            checked={item.is_owned}
                            onChange={(e) => handleIsOwnedChange(index, e.target.checked)}
                        />
                        {item.ingredient} ({item.quantity} {item.unit})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShoppingList;