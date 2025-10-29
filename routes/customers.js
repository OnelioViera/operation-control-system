const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getCustomers)
  .post(protect, authorize('admin', 'pm'), createCustomer);

router.route('/:id')
  .get(protect, getCustomer)
  .put(protect, authorize('admin', 'pm'), updateCustomer);

module.exports = router;

