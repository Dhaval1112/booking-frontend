import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-primary text-white">
            <div className="text-center p-5 bg-white text-dark shadow-lg rounded" style={{ maxWidth: "500px" }}>
                <h1 className="mb-3">Welcome to the Booking System</h1>
                <p className="lead">Manage your bookings with ease!</p>
                <div className="mt-4">
                    <Link to="/login" className="btn btn-primary me-2 px-4 py-2">Login</Link>
                    <Link to="/signup" className="btn btn-outline-primary px-4 py-2">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
