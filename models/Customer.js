const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  customerType: {
    type: String,
    enum: ['contractor', 'municipality', 'developer', 'utility', 'other'],
    default: 'contractor'
  },
  portalAccess: {
    enabled: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastLogin: Date
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);

