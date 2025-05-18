const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  complaintsHandled: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isStatic: { type: Boolean, default: false },
  services: [{ type: String }],
  contactNumber: { type: String },
  averageResponseTime: { type: String },
  description: { type: String },
  icon: { type: String } // For storing icon class name or path
});

module.exports = mongoose.model('Agency', agencySchema);