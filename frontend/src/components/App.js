import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import About from "./About";
import NotFound from "./NotFound";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import UserProfile from "./UserProfile";
import LogoutPage from "./Logout";
import PasswordRecoveryForm from "./PasswordRecoveryForm";
import PasswordReset from "./PasswordReset";

import RecipeGenerator from './RecipeGenerator';

import Favorites from "./Favorites";
import ShoppingList from "./ShoppingList";
import ShoppingListEdit from "./ShoppingListEdit";
import RecipeDetail from "./RecipeDetail";


const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />

                <Route path="/generate" 
                    element={
                        <ProtectedRoute>
                            <RecipeGenerator />
                        </ProtectedRoute>
                    } 
                />
                <Route
                    path="/shopping-list"
                    element={
                        <ProtectedRoute>
                            <ShoppingList />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/shopping-list-edit"
                    element={
                        <ProtectedRoute>
                            <ShoppingListEdit />
                        </ProtectedRoute>
                    }

                />
                <Route path="/signup" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route
                    path="/password-reset"
                    element={<PasswordReset endpoint="/api/password/reset/" />}
                />
                <Route
                    path="/complete-signup"
                    element={
                        <PasswordReset endpoint="/auth/complete-signup/" />
                    }
                />
                <Route
                    path="/password-recovery"
                    element={<PasswordRecoveryForm />}
                />
                <Route
                    path="/favorites"
                    element={
                        <ProtectedRoute>
                            <Favorites />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
                <Route path="/recipe/:uuid" element={<RecipeDetail />} />
            </Routes>
        </>
    );
};

export default App;
