import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { MdOutlineTrackChanges, MdWaterDrop, MdElectricalServices, MdEditRoad } from 'react-icons/md';

const HomePage = () => {
  const [agencies, setAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [complaintData, setComplaintData] = useState({
    title: '',
    description: '',
    nationalId: '',
    category: '',
    location: '',
    citizenContact: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/agencies');
      const data = await response.json();
      setAgencies(data);
      setFilteredAgencies(data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...complaintData,
          assignedAgency: selectedAgency
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTrackingId(data._id);
        setShowComplaintForm(false);
        setShowSuccessPopup(true);
        setComplaintData({
          title: '',
          description: '',
          nationalId: '',
          location: '',
          citizenContact: ''
        });
      } else {
        alert('Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Error submitting complaint. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to Citizen Engagement System
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Your platform for submitting and tracking community complaints
          </p>

          {/* Main Action Buttons */}
          <div className="flex justify-center gap-6 mb-16">
            <Link
              to="/submit-complaint"
              className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300"
            >
              <BiMessageSquareDetail className="text-2xl mr-2" />
              <span className="text-lg font-semibold">Submit Complaint</span>
            </Link>
            <Link
              to="/track-complaint"
              className="flex items-center px-8 py-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transform hover:scale-105 transition duration-300"
            >
              <MdOutlineTrackChanges className="text-2xl mr-2" />
              <span className="text-lg font-semibold">Track Complaint</span>
            </Link>
          </div>

          {/* Agency Section Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Partner Agencies</h2>
          
          {/* Dynamic Agency List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgencies.map(agency => (
              <div key={agency._id} className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
                {agency.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={agency.imageUrl}
                      alt={`${agency.name} logo`}
                      className="w-32 h-32 object-cover rounded-full mx-auto ring-4 ring-blue-100"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{agency.name}</h3>
                <p className="text-blue-600 mb-3">{agency.email}</p>
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-700">{agency.location}</p>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-700">Complaints Handled: {agency.complaintsHandled || 0}</p>
                </div>
                {agency.status === 'active' && (
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-4">
                    ● Active
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedAgency(agency._id);
                    setShowComplaintForm(true);
                  }}
                  className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Submit Complaint to {agency.name}
                </button>
              </div>
            ))}
          </div>

          {/* Static Partner Agencies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Water Authority */}
            <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <div className="mb-6 text-center">
                <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <MdWaterDrop className="w-20 h-20 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Water Authority</h3>
              <p className="text-blue-600 mb-3 text-center">water.authority@example.com</p>
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-gray-700">Main Office: 123 Water Street</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-gray-700">24/7 Helpline: 1-800-WATER</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-700">Complaints Handled: 1,234</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600">Services:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                  <li>Water Supply Management</li>
                  <li>Pipeline Maintenance</li>
                  <li>Water Quality Testing</li>
                  <li>Emergency Repairs</li>
                </ul>
              </div>
              <div className="flex items-center justify-center mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  ● Active
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full ml-2">
                  Average Response: 24h
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedAgency('water_authority');
                  setShowComplaintForm(true);
                }}
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Submit Complaint
              </button>
            </div>

            {/* Electricity Board */}
            <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <div className="mb-6 text-center">
                <div className="w-32 h-32 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                  <MdElectricalServices className="w-20 h-20 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Electricity Board</h3>
              <p className="text-blue-600 mb-3 text-center">power.board@example.com</p>
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-gray-700">Head Office: 456 Power Avenue</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-gray-700">Emergency: 1-800-POWER</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-700">Complaints Handled: 2,156</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600">Services:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                  <li>Power Distribution</li>
                  <li>Grid Maintenance</li>
                  <li>Emergency Repairs</li>
                  <li>New Connections</li>
                </ul>
              </div>
              <div className="flex items-center justify-center mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  ● Active
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full ml-2">
                  Average Response: 12h
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedAgency('electricity_board');
                  setShowComplaintForm(true);
                }}
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Submit Complaint
              </button>
            </div>

            {/* Road Maintenance */}
            <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300">
              <div className="mb-6 text-center">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <MdEditRoad className="w-20 h-20 text-gray-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Road Maintenance</h3>
              <p className="text-blue-600 mb-3 text-center">roads.dept@example.com</p>
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <p className="text-gray-700">Office: 789 Highway Street</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-gray-700">Hotline: 1-800-ROADS</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-700">Complaints Handled: 1,879</p>
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <p className="text-sm text-gray-600">Services:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                  <li>Road Repairs</li>
                  <li>Traffic Management</li>
                  <li>Street Maintenance</li>
                  <li>Infrastructure Development</li>
                </ul>
              </div>
              <div className="flex items-center justify-center mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  ● Active
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full ml-2">
                  Average Response: 48h
                </span>
              </div>
              <button 
                onClick={() => {
                  setSelectedAgency('road_maintenance');
                  setShowComplaintForm(true);
                }}
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-90vh overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Submit Complaint</h2>
            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={complaintData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={complaintData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="water_supply">Water Supply</option>
                  <option value="electricity">Electricity</option>
                  <option value="roads">Roads</option>
                  <option value="waste_management">Waste Management</option>
                  <option value="public_transport">Public Transport</option>
                  <option value="street_lighting">Street Lighting</option>
                  <option value="drainage">Drainage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={complaintData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">National ID</label>
                <input
                  type="text"
                  name="nationalId"
                  value={complaintData.nationalId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  placeholder="Enter your National ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={complaintData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Information</label>
                <input
                  type="text"
                  name="citizenContact"
                  value={complaintData.citizenContact}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="mb-4 text-green-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Complaint Submitted Successfully!</h2>
            <p className="mb-4 text-gray-600">Your tracking ID is:</p>
            <div className="bg-gray-100 p-3 rounded-lg mb-6">
              <p className="text-lg font-mono font-bold text-gray-800">{trackingId}</p>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              Please save this tracking ID. You'll need it to check the status of your complaint.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(trackingId);
                  alert('Tracking ID copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
              >
                Copy ID
              </button>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;