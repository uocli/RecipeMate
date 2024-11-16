import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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

const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route
                    path="/about"
                    element={
                        <ProtectedRoute>
                            <About />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />
                <Route path="/signup" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route
                    path="/password-recovery"
                    element={<PasswordRecoveryForm />}
                />
                {/* Logout route */}
                {/*<Route path="/tasks" component={Tasks} />*/}
                {/*<Route path="/task/:id" component={Task} />*/}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
