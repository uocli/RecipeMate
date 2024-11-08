import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        // Redirect the user to the login page, and save the intended URL in state
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
