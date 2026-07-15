import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import DashboardBrand from '../components/DashboardBrand';
import '../styles/Dashboard.css';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/bookings/my-bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error('Error fetching bookings:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <DashboardBrand title="My Bookings" />
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <Link to="/services" className="btn-logout">Browse Services</Link>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="bookings-section">
          <h2>My Bookings ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p>
              No bookings yet. <Link to="/services">Browse services</Link> and add some to your cart to get started!
            </p>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>Booking #{booking.bookingNumber}</h3>
                    <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                    <p><strong>Travel Date:</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>
                    <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
                    <p>
                      <strong>Services:</strong>{' '}
                      {booking.services.map((s) => s.service?.name).filter(Boolean).join(', ')}
                    </p>
                    {booking.assignedAgent && (
                      <div className="agent-info">
                        <h4>Assigned Agent</h4>
                        <p><strong>Name:</strong> {booking.assignedAgent.name}</p>
                        <p><strong>Email:</strong> {booking.assignedAgent.email}</p>
                        <p><strong>Phone:</strong> {booking.assignedAgent.phone}</p>
                      </div>
                    )}
                    {booking.notes && (
                      <p><strong>Notes from your agent:</strong> {booking.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
