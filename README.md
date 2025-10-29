# Lindsay Precast - Operations Control System

A comprehensive operations management system for Lindsay Precast, a manufacturer of precast concrete products (sanitary structures, storm structures, vaults, inlets, custom structures).

## Features

- **Job Management**: Complete lifecycle tracking from quote to delivery
- **Production Scheduling**: Visual production schedule with resource allocation
- **Inventory Management**: Real-time material tracking and alerts
- **Project Manager Dashboard**: Workload distribution and capacity planning
- **Customer Portal**: Self-service access for customers
- **Automated Workflows**: Trigger-based automation for common tasks
- **Reporting**: PDF/CSV exports and daily operational reports
- **Real-time Notifications**: Alert system for critical events

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Authentication**: JWT-based authentication
- **PDF Generation**: jsPDF

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd operation-control-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string and other settings
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Seed the database with initial data:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

7. Access the application:
```
http://localhost:5000
```

## Default Login Credentials

- **Admin**: `admin` / `admin123`
- **PM (John Smith)**: `jsmith` / `password`
- **PM (Mike Jones)**: `mjones` / `password`
- **PM (Robert Williams)**: `rwilliams` / `password`
- **PM (Karen Davis)**: `kdavis` / `password`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Production Schedule
- `GET /api/production` - Get production schedule
- `POST /api/production` - Create production schedule item
- `PUT /api/production/:id` - Update production schedule

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `PUT /api/employees/:id` - Update employee

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer

### Inventory
- `GET /api/inventory` - Get inventory status
- `PUT /api/inventory/:id` - Update inventory item

### Audit Log
- `GET /api/audit` - Get audit log entries

## MongoDB Automations

The system includes 10 automated workflows triggered by database changes:

1. New Job Created
2. Quote Approved
3. Engineering Complete
4. Production Started
5. Quality Check Failed
6. Products Ship-Ready
7. Delivery Complete
8. Overdue Milestone Alert
9. Material Low Inventory
10. Customer Portal Login

These are implemented using MongoDB Change Streams and scheduled jobs.

## Project Structure

```
operation-control-system/
├── models/              # Mongoose schemas
├── routes/              # Express routes
├── controllers/         # Route controllers
├── middleware/          # Custom middleware
├── automation/          # Automation triggers
├── scripts/             # Utility scripts (seed, etc.)
├── public/              # Frontend static files
├── server.js            # Main server file
└── README.md
```

## License

MIT

