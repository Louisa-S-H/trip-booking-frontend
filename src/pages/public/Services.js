import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useCart } from '../../context/CartContext';
import '../../styles/Dashboard.css';

const CATEGORIES = ['Flight', 'Hotel', 'Activities', 'Bundles', 'Meet & Greet', 'Visa Application'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/services', { params: category ? { category } : {} })
      .then((res) => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [category]);

  const handleAdd = (service) => {
    addItem(service);
    setAddedId(service._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Services Booking</h1>
        <p>Flights, hotels, activities, bundles, meet &amp; greet, and visa application support.</p>
      </div>

      <div className="tabs" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className={`tab ${category === '' ? 'active' : ''}`} onClick={() => setCategory('')}>
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service._id} className="service-card">
              <h3>{service.name}</h3>
              <p className="category">{service.category}</p>
              <p className="description">{service.description}</p>
              <p className="price">${service.price}</p>
              <button onClick={() => handleAdd(service)} className="btn-select">
                {addedId === service._id ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          ))}
          {services.length === 0 && <p>No services available in this category.</p>}
        </div>
      )}
    </div>
  );
}
