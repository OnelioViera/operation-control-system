const express = require('express');
const router = express.Router();
const {
  getInventory,
  getInventoryItem,
  updateInventoryItem,
  getInventoryAlerts
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getInventory);

router.route('/alerts/low')
  .get(protect, getInventoryAlerts);

router.route('/:id')
  .get(protect, getInventoryItem)
  .put(protect, authorize('admin', 'production'), updateInventoryItem);

module.exports = router;

