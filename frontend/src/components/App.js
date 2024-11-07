import React from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./Header";
import Home from "./Home";
import About from "./About";
import NotFound from "./NotFound";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Chat from "./Chat";

const App = () => {

    const chatHistory = [
        {
            from: "User",
            message: "Hello",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "Bot",
            message: "Hi, how can I help you?",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "User",
            message: "Hello",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "Bot",
            message: "Hi, how can I help you?",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "User",
            message: "Hello",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "Bot",
            message: "Hi, how can I help you?",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "User",
            message: "Hello",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "Bot",
            message: "Hi, how can I help you?",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "User",
            message: "Hello",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "Bot",
            message: "Hi, how can I help you?",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "User",
            message: "Hello",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "Bot",
            message: "Hi, how can I help you?",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "User",
            message: "Hello",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "Bot",
            message: "Hi, how can I help you?",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "User",
            message: "Hello",
            time: new Date().toLocaleTimeString(),
        },
        {
            from: "Bot",
            message: "Hi, how can I help you?",
            time: new Date().toLocaleTimeString(),
        },

    ];
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
                <Route path="/signup" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/chat" element={<Chat history={chatHistory} />} />
                {/*<Route path="/task/:id" component={Task} />*/}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
