import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  // All hooks must be at the top level
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  // Move the useState hook inside the component
  const [staticAgencyData, setStaticAgencyData] = useState({
    name: '',
    email: '',
    location: '',
    contactNumber: '',
    services: [],
    averageResponseTime: '',
    description: '',
    icon: '',
    isStatic: true
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAgencies: 0,
    totalComplaints: 0,
    resolvedComplaints: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    image: null
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [agencies, setAgencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    allowRegistration: true,
    emailNotifications: true,
    maintenanceMode: false
  });
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'citizen'
  });

  useEffect(() => {
    checkAuth();
    if (activeTab === 'dashboard') {
      fetchStatistics();
    } else if (activeTab === 'agencies') {
      fetchAgencies();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/auth/verify', {
        headers: { 'Authorization': token }
      });

      if (!response.ok) throw new Error('Token verification failed');

      if (user.role !== 'super_admin') {
        setMessage({ type: 'error', text: 'Access denied. Super admin only.' });
        navigate('/login');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/auth/statistics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAgencies = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/auth/agencies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agencies');
      }

      const data = await response.json();
      setAgencies(data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load agencies. Please try again.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user || user.role !== 'super_admin') {
        setMessage({ type: 'error', text: 'Please login as super admin' });
        navigate('/login');
        return;
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('location', formData.location);
      if (formData.image) {
        data.append('image', formData.image);
      }

      try {
        const response = await fetch('http://localhost:5001/api/auth/agencies', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: data
        });
      
        const result = await response.json();
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setMessage({ 
              type: 'error', 
              text: 'Your session has expired. Please log in again.'
            });
            navigate('/login');
          } else {
            throw new Error(result.error || 'Failed to create agency');
          }
          return;
        }
      
        setMessage({ type: 'success', text: 'Agency created successfully!' });
        setFormData({ name: '', email: '', location: '', image: null });
        e.target.reset();
        await fetchAgencies(); // Add await here
      } catch (error) {
        console.error('Error creating agency:', error);
        setMessage({ 
          type: 'error', 
          text: error.message || 'Failed to create agency. Please try again.'
        });
      }
    } catch (error) {
      if (error.message.includes('authenticate') || error.message.includes('denied')) {
        navigate('/login');
      }
    }
  };

  const handleSettingsUpdate = async (setting, value) => {
    try {
      setSettings({ ...settings, [setting]: value });
      // Add API call to update settings in backend
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleUserStatusUpdate = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/auth/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update user status');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!userData.username || !userData.email || !userData.password) {
        setMessage({ type: 'error', text: 'All fields are required' });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        setMessage({ type: 'error', text: 'Please enter a valid email address' });
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
  
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check if the server is running.');
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      setMessage({ type: 'success', text: 'User created successfully!' });
      setUserData({ username: '', email: '', password: '', role: 'citizen' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to create user. Please try again.'
      });
    }
  };

  const handleStaticAgencySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/auth/agencies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(staticAgencyData)
      });
  
      if (!response.ok) throw new Error('Failed to create static agency');
      
      setMessage({ type: 'success', text: 'Static agency created successfully!' });
      setStaticAgencyData({
        name: '',
        email: '',
        location: '',
        contactNumber: '',
        services: [],
        averageResponseTime: '',
        description: '',
        icon: '',
        isStatic: true
      });
      fetchAgencies();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navigation Tabs */}
      <div className="bg-white shadow rounded-lg mb-6">
        <nav className="flex space-x-4 p-4">
          {[
            ['dashboard', 'Dashboard'],
            ['agencies', 'Agencies'],
            ['users', 'Users'],
            ['settings', 'Settings']
          ].map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md ${activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Statistics */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            ['Total Users', stats.totalUsers, 'bg-blue-500'],
            ['Total Agencies', stats.totalAgencies, 'bg-green-500'],
            ['Total Complaints', stats.totalComplaints, 'bg-yellow-500'],
            ['Resolved Complaints', stats.resolvedComplaints, 'bg-purple-500']
          ].map(([label, value, color]) => (
            <div key={label} className={`${color} text-white rounded-lg p-6 shadow-lg`}>
              <h3 className="text-lg font-semibold">{label}</h3>
              <p className="text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Agencies Management */}
      {activeTab === 'agencies' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Agency Management</h2>
          
          {/* Static Agency Form */}
          <div className="mb-8 border-b pb-8">
            <h3 className="text-xl font-semibold mb-4">Add Static Agency</h3>
            <form onSubmit={handleStaticAgencySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={staticAgencyData.name}
                    onChange={(e) => setStaticAgencyData({...staticAgencyData, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={staticAgencyData.email}
                    onChange={(e) => setStaticAgencyData({...staticAgencyData, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={staticAgencyData.location}
                    onChange={(e) => setStaticAgencyData({...staticAgencyData, location: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    value={staticAgencyData.contactNumber}
                    onChange={(e) => setStaticAgencyData({...staticAgencyData, contactNumber: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Services (comma-separated)</label>
                  <input
                    type="text"
                    value={staticAgencyData.services.join(', ')}
                    onChange={(e) => setStaticAgencyData({...staticAgencyData, services: e.target.value.split(',').map(s => s.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Water Supply, Pipeline Maintenance"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Average Response Time</label>
                  <input
                    type="text"
                    value={staticAgencyData.averageResponseTime}
                    onChange={(e) => setStaticAgencyData({...staticAgencyData, averageResponseTime: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., 24 hours"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={staticAgencyData.description}
                    onChange={(e) => setStaticAgencyData({...staticAgencyData, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Icon Class</label>
                  <input
                    type="text"
                    value={staticAgencyData.icon}
                    onChange={(e) => setStaticAgencyData({...staticAgencyData, icon: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., MdWaterDrop"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Static Agency
                </button>
              </div>
            </form>
          </div>
          
          {/* Existing Agency Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Agency Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Agency Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                  className="mt-1 block w-full"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Agency
              </button>
            </div>
          </form>
          
          {/* Display message if any */}
          {message.text && (
            <div className={`mt-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">User Management</h2>
          
          {/* Add User Form */}
          <form onSubmit={handleUserSubmit} className="mb-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({...userData, username: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({...userData, password: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={userData.role}
                  onChange={(e) => setUserData({...userData, role: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="citizen">Citizen</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add User
              </button>
            </div>
          </form>
          
          {/* Display message if any */}
          {message.text && (
            <div className={`mt-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </div>
      )}

      {/* Settings Management */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">System Settings</h2>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-4 border-b">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {`Manage ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} settings`}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleSettingsUpdate(key, !value)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={value}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;