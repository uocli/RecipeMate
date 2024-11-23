import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Welcome to RecipeMate</h1>
            <p>Your go-to app for managing recipes!</p>

            {/* Navigation Links */}
            <nav>
                <ul>
                    <li>
                        <Link to="/favorites">View Favorites</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Home;
