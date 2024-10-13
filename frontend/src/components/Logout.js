import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

const LogoutPage = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    useEffect(() => {
        logout(navigate);
    }, [logout, navigate]);

    return <p>Logging out...</p>;
};

export default LogoutPage;
