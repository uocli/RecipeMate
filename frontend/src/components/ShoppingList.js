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

    return (
        <div>
            <h1>Shopping List</h1>
            <ul>
                {shoppingList.map((item, index) => (
                    <li key={index}>
                        {item.ingredient}: {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ShoppingList;