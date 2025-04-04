import React, { useContext, useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import api from "./../services/api";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
    const { user, logout, loading, token } = useContext(AuthContext);

    if (!token) {
        redirect("/login");
    }

    console.log('user', user);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        bookingDate: "",
        bookingType: "Full Day",
        bookingSlot: "",
        bookingTime: "",
    });


    // For fetching booking detials on page load
    useEffect(() => {
        fetchBookings();
    }, []);

    // Prevent error if `user` is null
    const fetchBookings = async () => {

        try {
            const response = await api.get("/bookings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('response.data', response.data);
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // To logout from the application
    const logoutHandler = () => {
        logout();
        navigate("/login");
        toast.success("Logged out successfully!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/bookings", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Booking created successfully!");
            fetchBookings();
            setFormData({
                customerName: "",
                customerEmail: "",
                bookingDate: "",
                bookingType: "Full Day",
                bookingSlot: "",
                bookingTime: "",
            });
        } catch (error) {
            toast.error(`Failed to create booking please schedule another time. (${error.response?.data?.message})`);
            console.error("Error creating booking:", error);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="d-flex flex-column min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <a className="navbar-brand" href="/">Booking System</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <span className="nav-link text-white">Hello, {user?.firstName}!</span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-danger ms-3" onClick={logoutHandler}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container flex-grow-1 d-flex flex-column align-items-center mt-4">
                <div className="card p-4 mt-4 w-100" style={{ maxWidth: "600px" }}>
                    <h4 className="text-center mb-3">Create Booking</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Customer Name</label>
                            <input type="text" name="customerName" className="form-control" value={formData.customerName} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Customer Email</label>
                            <input type="email" name="customerEmail" className="form-control" value={formData.customerEmail} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Booking Date</label>
                            <input type="date" name="bookingDate" className="form-control"
                                min={new Date().toISOString().split("T")[0]}
                                value={formData.bookingDate} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Booking Type</label>
                            <select name="bookingType" className="form-control" value={formData.bookingType} onChange={handleChange} required>
                                <option value="Full Day">Full Day</option>
                                <option value="Half Day">Half Day</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                        {formData.bookingType === "Half Day" && (
                            <div className="mb-3">
                                <label className="form-label">Booking Slot</label>
                                <select name="bookingSlot" className="form-control" value={formData.bookingSlot} onChange={handleChange} required>
                                    <option value="">Select Slot</option>
                                    <option value="First Half">First Half</option>
                                    <option value="Second Half">Second Half</option>
                                </select>
                            </div>
                        )}
                        {formData.bookingType === "Custom" && (
                            <div className="mb-3">
                                <label className="form-label">Booking Time</label>
                                <input
                                    type="time"
                                    name="bookingTime"
                                    className="form-control"
                                    value={formData.bookingTime}
                                    onChange={handleChange}
                                    required
                                    min="09:00"
                                    max="18:00"
                                    step="1800"
                                />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary w-100">Submit Booking</button>
                    </form>
                </div>

                <div className="mt-5 w-100">
                    <h4 className="text-center">Your Bookings</h4>
                    <table className="table table-striped mt-3 table-bordered">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Booking Date</th>
                                <th>Type</th>
                                <th>Slot/Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">No bookings available</td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>{booking.customerName}</td>
                                        <td>{booking.customerEmail}</td>
                                        <td>{booking.bookingDate}</td>
                                        <td>{booking.bookingType}</td>
                                        <td>{booking.bookingType === "Custom" ? booking.bookingTime : booking.bookingSlot}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer className="bg-dark text-white text-center py-3 mt-auto">
                <p className="mb-0">© 2025 Booking System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
