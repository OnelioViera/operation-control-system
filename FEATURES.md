# Lindsay Precast Operations Control System - Features

## Overview

A comprehensive operations management system built with Node.js, Express, MongoDB, and vanilla JavaScript. Designed for manufacturing workflow management with real-time automation.

## Core Features

### 1. **Authentication & Authorization**
- JWT-based authentication system
- Role-based access control (Admin, PM, Production, Customer)
- Secure password hashing with bcrypt
- Session management
- Login/logout functionality

**Roles:**
- **Admin**: Full system access, can manage all entities
- **PM (Project Manager)**: Manage jobs, update statuses, view reports
- **Production**: Manage production schedules, inventory
- **Customer**: View their own jobs and documents (portal access)

### 2. **Job Management**

#### Job Lifecycle Tracking
- **Stages**: Quote → Engineering → Production → Delivery → Complete
- **Status Tracking**: ON_TRACK, AT_RISK, DELAYED, COMPLETE, CANCELLED
- **Priority Levels**: LOW, STANDARD, HIGH, URGENT
- Real-time progress tracking (0-100%)
- Automated stage transitions
- Due date tracking with offset calculations

#### Job Features
- Unique job number generation (JOB-YYYY-###)
- Customer association
- Project manager assignment
- Product specifications (type, quantity, size)
- Timeline tracking (quote, engineering, production, delivery dates)
- Financial tracking (quote amount vs. actual cost)
- Document management (quotes, shop drawings, invoices, etc.)
- Custom notes and comments

### 3. **Production Scheduling**

#### Production Management
- Visual production schedule (daily, weekly, monthly views)
- Production ID generation (PROD-YYYY-###)
- Form and crew assignment
- Material requirements tracking
- Pour date and cure time calculations
- Quality check recording
- Production stage tracking:
  - SCHEDULED
  - IN_PROGRESS
  - CURING
  - QC (Quality Check)
  - FINISHED
  - DELAYED
  - CANCELLED

#### Resource Allocation
- Form availability tracking
- Crew assignment and scheduling
- Equipment allocation
- Temperature-based cure time adjustments

### 4. **Inventory Management**

#### Material Tracking
- Real-time quantity monitoring
- Multiple unit types (LB, YD³, UNITS, FT, GAL)
- Minimum quantity thresholds
- Reorder point alerts
- Status indicators:
  - OK
  - LOW
  - CRITICAL
  - OUT_OF_STOCK

#### Inventory Features
- Automatic status updates based on quantity
- Supplier information
- Cost per unit tracking
- Expected delivery dates
- Storage location tracking
- Low inventory alerts

### 5. **Customer Management**

#### Customer Records
- Company information
- Contact details
- Multiple customer types (contractor, municipality, developer, utility)
- Address management
- Total jobs and revenue tracking
- Customer portal access management

#### Customer Portal (Future Enhancement)
- Job status viewing
- Document access
- Timeline updates
- Contact project manager
- Satisfaction surveys

### 6. **Employee Management**

#### Employee Features
- Employee code system (e.g., SMITH_J)
- Role and department assignment
- Capacity planning (max concurrent jobs)
- Current workload tracking
- Load percentage calculations
- Active job assignments
- Contact information

#### Project Manager Dashboard
- Workload distribution
- Active job count
- Capacity visualization
- Job assignments

### 7. **Workflow Tracking**

#### Stage-Based Workflow
- Individual stage tracking for each job
- Milestone management
- Estimated vs. actual completion dates
- Blocked status with reason tracking
- Assignee management
- Progress notes

### 8. **Automated Workflows** ⚡

#### 10 Built-in Automations

**AUTOMATION 1: New Job Created**
- Creates workflow tracking for all stages
- Assigns to appropriate employee
- Sends notification to PM
- Logs in audit trail

**AUTOMATION 2: Quote Approved**
- Updates stage to Engineering
- Records approval date
- Updates workflow tracking
- Sends customer notification

**AUTOMATION 3: Engineering Complete**
- Moves to Production stage
- Checks material inventory
- Notifies production team
- Updates customer portal

**AUTOMATION 4: Production Started**
- Updates workflow tracking
- Calculates cure completion date (pour + 7 days)
- Schedules daily PM updates
- Updates customer portal

**AUTOMATION 5: Quality Check Failed**
- Creates high-priority notification
- Updates workflow to BLOCKED
- Triggers production assessment
- Adjusts production schedule
- Does NOT notify customer automatically

**AUTOMATION 6: Products Ship-Ready**
- Updates stage to Delivery
- Triggers delivery coordination
- Notifies customer
- Updates portal

**AUTOMATION 7: Delivery Complete**
- Moves to Complete stage
- Triggers closeout process
- Generates invoice
- Sends satisfaction survey

**AUTOMATION 8: Overdue Milestone Alert**
- Daily check at 6 AM (configurable)
- High-priority notifications for PMs
- Flags jobs in dashboard
- Triggers status assessment

**AUTOMATION 9: Material Low Inventory**
- Alerts purchasing department
- Updates production schedule
- Triggers reorder process
- Logs inventory status

**AUTOMATION 10: Customer Portal Login** (Future)
- Logs access in audit trail
- Checks for updates
- Notifies PM of customer activity

### 9. **Reporting & Analytics**

#### Dashboard Metrics
- Active jobs count
- Quotes pending
- In production count
- Ready to ship count
- Revenue MTD (Month-to-Date)
- Revenue vs. target

#### Job Statistics
- Total jobs by stage
- Jobs by status
- Total quote amounts
- Actual costs
- Average progress
- Profit margins

#### Production Analytics
- Workflow distribution
- Average cycle time
- Production queue (next 30 days)
- Capacity utilization

#### Custom Reports
- Daily operations report
- Job-specific reports
- Production schedule reports
- Inventory status reports

### 10. **Export & Printing**

#### PDF Generation
- Daily operations reports
- Individual job reports
- Production schedules
- Custom date range reports
- Professional formatting with jsPDF

#### CSV Exports
- Active jobs list
- Filtered job data
- Inventory status
- Production schedule
- Employee workload

#### Print Functionality
- Print-friendly view
- Filter preservation in prints
- Sort order maintenance
- Clean formatting for paper

### 11. **Audit Logging**

#### Comprehensive Audit Trail
- All user actions logged
- Entity changes tracked
- Previous and new values recorded
- Timestamp and user information
- IP address and user agent tracking

#### Event Types
- Job created/updated/deleted
- Status and stage changes
- PM assignments
- Production events
- Quality checks
- Inventory updates
- User login/logout
- Automation triggers

### 12. **Notification System**

#### Notification Types
- INFO: General information
- WARNING: Attention needed
- ALERT: Urgent attention
- SUCCESS: Positive confirmation
- ERROR: Problem notification

#### Priority Levels
- LOW: Can be addressed later
- NORMAL: Standard priority
- HIGH: Needs prompt attention
- URGENT: Immediate action required

#### Notification Features
- Read/unread status
- Action required flags
- Related entity links
- Expiration dates
- Recipient management

### 13. **Advanced Filtering & Sorting**

#### Job Filtering
- By stage (Quote, Engineering, Production, Delivery)
- By status (On Track, At Risk, Delayed)
- By project manager
- By customer
- By date range
- Text search (job number, customer, job name)

#### Sorting Options
- Job number (ascending/descending)
- Customer name (A-Z, Z-A)
- Due date (earliest/latest)
- Progress (low-high, high-low)
- Status priority

#### Real-time Updates
- Filters apply immediately
- Sort updates table dynamically
- Preserved in exports and prints

### 14. **Inline Editing**

#### Quick Edits
- Double-click to edit cells
- Dropdown selectors for stages and PMs
- Text input for other fields
- Save/cancel controls
- Immediate database updates

#### Bulk Edit Mode
- Side panel edit mode
- Multiple field updates
- Validation before saving
- Change tracking
- Undo capability

### 15. **Terminal Interface** 💻

#### Command-Line Features
- Interactive terminal interface
- Command history (up/down arrows)
- Tab completion (future)
- Color-coded output
- Real-time feedback

#### Available Commands
- `create_job`: Job creation wizard
- `job_status [JOB#]`: View job details
- `list_jobs`: List all jobs
- `update_job`: Update job fields
- `assign_pm`: Assign project manager
- `schedule_production`: Schedule production
- `search_customer`: Customer lookup
- `inventory`: Check inventory status
- `export_*`: Various export options
- `help`: Show all commands

### 16. **Responsive Design**

#### UI Features
- Retro/terminal aesthetic
- Dark mode optimized
- Resizable panels
- Resizable terminal
- Drag-to-resize columns
- Collapsible sections
- Print-optimized layouts

### 17. **Data Validation**

#### Input Validation
- Required field checking
- Format validation (dates, phone numbers)
- Range validation (quantities, percentages)
- Unique constraint enforcement
- Cross-field validation

### 18. **MongoDB Change Streams**

#### Real-time Monitoring
- Watches collections for changes
- Triggers automations instantly
- Handles insert, update, delete operations
- Scales with database load
- Minimal performance overhead

## Technical Features

### Backend Architecture
- RESTful API design
- Mongoose ODM for MongoDB
- JWT authentication
- Role-based middleware
- Error handling middleware
- Audit logging middleware
- CORS support

### Database Design
- Normalized schema design
- Indexed queries for performance
- Denormalized fields where needed
- Embedded documents for related data
- Virtual fields for calculated values
- Pre/post hooks for business logic

### Frontend Architecture
- Vanilla JavaScript (no frameworks)
- Modular design
- API abstraction layer
- Event-driven updates
- Local storage for session
- Service worker ready

### Security Features
- Password hashing (bcrypt)
- JWT token authentication
- Authorization middleware
- Input sanitization
- SQL injection prevention (NoSQL)
- XSS protection
- CORS configuration
- Rate limiting ready

### Performance Optimizations
- Database indexing
- Query pagination
- Lazy loading
- Caching strategies
- Compressed responses
- Change streams for real-time

## Future Enhancements

### Planned Features
1. **Email Integration**: Automated email notifications
2. **SMS Alerts**: Critical alerts via SMS
3. **Mobile App**: React Native mobile application
4. **Advanced Analytics**: Charts and graphs
5. **Custom Reports**: Report builder interface
6. **File Upload**: Document management system
7. **Calendar Integration**: Google/Outlook calendar sync
8. **Time Tracking**: Employee time logging
9. **GPS Tracking**: Delivery vehicle tracking
10. **Customer Portal**: Full self-service portal
11. **API Documentation**: Swagger/OpenAPI docs
12. **Webhooks**: External system integration
13. **Multi-language**: Internationalization
14. **Dark/Light Theme**: Theme switcher
15. **Advanced Search**: Elasticsearch integration

---

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PDF Generation**: jsPDF
- **Security**: bcrypt, helmet (recommended)
- **Process Management**: PM2 (production)

## System Requirements

- Node.js v16+
- MongoDB v5.0+
- 2GB RAM minimum
- 10GB disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)

