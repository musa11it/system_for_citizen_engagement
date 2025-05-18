const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['citizen', 'admin', 'super_admin'],
    default: 'citizen'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_admins',
      'manage_complaints',
      'manage_agencies',
      'view_analytics',
      'system_settings'
    ]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    switch (this.role) {
      case 'super_admin':
        this.permissions = [
          'manage_users',
          'manage_admins',
          'manage_complaints',
          'manage_agencies',
          'view_analytics',
          'system_settings'
        ];
        break;
      case 'admin':
        this.permissions = ['manage_complaints', 'view_analytics'];
        break;
      default:
        this.permissions = [];
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);