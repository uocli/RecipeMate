import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCsrfToken } from "../utils/CsrfCookie";
import { useNavigate } from 'react-router-dom';
//import './ShoppingList.css';

const ShoppingList = () => {
    const [shoppingList, setShoppingList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShoppingList = async () => {
            await getCsrfToken();
            const response = await axios.get('/api/shopping-list/');
            setShoppingList(response.data);
        };

        fetchShoppingList();
    }, []);

    const handleIsOwnedChange = async (index, isOwned) => {
        const updatedList = [...shoppingList];
        updatedList[index].is_owned = isOwned;
        setShoppingList(updatedList);

        await getCsrfToken();
        await axios.post('/api/shopping-list/update/', {
            items: updatedList
        });
    };

    return (
        <div className="shopping-list-container">
            <h1>Shopping List</h1>
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