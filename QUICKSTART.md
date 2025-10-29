# Quick Start Guide

Get the Lindsay Precast Operations Control System running in 5 minutes!

## Prerequisites

Make sure you have:
- ✅ Node.js installed (v16+)
- ✅ MongoDB installed and running

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows
# MongoDB should start automatically as a service
```

### 3. Seed the Database
```bash
npm run seed
```

Expected output:
```
✓ Database seeded successfully!

Summary:
- Users: 5
- Employees: 4
- Customers: 6
- Jobs: 6
- Inventory items: 5
- Production schedules: 2
```

### 4. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# OR Production mode
npm start
```

Expected output:
```
Server running on port 5000
Environment: development
MongoDB Connected: localhost
Initializing automation system...
Change streams initialized
Scheduled jobs initialized
Automation system initialized successfully
```

### 5. Open the Application
```
http://localhost:5000
```

### 6. Login

Use any of these credentials:

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Project Manager Accounts:**
- `jsmith` / `password`
- `mjones` / `password`
- `rwilliams` / `password`
- `kdavis` / `password`

## Test the System

### Via Terminal Interface

Once logged in, try these commands in the terminal at the bottom:

```bash
# Show all available commands
help

# List all jobs
list_jobs

# Get status of a specific job
job_status JOB-2025-087

# Check inventory
inventory

# Create a new job (interactive wizard)
create_job

# Update a job's progress
update_progress JOB-2025-087 75

# Assign a project manager
assign_pm JOB-2025-091 SMITH_J

# Export daily report
export_daily

# Export specific job report
export_job JOB-2025-087
```

### Via API (using curl or Postman)

#### 1. Login and get token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Save the token from the response.

#### 2. Get all jobs:
```bash
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Get job statistics:
```bash
curl http://localhost:5000/api/jobs/stats/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Get inventory:
```bash
curl http://localhost:5000/api/inventory \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Explore the Interface

### Dashboard Overview
- **Active Jobs Table**: View and filter all jobs
- **System Metrics**: Real-time statistics
- **Project Managers**: Workload distribution
- **Alerts & Notifications**: Recent activity
- **Production Schedule**: Next 7/30/90 days
- **Workflow Distribution**: Jobs by stage
- **Inventory Status**: Material levels

### Interactive Features

1. **Filtering**: Click [FILTER] button to filter jobs by stage, status, or PM
2. **Sorting**: Click [SORT] button to sort jobs by different criteria
3. **Job Details**: Click any job number to open detailed panel
4. **Inline Editing**: Double-click table cells to edit
5. **Exports**: Use export buttons for PDF/CSV reports
6. **Terminal**: Type commands in the bottom terminal

## Test Automation

The system includes 10 automated workflows. Test them:

### 1. Test Quote Approval
```bash
# Update a job from QUOTE to ENGINEERING stage
# This triggers AUTOMATION 2: Quote Approved
```

Via terminal:
```bash
update_job JOB-2025-094 stage ENGINEERING
```

Via API:
```bash
curl -X PUT http://localhost:5000/api/jobs/JOB-2025-094-ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"stage":"ENGINEERING"}'
```

### 2. Test Low Inventory Alert
```bash
# Update inventory to below minimum
# This triggers AUTOMATION 9: Material Low Inventory
```

Via API:
```bash
curl -X PUT http://localhost:5000/api/inventory/REBAR_#6-ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentQuantity":400}'
```

### 3. Test Production Started
```bash
# Update production stage to IN_PROGRESS
# This triggers AUTOMATION 4: Production Started
```

Via API:
```bash
curl -X PUT http://localhost:5000/api/production/PROD-2025-108-ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productionStage":"IN_PROGRESS"}'
```

## Verify Automations

Check the automation logs in the server console. You should see messages like:

```
[AUTOMATION 2] Quote approved: JOB-2025-094
[AUTOMATION 9] Low inventory alert: REBAR_#6
[AUTOMATION 4] Production started: PROD-2025-108
```

## Common Tasks

### Create a New Job

1. In the terminal, type: `create_job`
2. Follow the interactive prompts:
   - Customer name
   - Job name/description
   - Product type
   - Quantity
   - Due date
   - Priority
3. Job number will be auto-generated

### Assign a Project Manager

```bash
assign_pm JOB-2025-XXX JONES_M
```

### Update Job Progress

```bash
update_progress JOB-2025-XXX 85
```

### Schedule Production

```bash
schedule_production JOB-2025-XXX
```

### Export Reports

```bash
# Daily operations report
export_daily

# Specific job report
export_job JOB-2025-087

# Production schedule
export_schedule

# CSV export of active jobs
export_csv
```

## View Database

### Using MongoDB Shell:
```bash
mongosh lindsay-precast
```

Then run:
```javascript
// Show collections
show collections

// Count documents
db.jobs.countDocuments()
db.users.countDocuments()

// Find all jobs
db.jobs.find().pretty()

// Find jobs by stage
db.jobs.find({stage: "PRODUCTION"}).pretty()

// Find low inventory items
db.inventories.find({status: "LOW"}).pretty()

// View audit log
db.auditlogs.find().sort({timestamp: -1}).limit(10).pretty()
```

## Troubleshooting

### Server won't start
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"

# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Can't login
```bash
# Reset the database
mongosh lindsay-precast --eval "db.dropDatabase()"
npm run seed
```

### API returns 401 Unauthorized
- Make sure you're logged in
- Check if token is valid
- Token expires after 30 days

## Next Steps

1. ✅ Read [INSTALLATION.md](./INSTALLATION.md) for detailed setup
2. ✅ Review [FEATURES.md](./FEATURES.md) for all features
3. ✅ Check [README.md](./README.md) for API documentation
4. ✅ Explore the codebase structure
5. ✅ Customize for your needs

## Need Help?

- Check server console for errors
- Review MongoDB logs
- Verify all environment variables
- Ensure MongoDB is running
- Check firewall settings

---

**You're all set!** 🚀

The Lindsay Precast Operations Control System is now running with MongoDB.

