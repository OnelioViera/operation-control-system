const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  getPMWorkload
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getEmployees)
  .post(protect, createEmployee);

router.route('/stats/workload')
  .get(protect, getPMWorkload);

router.route('/:id')
  .get(protect, getEmployee)
  .put(protect, authorize('admin'), updateEmployee);

module.exports = router;

