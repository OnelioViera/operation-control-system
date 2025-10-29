const express = require('express');
const router = express.Router();
const {
  getProductionSchedule,
  getProductionItem,
  createProductionSchedule,
  updateProductionSchedule
} = require('../controllers/productionController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getProductionSchedule)
  .post(protect, authorize('admin', 'pm', 'production'), createProductionSchedule);

router.route('/:id')
  .get(protect, getProductionItem)
  .put(protect, authorize('admin', 'pm', 'production'), updateProductionSchedule);

module.exports = router;

