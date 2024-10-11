import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./Header";
import Home from "./Home";
import About from "./About";
import NotFound from "./NotFound";

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/about" element={<About />} />
                {/*<Route path="/contact" component={Contact} />*/}
                {/*<Route path="/tasks" component={Tasks} />*/}
                {/*<Route path="/task/:id" component={Task} />*/}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
