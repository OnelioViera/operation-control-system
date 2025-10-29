const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLog');

router.route('/')
  .get(protect, getJobs)
  .post(protect, authorize('admin', 'pm'), logAction('JOB_CREATED', 'JOB'), createJob);

router.route('/stats/summary')
  .get(protect, getJobStats);

router.route('/:id')
  .get(protect, getJob)
  .put(protect, authorize('admin', 'pm'), logAction('JOB_UPDATED', 'JOB'), updateJob)
  .delete(protect, authorize('admin'), logAction('JOB_DELETED', 'JOB'), deleteJob);

module.exports = router;

