const Customer = require('../models/Customer');
const { createAuditLog } = require('../middleware/auditLog');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    const { search, type, active = 'true' } = req.query;

    let query = {};

    if (active === 'true') {
      query.active = true;
    }

    if (type && type !== 'all') {
      query.customerType = type;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query).sort({ companyName: 1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);

    await createAuditLog(
      'JOB_CREATED',
      'CUSTOMER',
      customer._id,
      customer.companyName,
      req.user,
      'Customer created',
      { companyName: customer.companyName }
    );

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

