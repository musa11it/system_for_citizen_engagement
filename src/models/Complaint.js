const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['water_supply', 'electricity', 'roads', 'waste_management', 'public_transport', 'street_lighting', 'drainage', 'other']
  },
  assignedAgency: {
    type: String,
    required: true,
    enum: ['water_authority', 'electricity_board', 'road_maintenance', 'waste_management', 'transport_authority', 'infrastructure', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  location: {
    type: String,
    required: true
  },
  citizenContact: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-assign agency based on category
complaintSchema.pre('save', function(next) {
  const categoryToAgency = {
    'water_supply': 'water_authority',
    'electricity': 'electricity_board',
    'roads': 'road_maintenance',
    'waste_management': 'waste_management',
    'public_transport': 'transport_authority',
    'street_lighting': 'infrastructure',
    'drainage': 'infrastructure'
  };
  
  if (!this.assignedAgency || this.assignedAgency === 'other') {
    this.assignedAgency = categoryToAgency[this.category] || 'other';
  }
  
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);