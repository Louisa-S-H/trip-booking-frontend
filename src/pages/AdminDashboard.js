import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import AdminResourceManager from '../components/admin/AdminResourceManager';
import SiteContentManager from '../components/admin/SiteContentManager';
import ContactMessagesManager from '../components/admin/ContactMessagesManager';
import DashboardBrand from '../components/DashboardBrand';
import '../styles/Dashboard.css';

const CONTENT_SECTIONS = [
  { key: 'destinations', label: 'Destinations' },
  { key: 'tripStyles', label: 'Trip Styles' },
  { key: 'pastEvents', label: 'Past Events' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'team', label: 'Team' },
  { key: 'siteContent', label: 'Site Content' },
  { key: 'contactMessages', label: 'Contact Messages' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [contentSection, setContentSection] = useState('destinations');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'Flight',
    price: '',
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent',
    phone: '',
    department: '',
    specialization: '',
    bio: '',
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, servicesRes, agentsRes, usersRes] = await Promise.all([
        axiosInstance.get('/bookings'),
        axiosInstance.get('/services'),
        axiosInstance.get('/users/agents/list'),
        axiosInstance.get('/users'),
      ]);
      setBookings(bookingsRes.data.bookings);
      setServices(servicesRes.data);
      setAgents(agentsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    if (!newService.name || !newService.category || !newService.price) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/services', {
        ...newService,
        price: parseFloat(newService.price),
      });
      setServices((prev) => [response.data, ...prev]);
      setNewService({ name: '', description: '', category: 'Flight', price: '' });
      alert('Service created successfully!');
    } catch (err) {
      alert('Error creating service: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Please fill name, email and password');
      return;
    }

    try {
      const response = await axiosInstance.post('/users', {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        phone: newUser.phone,
        agentInfo: {
          department: newUser.department,
          specialization: newUser.specialization,
          bio: newUser.bio,
        },
      });
      setUsers((prev) => [response.data, ...prev]);
      setNewUser({ name: '', email: '', password: '', role: 'agent', phone: '', department: '', specialization: '', bio: '' });
      alert(`${response.data.role} account created successfully!`);
      fetchData();
    } catch (err) {
      alert('Error creating user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAssignAgent = async (bookingId, agentId) => {
    try {
      const response = await axiosInstance.put(`/bookings/${bookingId}/assign-agent`, {
        agentId,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? response.data : b))
      );
      setSelectedBooking(null);
      alert('Agent assigned successfully!');
    } catch (err) {
      alert('Error assigning agent: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <DashboardBrand title="Admin Portal" />
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            className={`tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Manage Services ({services.length})
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.length})
          </button>
          <button
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
        </div>

        {activeTab === 'bookings' && (
          <div className="admin-bookings">
            <h2>All Bookings</h2>
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Student</th>
                    <th>Agent</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.bookingNumber}</td>
                      <td>{booking.student.name}</td>
                      <td>{booking.assignedAgent?.name || 'Unassigned'}</td>
                      <td>${booking.totalPrice}</td>
                      <td>
                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>{booking.paymentStatus}</td>
                      <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="btn-view"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedBooking && (
              <div className="admin-detail-panel">
                <h2>Manage Booking</h2>
                <div className="detail-section">
                  <h3>Student & Services</h3>
                  <p><strong>Student:</strong> {selectedBooking.student.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.student.email}</p>
                  <div className="services-list">
                    {selectedBooking.services.map((item) => (
                      <p key={item._id}>{item.service?.name} - ${item.price}</p>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Assign Agent</h3>
                  {selectedBooking.assignedAgent ? (
                    <p><strong>Current Agent:</strong> {selectedBooking.assignedAgent.name}</p>
                  ) : (
                    <p>No agent assigned</p>
                  )}
                  <select
                    onChange={(e) =>
                      handleAssignAgent(selectedBooking._id, e.target.value)
                    }
                    defaultValue=""
                  >
                    <option value="">Select an agent...</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} - {agent.agentInfo?.specialization || 'General'}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn-cancel"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="admin-services">
            <div className="create-service">
              <h2>Add New Service</h2>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                />
                <select
                  value={newService.category}
                  onChange={(e) =>
                    setNewService({ ...newService, category: e.target.value })
                  }
                >
                  <option value="Flight">Flight</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Activities">Activities</option>
                  <option value="Bundles">Bundles</option>
                  <option value="Meet & Greet">Meet & Greet</option>
                  <option value="Visa Application">Visa Application</option>
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({ ...newService, description: e.target.value })
                  }
                />
              </div>
              <button onClick={handleCreateService} className="btn-create">
                Create Service
              </button>
            </div>

            <div className="services-list">
              <h2>All Services</h2>
              <div className="services-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service._id}>
                        <td>{service.name}</td>
                        <td>{service.category}</td>
                        <td>${service.price}</td>
                        <td>{service.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-services">
            <div className="admin-users-create">
              <h2>Create Agent / Admin Account</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                Public signup only creates student accounts. Use this form to create Agent or Admin
                accounts directly. Share the temporary password with them so they can log in and
                change it from their profile.
              </p>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Temporary Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="Phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                />
                {newUser.role === 'agent' && (
                  <>
                    <input
                      type="text"
                      placeholder="Department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Specialization"
                      value={newUser.specialization}
                      onChange={(e) => setNewUser({ ...newUser, specialization: e.target.value })}
                    />
                    <textarea
                      placeholder="Bio"
                      value={newUser.bio}
                      onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                    />
                  </>
                )}
              </div>
              <button onClick={handleCreateUser} className="btn-create">
                Create Account
              </button>
            </div>

            <div className="services-list">
              <h2>All Users ({users.length})</h2>
              <div className="services-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="admin-services">
            <div className="admin-content-nav">
              {CONTENT_SECTIONS.map((section) => (
                <button
                  key={section.key}
                  className={contentSection === section.key ? 'active' : ''}
                  onClick={() => setContentSection(section.key)}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {contentSection === 'destinations' && (
              <AdminResourceManager
                title="Destinations"
                endpoint="/destinations"
                primaryField={{ name: 'name', label: 'Name' }}
                fields={[
                  { name: 'name', label: 'Name', type: 'text' },
                  { name: 'slug', label: 'Slug (e.g. singapore)', type: 'text' },
                  { name: 'country', label: 'Country', type: 'text' },
                  { name: 'summary', label: 'Summary', type: 'textarea' },
                  { name: 'description', label: 'Description', type: 'textarea' },
                  { name: 'heroImage', label: 'Hero Image URL', type: 'text' },
                  { name: 'gallery', label: 'Gallery Images', type: 'array' },
                  { name: 'order', label: 'Order', type: 'number' },
                  { name: 'isActive', label: 'Active', type: 'checkbox' },
                ]}
              />
            )}

            {contentSection === 'tripStyles' && (
              <AdminResourceManager
                title="Trip Styles"
                endpoint="/trip-styles"
                primaryField={{ name: 'name', label: 'Name' }}
                fields={[
                  { name: 'name', label: 'Name', type: 'text' },
                  { name: 'slug', label: 'Slug (e.g. edu-travel)', type: 'text' },
                  { name: 'summary', label: 'Summary', type: 'textarea' },
                  { name: 'description', label: 'Description', type: 'textarea' },
                  { name: 'heroImage', label: 'Hero Image URL', type: 'text' },
                  { name: 'order', label: 'Order', type: 'number' },
                  { name: 'isActive', label: 'Active', type: 'checkbox' },
                ]}
              />
            )}

            {contentSection === 'pastEvents' && (
              <AdminResourceManager
                title="Past Events"
                endpoint="/past-events"
                primaryField={{ name: 'title', label: 'Title' }}
                fields={[
                  { name: 'title', label: 'Title', type: 'text' },
                  { name: 'type', label: 'Type', type: 'select', options: ['Case Study', 'Media'], default: 'Case Study' },
                  { name: 'summary', label: 'Summary', type: 'textarea' },
                  { name: 'body', label: 'Body', type: 'textarea' },
                  { name: 'coverImage', label: 'Cover Image URL', type: 'text' },
                  { name: 'images', label: 'Gallery Images', type: 'array' },
                  { name: 'eventDate', label: 'Event Date', type: 'date' },
                  { name: 'order', label: 'Order', type: 'number' },
                  { name: 'isActive', label: 'Active', type: 'checkbox' },
                ]}
              />
            )}

            {contentSection === 'testimonials' && (
              <AdminResourceManager
                title="Testimonials"
                endpoint="/testimonials"
                primaryField={{ name: 'authorName', label: 'Author' }}
                fields={[
                  { name: 'authorName', label: 'Author Name', type: 'text' },
                  { name: 'programme', label: 'Programme', type: 'text' },
                  { name: 'quote', label: 'Quote', type: 'textarea' },
                  { name: 'rating', label: 'Rating (1-5)', type: 'number', default: 5 },
                  { name: 'photo', label: 'Photo URL', type: 'text' },
                  { name: 'order', label: 'Order', type: 'number' },
                  { name: 'isActive', label: 'Active', type: 'checkbox' },
                ]}
              />
            )}

            {contentSection === 'team' && (
              <AdminResourceManager
                title="Team Members"
                endpoint="/team"
                primaryField={{ name: 'name', label: 'Name' }}
                fields={[
                  { name: 'name', label: 'Name', type: 'text' },
                  { name: 'role', label: 'Role', type: 'text' },
                  { name: 'bio', label: 'Bio', type: 'textarea' },
                  { name: 'photo', label: 'Photo URL', type: 'text' },
                  { name: 'order', label: 'Order', type: 'number' },
                  { name: 'isActive', label: 'Active', type: 'checkbox' },
                ]}
              />
            )}

            {contentSection === 'siteContent' && <SiteContentManager />}
            {contentSection === 'contactMessages' && <ContactMessagesManager />}
          </div>
        )}
      </div>
    </div>
  );
}
