import React, { useContext, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Signup = () => {
    const { login, user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [passwordError, setPasswordError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [verificationUrl, setVerificationUrl] = useState("");

    // If user is already logged in, redirect to dashboard
    if (token) {
        navigate("/dashboard");
    }

    const validatePassword = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            setPasswordError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        } else {
            setPasswordError("");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "password") {
            validatePassword(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordError) {
            toast.error("Please enter a strong password.");
            return;
        }

        try {
            // Using api.post for signup
            const response = await api.post("/auth/signup", formData);
            const { emailVerificationUrl } = response.data;

            if (emailVerificationUrl) {
                setVerificationUrl(emailVerificationUrl);
                // Show modal to ask users
                setShowModal(true);
            } else {
                toast.error("No verification URL received. Please check your email manually.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Try again.");
        }
    };

    const handleVerify = () => {

        if (verificationUrl) {
            // Redirect to backend verification link
            window.open(verificationUrl, "_blank");
            // Redirect to login
            navigate("/login");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "10px" }}>
                <h2 className="text-center mb-4 text-primary">Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="text" className="form-control" name="firstName" placeholder="First Name" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" name="email" placeholder="Email" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" name="password" placeholder="Password" onChange={handleChange} required />
                        {passwordError && (
                            <div className="text-danger small mt-1">{passwordError}</div>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>

                    <div className="text-center mt-3">
                        Already have an account? <Link to="/login"> Login</Link>
                    </div>
                </form>
            </div>

            {/* Modal for Email Verification */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Verify Your Email</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>An email verification link has been generated. Would you like to proceed?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>No</button>
                                <button className="btn btn-primary" onClick={handleVerify}>Yes, Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
