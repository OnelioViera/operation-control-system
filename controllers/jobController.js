const Job = require('../models/Job');
const Customer = require('../models/Customer');
const Employee = require('../models/Employee');
const WorkflowTracking = require('../models/WorkflowTracking');
const { createAuditLog } = require('../middleware/auditLog');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res, next) => {
  try {
    const { stage, status, pm, search, limit = 50, page = 1 } = req.query;

    // Build query
    let query = { active: true };

    if (stage && stage !== 'all') {
      query.stage = stage.toUpperCase();
    }

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }

    if (pm && pm !== 'all') {
      query.pmCode = pm.toUpperCase();
    }

    if (search) {
      query.$or = [
        { jobNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { jobName: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .sort({ 'timeline.dueDate': 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('customer', 'companyName contactPerson phone')
      .populate('projectManager', 'name employeeCode email');

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('customer')
      .populate('projectManager')
      .populate('productionSchedule');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res, next) => {
  try {
    // Generate job number
    const year = new Date().getFullYear();
    const count = await Job.countDocuments({ 
      jobNumber: { $regex: `^JOB-${year}-` } 
    });
    const jobNumber = `JOB-${year}-${String(count + 1).padStart(3, '0')}`;

    // Get customer info
    let customer = await Customer.findById(req.body.customer);
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Create job
    const job = await Job.create({
      ...req.body,
      jobNumber,
      customerName: customer.companyName
    });

    // Update customer total jobs
    customer.totalJobs += 1;
    await customer.save();

    // Create initial workflow tracking
    await WorkflowTracking.create({
      job: job._id,
      jobNumber: job.jobNumber,
      stage: 'QUOTE',
      status: 'IN_PROGRESS'
    });

    // Log action
    await createAuditLog(
      'JOB_CREATED',
      'JOB',
      job._id,
      job.jobNumber,
      req.user,
      'New job created',
      { jobNumber, customerName: customer.companyName }
    );

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Store previous values for audit
    const previousValues = {
      stage: job.stage,
      status: job.status,
      pmCode: job.pmCode
    };

    // Update job
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Check if stage changed - trigger automation
    if (req.body.stage && req.body.stage !== previousValues.stage) {
      await createAuditLog(
        'STAGE_CHANGED',
        'JOB',
        job._id,
        job.jobNumber,
        req.user,
        `Stage changed from ${previousValues.stage} to ${req.body.stage}`,
        { previousStage: previousValues.stage, newStage: req.body.stage }
      );

      // Update workflow tracking
      await WorkflowTracking.findOneAndUpdate(
        { job: job._id, stage: previousValues.stage },
        { status: 'COMPLETE', actualCompletionDate: new Date() }
      );

      await WorkflowTracking.create({
        job: job._id,
        jobNumber: job.jobNumber,
        stage: req.body.stage,
        status: 'IN_PROGRESS',
        startDate: new Date()
      });
    }

    // Check if PM changed
    if (req.body.pmCode && req.body.pmCode !== previousValues.pmCode) {
      await createAuditLog(
        'PM_ASSIGNED',
        'JOB',
        job._id,
        job.jobNumber,
        req.user,
        `PM changed from ${previousValues.pmCode} to ${req.body.pmCode}`,
        { previousPM: previousValues.pmCode, newPM: req.body.pmCode }
      );
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (admin only)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Soft delete - just mark as inactive
    job.active = false;
    await job.save();

    // Log action
    await createAuditLog(
      'JOB_DELETED',
      'JOB',
      job._id,
      job.jobNumber,
      req.user,
      'Job deleted (soft delete)',
      { jobNumber: job.jobNumber }
    );

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats/summary
// @access  Private
exports.getJobStats = async (req, res, next) => {
  try {
    const stats = await Job.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 },
          totalQuoteAmount: { $sum: '$quoteAmount' },
          totalActualCost: { $sum: '$actualCost' },
          avgProgress: { $avg: '$progress' }
        }
      }
    ]);

    const byStage = await Job.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 }
        }
      }
    ]);

    const byStatus = await Job.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: stats[0] || {},
        byStage,
        byStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

