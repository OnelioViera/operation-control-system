const mongoose = require('mongoose');

const productionScheduleSchema = new mongoose.Schema({
  productionId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobNumber: String, // Denormalized
  productionStage: {
    type: String,
    enum: ['SCHEDULED', 'IN_PROGRESS', 'CURING', 'QC', 'FINISHED', 'DELAYED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  pourDate: Date,
  cureCompleteDate: Date,
  expectedCompletionDate: Date,
  actualCompletionDate: Date,
  forms: [{
    formId: String,
    formName: String,
    assigned: Boolean
  }],
  crew: {
    teamId: String,
    teamName: String,
    supervisor: String,
    workers: [String]
  },
  materials: [{
    materialType: String,
    quantityRequired: Number,
    quantityAvailable: Number,
    unit: String,
    status: {
      type: String,
      enum: ['AVAILABLE', 'ORDERED', 'SHORTAGE'],
      default: 'AVAILABLE'
    }
  }],
  qualityChecks: [{
    inspector: String,
    checkDate: Date,
    passed: Boolean,
    notes: String,
    failureReason: String
  }],
  temperature: Number, // Affects cure time
  notes: String
}, {
  timestamps: true
});

// Index for queries
productionScheduleSchema.index({ scheduledDate: 1 });
productionScheduleSchema.index({ productionStage: 1 });
productionScheduleSchema.index({ job: 1 });

module.exports = mongoose.model('ProductionSchedule', productionScheduleSchema);

