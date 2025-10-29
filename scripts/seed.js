require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Employee = require('../models/Employee');
const Job = require('../models/Job');
const Inventory = require('../models/Inventory');
const ProductionSchedule = require('../models/ProductionSchedule');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Customer.deleteMany({});
    await Employee.deleteMany({});
    await Job.deleteMany({});
    await Inventory.deleteMany({});
    await ProductionSchedule.deleteMany({});

    console.log('Creating users...');
    const users = await User.create([
      {
        username: 'admin',
        password: 'admin123',
        name: 'Administrator',
        role: 'admin',
        email: 'admin@lindsayprecast.com'
      },
      {
        username: 'jsmith',
        password: 'password',
        name: 'John Smith',
        role: 'pm',
        email: 'jsmith@lindsayprecast.com'
      },
      {
        username: 'mjones',
        password: 'password',
        name: 'Mike Jones',
        role: 'pm',
        email: 'mjones@lindsayprecast.com'
      },
      {
        username: 'rwilliams',
        password: 'password',
        name: 'Robert Williams',
        role: 'pm',
        email: 'rwilliams@lindsayprecast.com'
      },
      {
        username: 'kdavis',
        password: 'password',
        name: 'Karen Davis',
        role: 'pm',
        email: 'kdavis@lindsayprecast.com'
      }
    ]);

    console.log('Creating employees...');
    const employees = await Employee.create([
      {
        employeeCode: 'SMITH_J',
        name: 'John Smith',
        email: 'jsmith@lindsayprecast.com',
        phone: '(555) 123-4567',
        role: 'PROJECT_MANAGER',
        department: 'MANAGEMENT',
        capacity: 10,
        currentLoad: 8,
        userId: users[1]._id
      },
      {
        employeeCode: 'JONES_M',
        name: 'Mike Jones',
        email: 'mjones@lindsayprecast.com',
        phone: '(555) 234-5678',
        role: 'PROJECT_MANAGER',
        department: 'MANAGEMENT',
        capacity: 10,
        currentLoad: 6,
        userId: users[2]._id
      },
      {
        employeeCode: 'WILLIAMS_R',
        name: 'Robert Williams',
        email: 'rwilliams@lindsayprecast.com',
        phone: '(555) 345-6789',
        role: 'PROJECT_MANAGER',
        department: 'MANAGEMENT',
        capacity: 8,
        currentLoad: 5,
        userId: users[3]._id
      },
      {
        employeeCode: 'DAVIS_K',
        name: 'Karen Davis',
        email: 'kdavis@lindsayprecast.com',
        phone: '(555) 456-7890',
        role: 'PROJECT_MANAGER',
        department: 'MANAGEMENT',
        capacity: 10,
        currentLoad: 5,
        userId: users[4]._id
      }
    ]);

    console.log('Creating customers...');
    const customers = await Customer.create([
      {
        companyName: 'ABC CONSTRUCTION',
        contactPerson: 'John Smith',
        phone: '(555) 123-4567',
        email: 'jsmith@abcconstruction.com',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'CO',
          zip: '80829'
        },
        customerType: 'contractor',
        totalJobs: 3,
        totalRevenue: 487000
      },
      {
        companyName: 'CITY OF SPRINGFIELD',
        contactPerson: 'Mary Johnson',
        phone: '(555) 234-5678',
        email: 'mjohnson@springfield.gov',
        address: {
          street: '100 City Hall Plaza',
          city: 'Springfield',
          state: 'CO',
          zip: '80829'
        },
        customerType: 'municipality',
        totalJobs: 5,
        totalRevenue: 785000
      },
      {
        companyName: 'METRO DEVELOPERS',
        contactPerson: 'Sarah Williams',
        phone: '(555) 345-6789',
        email: 'swilliams@metrodev.com',
        address: {
          street: '456 Commerce Way',
          city: 'Colorado Springs',
          state: 'CO',
          zip: '80901'
        },
        customerType: 'developer',
        totalJobs: 2,
        totalRevenue: 235000
      },
      {
        companyName: 'JOHNSON CONTRACTORS',
        contactPerson: 'Bob Johnson',
        phone: '(555) 456-7890',
        email: 'bjohnson@johnsoncontractors.com',
        customerType: 'contractor',
        totalJobs: 4,
        totalRevenue: 412000
      },
      {
        companyName: 'RIVERSIDE UTILITIES',
        contactPerson: 'Lisa Brown',
        phone: '(555) 567-8901',
        email: 'lbrown@riversideutilities.com',
        customerType: 'utility',
        totalJobs: 1,
        totalRevenue: 125000
      },
      {
        companyName: 'HIGHLAND CONSTRUCTION',
        contactPerson: 'Mike Davis',
        phone: '(555) 678-9012',
        email: 'mdavis@highlandconstruction.com',
        customerType: 'contractor',
        totalJobs: 2,
        totalRevenue: 198000
      }
    ]);

    console.log('Creating jobs...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const jobs = await Job.create([
      {
        jobNumber: 'JOB-2025-087',
        customer: customers[0]._id,
        customerName: customers[0].companyName,
        jobName: 'Riverside Development Phase 2',
        location: {
          address: '123 Main St',
          city: 'Springfield',
          state: 'CO',
          zip: '80829'
        },
        stage: 'PRODUCTION',
        status: 'DELAYED',
        priority: 'STANDARD',
        projectManager: employees[0]._id,
        pmCode: 'SMITH_J',
        pmName: 'John Smith',
        products: [
          {
            type: 'STORM',
            quantity: 12,
            size: '48" DIA',
            status: 'IN_PRODUCTION'
          }
        ],
        productsDescription: '12x STORM STRUCTURES',
        quoteAmount: 48500,
        actualCost: 42200,
        timeline: {
          quoteSubmitted: new Date('2025-10-15'),
          quoteApproved: new Date('2025-10-17'),
          engineeringStart: new Date('2025-10-17'),
          engineeringComplete: new Date('2025-10-20'),
          productionStart: new Date('2025-10-23'),
          dueDate: new Date('2025-10-30')
        },
        progress: 65
      },
      {
        jobNumber: 'JOB-2025-091',
        customer: customers[1]._id,
        customerName: customers[1].companyName,
        jobName: 'Municipal Storm Drain Replacement',
        location: {
          address: 'Various locations',
          city: 'Springfield',
          state: 'CO'
        },
        stage: 'ENGINEERING',
        status: 'ON_TRACK',
        priority: 'STANDARD',
        projectManager: employees[1]._id,
        pmCode: 'JONES_M',
        pmName: 'Mike Jones',
        products: [
          {
            type: 'STORM',
            quantity: 20,
            size: '36" DIA',
            status: 'ENGINEERING'
          }
        ],
        productsDescription: '20x STORM STRUCTURES',
        quoteAmount: 78000,
        actualCost: 0,
        timeline: {
          quoteSubmitted: new Date('2025-10-20'),
          quoteApproved: new Date('2025-10-22'),
          engineeringStart: new Date('2025-10-25'),
          dueDate: new Date('2025-11-05')
        },
        progress: 40
      },
      {
        jobNumber: 'JOB-2025-093',
        customer: customers[2]._id,
        customerName: customers[2].companyName,
        jobName: 'Metro Plaza Infrastructure',
        location: {
          address: '456 Commerce Way',
          city: 'Colorado Springs',
          state: 'CO'
        },
        stage: 'PRODUCTION',
        status: 'ON_TRACK',
        priority: 'STANDARD',
        projectManager: employees[2]._id,
        pmCode: 'WILLIAMS_R',
        pmName: 'Robert Williams',
        products: [
          {
            type: 'SANITARY',
            quantity: 8,
            size: '48" DIA',
            status: 'CURING'
          }
        ],
        productsDescription: '8x SANITARY STRUCTURES',
        quoteAmount: 35200,
        actualCost: 28900,
        timeline: {
          quoteSubmitted: new Date('2025-10-10'),
          quoteApproved: new Date('2025-10-12'),
          engineeringComplete: new Date('2025-10-15'),
          productionStart: new Date('2025-10-27'),
          dueDate: new Date('2025-11-02')
        },
        progress: 78
      },
      {
        jobNumber: 'JOB-2025-089',
        customer: customers[3]._id,
        customerName: customers[3].companyName,
        jobName: 'Industrial Park Infrastructure',
        stage: 'DELIVERY',
        status: 'AT_RISK',
        priority: 'STANDARD',
        projectManager: employees[0]._id,
        pmCode: 'SMITH_J',
        pmName: 'John Smith',
        products: [
          {
            type: 'INLET',
            quantity: 6,
            size: 'STANDARD',
            status: 'READY'
          }
        ],
        productsDescription: '6x INLET',
        quoteAmount: 22400,
        actualCost: 18900,
        timeline: {
          quoteSubmitted: new Date('2025-10-05'),
          quoteApproved: new Date('2025-10-07'),
          engineeringComplete: new Date('2025-10-10'),
          productionComplete: new Date('2025-10-25'),
          dueDate: new Date('2025-10-29')
        },
        progress: 92
      },
      {
        jobNumber: 'JOB-2025-094',
        customer: customers[4]._id,
        customerName: customers[4].companyName,
        jobName: 'Water Treatment Facility Upgrade',
        stage: 'QUOTE',
        status: 'ON_TRACK',
        priority: 'STANDARD',
        projectManager: employees[3]._id,
        pmCode: 'DAVIS_K',
        pmName: 'Karen Davis',
        products: [
          {
            type: 'VAULT',
            quantity: 6,
            size: 'CUSTOM',
            status: 'PENDING'
          }
        ],
        productsDescription: '6x VAULT CUSTOM',
        quoteAmount: 125000,
        actualCost: 0,
        timeline: {
          quoteSubmitted: new Date('2025-10-25'),
          dueDate: new Date('2025-11-15')
        },
        progress: 15
      },
      {
        jobNumber: 'JOB-2025-086',
        customer: customers[5]._id,
        customerName: customers[5].companyName,
        jobName: 'Residential Development',
        stage: 'PRODUCTION',
        status: 'ON_TRACK',
        priority: 'STANDARD',
        projectManager: employees[1]._id,
        pmCode: 'JONES_M',
        pmName: 'Mike Jones',
        products: [
          {
            type: 'INLET',
            quantity: 15,
            size: 'STANDARD',
            status: 'IN_PRODUCTION'
          }
        ],
        productsDescription: '15x INLET',
        quoteAmount: 38500,
        actualCost: 31200,
        timeline: {
          quoteSubmitted: new Date('2025-10-12'),
          quoteApproved: new Date('2025-10-14'),
          engineeringComplete: new Date('2025-10-18'),
          productionStart: new Date('2025-10-24'),
          dueDate: new Date('2025-11-01')
        },
        progress: 55
      }
    ]);

    console.log('Creating inventory...');
    await Inventory.create([
      {
        materialType: 'REBAR_#4',
        description: 'Rebar #4 - Standard reinforcement',
        currentQuantity: 2850,
        unit: 'LB',
        minimumQuantity: 2000,
        reorderPoint: 2500,
        supplier: 'Steel Supply Co',
        costPerUnit: 0.85,
        location: 'Warehouse A'
      },
      {
        materialType: 'REBAR_#6',
        description: 'Rebar #6 - Heavy reinforcement',
        currentQuantity: 450,
        unit: 'LB',
        minimumQuantity: 1500,
        reorderPoint: 2000,
        supplier: 'Steel Supply Co',
        costPerUnit: 1.25,
        location: 'Warehouse A'
      },
      {
        materialType: 'CONCRETE_MIX',
        description: 'Concrete Mix - Standard grade',
        currentQuantity: 87,
        unit: 'YD³',
        minimumQuantity: 50,
        reorderPoint: 75,
        supplier: 'Concrete Suppliers Inc',
        costPerUnit: 125.00,
        location: 'Yard'
      },
      {
        materialType: 'EMBEDMENTS',
        description: 'Standard embedments and fixtures',
        currentQuantity: 234,
        unit: 'UNITS',
        minimumQuantity: 100,
        reorderPoint: 150,
        supplier: 'Metal Works LLC',
        costPerUnit: 45.00,
        location: 'Warehouse B'
      },
      {
        materialType: 'FRAME_GRATE',
        description: 'Frame and grate assemblies',
        currentQuantity: 45,
        unit: 'UNITS',
        minimumQuantity: 30,
        reorderPoint: 40,
        supplier: 'Metal Works LLC',
        costPerUnit: 185.00,
        location: 'Warehouse B'
      }
    ]);

    console.log('Creating production schedules...');
    await ProductionSchedule.create([
      {
        productionId: 'PROD-2025-108',
        job: jobs[0]._id,
        jobNumber: jobs[0].jobNumber,
        productionStage: 'IN_PROGRESS',
        scheduledDate: new Date('2025-10-28'),
        pourDate: new Date('2025-10-27'),
        cureCompleteDate: new Date('2025-11-03'),
        expectedCompletionDate: new Date('2025-11-05'),
        forms: [
          { formId: 'ST-3', formName: 'Storm Form 3', assigned: true },
          { formId: 'ST-4', formName: 'Storm Form 4', assigned: true },
          { formId: 'ST-5', formName: 'Storm Form 5', assigned: true }
        ],
        crew: {
          teamId: 'A-TEAM',
          teamName: 'A Team',
          supervisor: 'Johnson, T',
          workers: ['Smith, R', 'Davis, M', 'Brown, K']
        },
        materials: [
          {
            materialType: 'REBAR_#6',
            quantityRequired: 850,
            quantityAvailable: 450,
            unit: 'LB',
            status: 'SHORTAGE'
          }
        ],
        notes: 'Material delay (REBAR #6) causing production delay'
      },
      {
        productionId: 'PROD-2025-109',
        job: jobs[2]._id,
        jobNumber: jobs[2].jobNumber,
        productionStage: 'CURING',
        scheduledDate: new Date('2025-10-29'),
        pourDate: new Date('2025-10-27'),
        cureCompleteDate: new Date('2025-11-03'),
        expectedCompletionDate: new Date('2025-11-04'),
        forms: [
          { formId: 'S-1', formName: 'Sanitary Form 1', assigned: true },
          { formId: 'S-2', formName: 'Sanitary Form 2', assigned: true }
        ],
        crew: {
          teamId: 'B-TEAM',
          teamName: 'B Team',
          supervisor: 'Williams, A',
          workers: ['Jones, L', 'Miller, P']
        },
        notes: 'On schedule, pour completed 10/27'
      }
    ]);

    console.log('✓ Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Employees: ${employees.length}`);
    console.log(`- Customers: ${customers.length}`);
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Inventory items: 5`);
    console.log(`- Production schedules: 2`);
    console.log('\nDefault login credentials:');
    console.log('- admin / admin123');
    console.log('- jsmith / password');
    console.log('- mjones / password');
    console.log('- rwilliams / password');
    console.log('- kdavis / password');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Run seeding
connectDB()
  .then(seedData)
  .then(() => {
    console.log('\n✓ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

