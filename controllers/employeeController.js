const Employee = require('../models/Employee');

const { createAuditLog } = require('../middleware/auditLog');

// @desc    Create employee
// @route   POST /api/employees
// @access  Private
exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);

    await createAuditLog(
      'EMPLOYEE_CREATED',
      'EMPLOYEE',
      employee._id,
      employee.name,
      req.user,
      'Employee created',
      { name: employee.name, employeeCode: employee.employeeCode, role: employee.role }
    );

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    const { role, department, active = 'true' } = req.query;

    let query = {};

    if (active === 'true') {
      query.active = true;
    }

    if (role) {
      query.role = role;
    }

    if (department) {
      query.department = department;
    }

    const employees = await Employee.find(query)
      .populate('activeJobs', 'jobNumber customerName')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('activeJobs');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get PM workload
// @route   GET /api/employees/stats/workload
// @access  Private
exports.getPMWorkload = async (req, res, next) => {
  try {
    const pms = await Employee.find({ 
      role: 'PROJECT_MANAGER',
      active: true 
    }).populate('activeJobs', 'jobNumber stage status');

    const workload = pms.map(pm => ({
      _id: pm._id,
      name: pm.name,
      employeeCode: pm.employeeCode,
      activeJobs: pm.activeJobs.length,
      capacity: pm.capacity,
      currentLoad: pm.currentLoad,
      loadPercentage: pm.loadPercentage
    }));

    res.status(200).json({
      success: true,
      data: workload
    });
  } catch (error) {
    next(error);
  }
};

