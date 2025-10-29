const ProductionSchedule = require('../models/ProductionSchedule');
const Job = require('../models/Job');
const { createAuditLog } = require('../middleware/auditLog');

// @desc    Get production schedule
// @route   GET /api/production
// @access  Private
exports.getProductionSchedule = async (req, res, next) => {
  try {
    const { stage, startDate, endDate, range = 'daily' } = req.query;

    let query = {};

    if (stage && stage !== 'all') {
      query.productionStage = stage.toUpperCase();
    }

    // Date range filtering
    let dateQuery = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (range === 'daily') {
      // Next 7 days
      const endDay = new Date(today);
      endDay.setDate(endDay.getDate() + 7);
      dateQuery = {
        scheduledDate: { $gte: today, $lte: endDay }
      };
    } else if (range === 'weekly') {
      // Next 30 days
      const endDay = new Date(today);
      endDay.setDate(endDay.getDate() + 30);
      dateQuery = {
        scheduledDate: { $gte: today, $lte: endDay }
      };
    } else if (range === 'monthly') {
      // Next 90 days
      const endDay = new Date(today);
      endDay.setDate(endDay.getDate() + 90);
      dateQuery = {
        scheduledDate: { $gte: today, $lte: endDay }
      };
    } else if (startDate && endDate) {
      dateQuery = {
        scheduledDate: { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        }
      };
    }

    query = { ...query, ...dateQuery };

    const schedule = await ProductionSchedule.find(query)
      .populate('job', 'jobNumber customerName products')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: schedule.length,
      data: schedule
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single production schedule item
// @route   GET /api/production/:id
// @access  Private
exports.getProductionItem = async (req, res, next) => {
  try {
    const item = await ProductionSchedule.findById(req.params.id)
      .populate('job');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Production schedule item not found'
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

// @desc    Create production schedule
// @route   POST /api/production
// @access  Private
exports.createProductionSchedule = async (req, res, next) => {
  try {
    // Generate production ID
    const year = new Date().getFullYear();
    const count = await ProductionSchedule.countDocuments({ 
      productionId: { $regex: `^PROD-${year}-` } 
    });
    const productionId = `PROD-${year}-${String(count + 1).padStart(3, '0')}`;

    const schedule = await ProductionSchedule.create({
      ...req.body,
      productionId
    });

    // Update job with production schedule reference
    await Job.findByIdAndUpdate(req.body.job, {
      productionSchedule: schedule._id
    });

    await createAuditLog(
      'PRODUCTION_SCHEDULED',
      'PRODUCTION',
      schedule._id,
      productionId,
      req.user,
      'Production scheduled',
      { productionId, jobNumber: req.body.jobNumber }
    );

    res.status(201).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update production schedule
// @route   PUT /api/production/:id
// @access  Private
exports.updateProductionSchedule = async (req, res, next) => {
  try {
    const oldSchedule = await ProductionSchedule.findById(req.params.id);

    if (!oldSchedule) {
      return res.status(404).json({
        success: false,
        message: 'Production schedule not found'
      });
    }

    const schedule = await ProductionSchedule.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );

    // Check for stage changes
    if (req.body.productionStage && req.body.productionStage !== oldSchedule.productionStage) {
      await createAuditLog(
        'PRODUCTION_STARTED',
        'PRODUCTION',
        schedule._id,
        schedule.productionId,
        req.user,
        `Production stage changed to ${req.body.productionStage}`,
        { 
          previousStage: oldSchedule.productionStage, 
          newStage: req.body.productionStage 
        }
      );
    }

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    next(error);
  }
};

