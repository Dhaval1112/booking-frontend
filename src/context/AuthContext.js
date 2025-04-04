import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    console.log("Reading from authprovider token read from local storage :: ", localStorage.getItem("token"));

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();

    useEffect(() => {


        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("response.data for verifying token and get user profile detials ", response.data);

                setUser(response.data);
                // navigate("/dashboard"); // ✅ Redirect if already logged in
            } catch (error) {
                console.error("User verification failed:", error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = (data) => {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);

    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
