import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import DashboardBrand from '../components/DashboardBrand';
import '../styles/Dashboard.css';

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings/agent/assignments');
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId) => {
    const updates = statusUpdates[bookingId];
    if (!updates) return;

    try {
      const response = await axiosInstance.put(`/bookings/${bookingId}/status`, updates);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? response.data : b))
      );
      setStatusUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[bookingId];
        return newUpdates;
      });
      setSelectedBooking(null);
      alert('Booking updated successfully!');
    } catch (err) {
      alert('Error updating booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const updateStatusField = (bookingId, field, value) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], [field]: value },
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <DashboardBrand title="Agent Portal" />
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="agent-main">
          <div className="bookings-list-section">
            <h2>Student Bookings Assigned to You</h2>
            {bookings.length === 0 ? (
              <p>No bookings assigned yet.</p>
            ) : (
              <div className="bookings-table">
                <table>
                  <thead>
                    <tr>
                      <th>Booking #</th>
                      <th>Student</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Travel Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.bookingNumber}</td>
                        <td>{booking.student.name}</td>
                        <td>${booking.totalPrice}</td>
                        <td>
                          <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="btn-view"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selectedBooking && (
            <div className="booking-detail-panel">
              <h2>Update Booking</h2>
              <div className="detail-section">
                <h3>Student Information</h3>
                <p><strong>Name:</strong> {selectedBooking.student.name}</p>
                <p><strong>Email:</strong> {selectedBooking.student.email}</p>
                <p><strong>Phone:</strong> {selectedBooking.student.phone}</p>
              </div>

              <div className="detail-section">
                <h3>Booking Details</h3>
                <p><strong>Booking #:</strong> {selectedBooking.bookingNumber}</p>
                <p><strong>Total Price:</strong> ${selectedBooking.totalPrice}</p>
                <p><strong>Travel Date:</strong> {new Date(selectedBooking.travelDate).toLocaleDateString()}</p>
              </div>

              <div className="detail-section">
                <h3>Services</h3>
                {selectedBooking.services.map((item) => (
                  <div key={item._id} className="service-item">
                    <p><strong>{item.service.name}</strong> - ${item.price}</p>
                  </div>
                ))}
              </div>

              <div className="update-section">
                <h3>Update Status</h3>

                <div className="form-group">
                  <label>Booking Status:</label>
                  <select
                    value={statusUpdates[selectedBooking._id]?.status || selectedBooking.status}
                    onChange={(e) =>
                      updateStatusField(selectedBooking._id, 'status', e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Payment Status:</label>
                  <select
                    value={statusUpdates[selectedBooking._id]?.paymentStatus || selectedBooking.paymentStatus}
                    onChange={(e) =>
                      updateStatusField(selectedBooking._id, 'paymentStatus', e.target.value)
                    }
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Notes:</label>
                  <textarea
                    value={statusUpdates[selectedBooking._id]?.notes || selectedBooking.notes || ''}
                    onChange={(e) =>
                      updateStatusField(selectedBooking._id, 'notes', e.target.value)
                    }
                    rows="4"
                  />
                </div>

                <div className="button-group">
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking._id)}
                    className="btn-save"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
