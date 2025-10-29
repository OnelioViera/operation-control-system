const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  role: {
    type: String,
    enum: ['PROJECT_MANAGER', 'PRODUCTION_MANAGER', 'QC_INSPECTOR', 'DELIVERY_COORDINATOR', 'ADMIN'],
    required: true
  },
  department: {
    type: String,
    enum: ['MANAGEMENT', 'ENGINEERING', 'PRODUCTION', 'DELIVERY', 'SALES'],
    required: true
  },
  capacity: {
    type: Number,
    default: 10 // Maximum concurrent jobs
  },
  activeJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  currentLoad: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate load percentage
employeeSchema.virtual('loadPercentage').get(function() {
  return Math.round((this.currentLoad / this.capacity) * 100);
});

employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);

