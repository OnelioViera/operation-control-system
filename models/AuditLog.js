const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'JOB_CREATED', 'JOB_UPDATED', 'JOB_DELETED',
      'STATUS_CHANGED', 'STAGE_CHANGED', 'PM_ASSIGNED',
      'PRODUCTION_SCHEDULED', 'PRODUCTION_STARTED', 'PRODUCTION_COMPLETE',
      'QUALITY_CHECK', 'DELIVERY_SCHEDULED', 'DELIVERY_COMPLETE',
      'CUSTOMER_LOGIN', 'USER_LOGIN', 'USER_LOGOUT',
      'INVENTORY_UPDATED', 'MATERIAL_ORDERED',
      'NOTIFICATION_SENT', 'AUTOMATION_TRIGGERED',
      'OTHER'
    ]
  },
  entityType: {
    type: String,
    enum: ['JOB', 'CUSTOMER', 'EMPLOYEE', 'PRODUCTION', 'INVENTORY', 'USER', 'SYSTEM']
  },
  entityId: mongoose.Schema.Types.ObjectId,
  entityName: String, // Denormalized for easy reading
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: String,
  action: String,
  details: mongoose.Schema.Types.Mixed,
  previousValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Index for faster queries
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ eventType: 1 });
auditLogSchema.index({ user: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);

