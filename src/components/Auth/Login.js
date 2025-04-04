import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";

const Login = () => {
    const { login, user, token } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // If user is already logged in, redirect to dashboard
    if (token) {
        navigate("/dashboard");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('formData', formData);
            const response = await api.post("/auth/login", formData, {
                headers: { "Content-Type": "application/json" }, // Explicit JSON header
            });

            console.log('response', response.data);
            toast.success("Login Successful");
            login(response.data);
            // localStorage.setItem("token", response.data.token);

            navigate("/dashboard");
        } catch (error) {
            console.log('error', error);

            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
                <h2 className="text-center mb-4 text-primary">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>

                    <div className="text-center mt-3">
                        Don't have an account? <Link to="/signup"> Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
