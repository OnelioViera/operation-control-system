const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  materialType: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: String,
  currentQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['LB', 'YD³', 'UNITS', 'FT', 'GAL']
  },
  minimumQuantity: {
    type: Number,
    required: true
  },
  reorderPoint: Number,
  status: {
    type: String,
    enum: ['OK', 'LOW', 'CRITICAL', 'OUT_OF_STOCK'],
    default: 'OK'
  },
  supplier: String,
  costPerUnit: Number,
  lastOrdered: Date,
  expectedDelivery: Date,
  location: String
}, {
  timestamps: true
});

// Auto-update status based on quantity
inventorySchema.pre('save', function(next) {
  if (this.currentQuantity <= 0) {
    this.status = 'OUT_OF_STOCK';
  } else if (this.currentQuantity < this.minimumQuantity * 0.5) {
    this.status = 'CRITICAL';
  } else if (this.currentQuantity < this.minimumQuantity) {
    this.status = 'LOW';
  } else {
    this.status = 'OK';
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);

