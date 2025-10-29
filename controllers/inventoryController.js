const Inventory = require('../models/Inventory');
const { createAuditLog } = require('../middleware/auditLog');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getInventory = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = {};

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }

    const inventory = await Inventory.find(query).sort({ materialType: 1 });

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private
exports.updateInventoryItem = async (req, res, next) => {
  try {
    const oldItem = await Inventory.findById(req.params.id);

    if (!oldItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Log inventory update
    await createAuditLog(
      'INVENTORY_UPDATED',
      'INVENTORY',
      item._id,
      item.materialType,
      req.user,
      'Inventory updated',
      {
        previousQuantity: oldItem.currentQuantity,
        newQuantity: item.currentQuantity,
        previousStatus: oldItem.status,
        newStatus: item.status
      }
    );

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory alerts (low/critical items)
// @route   GET /api/inventory/alerts/low
// @access  Private
exports.getInventoryAlerts = async (req, res, next) => {
  try {
    const alerts = await Inventory.find({
      $or: [
        { status: 'LOW' },
        { status: 'CRITICAL' },
        { status: 'OUT_OF_STOCK' }
      ]
    }).sort({ status: 1, materialType: 1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    next(error);
  }
};

