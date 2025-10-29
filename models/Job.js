const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: String, // Denormalized for quick access
  jobName: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    zip: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  stage: {
    type: String,
    enum: ['QUOTE', 'ENGINEERING', 'PRODUCTION', 'DELIVERY', 'COMPLETE'],
    default: 'QUOTE',
    required: true
  },
  status: {
    type: String,
    enum: ['ON_TRACK', 'AT_RISK', 'DELAYED', 'COMPLETE', 'CANCELLED'],
    default: 'ON_TRACK',
    required: true
  },
  priority: {
    type: String,
    enum: ['LOW', 'STANDARD', 'HIGH', 'URGENT'],
    default: 'STANDARD'
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  pmCode: String, // e.g., SMITH_J
  pmName: String, // Denormalized
  products: [{
    type: {
      type: String,
      enum: ['SANITARY', 'STORM', 'VAULT', 'INLET', 'CUSTOM'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    size: String,
    specifications: String,
    status: {
      type: String,
      enum: ['PENDING', 'ENGINEERING', 'IN_PRODUCTION', 'CURING', 'QC_PASSED', 'QC_FAILED', 'READY', 'DELIVERED'],
      default: 'PENDING'
    }
  }],
  productsDescription: String, // e.g., "12x STORM STRUCTURES"
  quoteAmount: {
    type: Number,
    default: 0
  },
  actualCost: {
    type: Number,
    default: 0
  },
  profitMargin: Number,
  timeline: {
    quoteSubmitted: Date,
    quoteApproved: Date,
    engineeringStart: Date,
    engineeringComplete: Date,
    productionStart: Date,
    productionComplete: Date,
    deliveryScheduled: Date,
    deliveryComplete: Date,
    dueDate: {
      type: Date,
      required: true
    },
    estimatedCompletion: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  daysOffset: {
    type: Number,
    default: 0
  },
  productionSchedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductionSchedule'
  },
  notes: String,
  documents: [{
    type: {
      type: String,
      enum: ['QUOTE', 'SHOP_DRAWING', 'SPECIFICATION', 'INVOICE', 'DELIVERY_TICKET', 'OTHER']
    },
    filename: String,
    url: String,
    uploadedAt: Date
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
jobSchema.index({ jobNumber: 1 });
jobSchema.index({ customer: 1 });
jobSchema.index({ stage: 1, status: 1 });
jobSchema.index({ 'timeline.dueDate': 1 });

// Calculate days offset before saving
jobSchema.pre('save', function(next) {
  if (this.timeline && this.timeline.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.timeline.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    this.daysOffset = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

module.exports = mongoose.model('Job', jobSchema);

