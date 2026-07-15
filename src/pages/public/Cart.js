import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import '../../styles/Cart.css';

export default function Cart() {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [travelDate, setTravelDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setError('');

    if (items.length === 0) return;

    if (!user) {
      navigate('/login?redirect=/cart');
      return;
    }

    if (user.role !== 'student') {
      setError('Only student accounts can book trips. Please log in with a student account.');
      return;
    }

    if (!travelDate) {
      setError('Please select a travel date.');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        services: items.map((item) => ({
          service: item.service._id,
          quantity: item.quantity,
          price: item.service.price,
        })),
        totalPrice,
        travelDate,
      };
      await axiosInstance.post('/bookings', bookingData);
      clearCart();
      alert('Booking created successfully! You can track its progress in My Bookings.');
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Your Cart</h1>
      </div>

      {items.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty. Head over to Services to add something.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item, index) => (
              <div key={index} className="cart-item">
                <div>
                  <strong>{item.service.name}</strong>
                  <p>{item.service.category}</p>
                </div>
                <div className="cart-item-price">${item.service.price}</div>
                <button onClick={() => removeItem(index)} className="btn-remove">Remove</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Checkout</h2>

            <div className="form-group">
              <label>Travel Date</label>
              <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
            </div>

            <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>

            {error && <p className="cart-error">{error}</p>}
            {!user && <p className="cart-note">You'll need to log in or sign up to complete your booking.</p>}

            <button onClick={handleCheckout} className="btn-checkout" disabled={submitting}>
              {submitting ? 'Placing Booking...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
