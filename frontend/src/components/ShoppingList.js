import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCsrfToken } from "../utils/CsrfCookie";

const ShoppingList = () => {
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        const fetchShoppingList = async () => {
            await getCsrfToken();
            const response = await axios.get('/api/shopping-list/');
            setShoppingList(response.data);
        };

        fetchShoppingList();
    }, []);

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

    const handleSaveAll = async () => {
        await getCsrfToken();
        await axios.post('/api/shopping-list/update/', {
            items: shoppingList
        });
    };

    return (
        <div>
            <h1>Shopping List</h1>
            <ul>
                {shoppingList.map((item, index) => (
                    <li key={index} style={{ textDecoration: item.is_owned ? 'line-through' : 'none', color: item.is_owned ? 'gray' : 'black' }}>
                        <input
                            type="checkbox"
                            checked={item.is_owned}
                            onChange={(e) => handleIsOwnedChange(index, e.target.checked)}
                        />
                        {item.ingredient}
                        <button onClick={() => handleQuantityChange(index, Math.max(1, item.quantity - 1))}>-</button>
                        <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleQuantityChange(index, Math.max(1, parseInt(e.target.value)))}
                        />
                        <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleSaveAll}>Save</button>
        </div>
    );
};

export default ShoppingList;