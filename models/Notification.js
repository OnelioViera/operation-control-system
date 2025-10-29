const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientEmail: String,
  type: {
    type: String,
    enum: ['INFO', 'WARNING', 'ALERT', 'SUCCESS', 'ERROR'],
    default: 'INFO'
  },
  priority: {
    type: String,
    enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
    default: 'NORMAL'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedEntity: {
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    entityName: String
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  expiresAt: Date
}, {
  timestamps: true
});

// Index
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

