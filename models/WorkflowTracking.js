const mongoose = require('mongoose');

const workflowTrackingSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobNumber: String,
  stage: {
    type: String,
    enum: ['QUOTE', 'ENGINEERING', 'PRODUCTION', 'DELIVERY', 'COMPLETE'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETE', 'BLOCKED', 'CANCELLED'],
    default: 'PENDING'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  startDate: Date,
  estimatedCompletionDate: Date,
  actualCompletionDate: Date,
  blockedReason: String,
  notes: String,
  milestones: [{
    name: String,
    targetDate: Date,
    completedDate: Date,
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETE', 'OVERDUE']
    }
  }]
}, {
  timestamps: true
});

// Index
workflowTrackingSchema.index({ job: 1, stage: 1 });
workflowTrackingSchema.index({ estimatedCompletionDate: 1, status: 1 });

module.exports = mongoose.model('WorkflowTracking', workflowTrackingSchema);

