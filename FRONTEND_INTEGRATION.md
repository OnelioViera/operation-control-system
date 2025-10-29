# Frontend Integration Guide

This guide explains how to integrate your existing HTML frontend with the MongoDB-backed API.

## Overview

The system now uses MongoDB for data storage instead of hardcoded JavaScript objects. The frontend needs to be updated to fetch data from the API endpoints.

## Files Created

### 1. `/public/config.js`
- Contains API configuration
- Defines all API endpoints
- Includes helper functions for API requests
- Handles JWT token management

### 2. `/public/api-integration.js`
- Provides high-level API functions
- Replaces hardcoded data with API calls
- Includes data transformation functions
- Handles authentication flow

## Updating Your HTML File

To integrate your existing HTML file with the MongoDB backend:

### Step 1: Place Your HTML File

Copy your HTML file to:
```
/public/index.html
```

### Step 2: Add Script References

In your HTML file, add these scripts BEFORE your existing JavaScript code:

```html
<!-- Add these in the <head> section or before your main script -->
<script src="/config.js"></script>
<script src="/api-integration.js"></script>
```

### Step 3: Replace Hardcoded Data

#### A. Replace the hardcoded users object:

**Old code:**
```javascript
const users = {
    'admin': { password: 'admin123', name: 'Administrator', role: 'admin', email: 'admin@lindsayprecast.com' },
    'jsmith': { password: 'password', name: 'John Smith', role: 'pm', email: 'jsmith@lindsayprecast.com' },
    // ... more users
};

function login(username, password) {
    const user = users[username.toLowerCase()];
    
    if (!user) {
        return { success: false, error: 'Invalid username or password' };
    }
    
    if (user.password !== password) {
        return { success: false, error: 'Invalid username or password' };
    }
    
    // ... rest of login logic
}
```

**New code:**
```javascript
// Remove the hardcoded users object entirely

// Update login function to use API
async function login(username, password) {
    return await apiLogin(username, password);
}
```

#### B. Replace the hardcoded jobData object:

**Old code:**
```javascript
const jobData = {
    'JOB-2025-087': {
        jobNumber: 'JOB-2025-087',
        customer: 'ABC CONSTRUCTION',
        // ... all job properties
    },
    'JOB-2025-091': {
        // ... more jobs
    }
};
```

**New code:**
```javascript
// Remove the hardcoded jobData object entirely

// Create a variable to cache loaded jobs
let loadedJobs = {};

// Function to load jobs from API
async function loadJobs() {
    try {
        const jobs = await apiGetJobs();
        
        // Transform and cache jobs
        loadedJobs = {};
        jobs.forEach(job => {
            const transformed = transformJobData(job);
            loadedJobs[job.jobNumber] = transformed;
        });
        
        return jobs;
    } catch (error) {
        console.error('Failed to load jobs:', error);
        return [];
    }
}

// Update functions that use jobData
async function openJobDetailPanel(jobNumber) {
    // Check cache first
    let job = loadedJobs[jobNumber];
    
    // If not in cache, fetch from API
    if (!job) {
        const jobs = await apiGetJobs({ search: jobNumber });
        if (jobs && jobs.length > 0) {
            job = transformJobData(jobs[0]);
            loadedJobs[jobNumber] = job;
        }
    }
    
    if (!job) {
        printToTerminal(`ERROR: Job ${jobNumber} not found`, '#b85757');
        return;
    }
    
    // ... rest of the function
}
```

#### C. Update Job Update Functions:

**Old code:**
```javascript
function updateTableRowFromJobData(jobNumber) {
    const row = document.querySelector(`tr[data-job="${jobNumber}"]`);
    if (!row || !jobData[jobNumber]) return;
    
    const job = jobData[jobNumber];
    // ... update row
}
```

**New code:**
```javascript
async function updateTableRowFromJobData(jobNumber) {
    const row = document.querySelector(`tr[data-job="${jobNumber}"]`);
    if (!row) return;
    
    // Fetch latest data from API
    const jobs = await apiGetJobs({ search: jobNumber });
    if (!jobs || jobs.length === 0) return;
    
    const job = transformJobData(jobs[0]);
    loadedJobs[jobNumber] = job; // Update cache
    
    // Update row cells
    const cells = row.querySelectorAll('td');
    cells[2].textContent = job.customer;
    cells[3].textContent = job.stage;
    cells[4].textContent = job.pm;
    cells[6].textContent = job.progress;
    
    // Update status indicator
    const indicator = cells[0].querySelector('.status-indicator');
    indicator.className = 'status-indicator';
    if (job.status === 'DELAYED') indicator.classList.add('status-red');
    else if (job.status === 'AT_RISK') indicator.classList.add('status-yellow');
    else indicator.classList.add('status-green');
}
```

#### D. Update the Login Handler:

**Old code:**
```javascript
document.getElementById('login-button').addEventListener('click', function() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    if (!username || !password) {
        errorDiv.textContent = 'Please enter username and password';
        return;
    }
    
    const result = login(username, password);
    
    if (result.success) {
        errorDiv.textContent = '';
        showDashboard();
    } else {
        errorDiv.textContent = result.error;
        document.getElementById('login-password').value = '';
    }
});
```

**New code:**
```javascript
document.getElementById('login-button').addEventListener('click', async function() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    if (!username || !password) {
        errorDiv.textContent = 'Please enter username and password';
        return;
    }
    
    // Show loading state
    this.disabled = true;
    this.textContent = 'LOGGING IN...';
    
    try {
        const result = await apiLogin(username, password);
        
        if (result.success) {
            errorDiv.textContent = '';
            currentUser = result.user;
            
            // Load initial data
            await loadJobs();
            await loadDashboardData();
            
            showDashboard();
        } else {
            errorDiv.textContent = result.error;
            document.getElementById('login-password').value = '';
        }
    } catch (error) {
        errorDiv.textContent = 'Login failed: ' + error.message;
    } finally {
        this.disabled = false;
        this.textContent = 'LOGIN';
    }
});
```

#### E. Add Dashboard Data Loading Function:

```javascript
// Add this function to load all dashboard data
async function loadDashboardData() {
    try {
        // Load jobs
        const jobs = await apiGetJobs();
        
        // Update job table
        updateJobTable(jobs);
        
        // Load PM workload
        const pmWorkload = await apiGetPMWorkload();
        updatePMTable(pmWorkload);
        
        // Load inventory
        const inventory = await apiGetInventory();
        updateInventoryTable(inventory);
        
        // Load production schedule
        const production = await apiGetProductionSchedule({ range: currentScheduleRange });
        updateProductionSchedule(production);
        
        // Load job stats
        const stats = await apiGetJobStats();
        updateMetrics(stats);
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        printToTerminal('ERROR: Failed to load dashboard data', '#b85757');
    }
}

function updateJobTable(jobs) {
    const tbody = document.getElementById('active-jobs-tbody');
    tbody.innerHTML = '';
    
    jobs.forEach(job => {
        const transformed = transformJobData(job);
        loadedJobs[job.jobNumber] = transformed;
        
        const row = createJobRow(transformed);
        tbody.appendChild(row);
    });
    
    document.getElementById('active-jobs-count').textContent = jobs.length;
}

function createJobRow(job) {
    const row = document.createElement('tr');
    row.setAttribute('data-job', job.jobNumber);
    
    // Determine status indicator color
    let statusClass = 'status-green';
    if (job.status === 'DELAYED') statusClass = 'status-red';
    else if (job.status === 'AT_RISK') statusClass = 'status-yellow';
    
    row.innerHTML = `
        <td><span class="status-indicator ${statusClass}"></span></td>
        <td><a href="#" class="job-link">${job.jobNumber}</a></td>
        <td class="editable-cell" data-field="customer">${job.customer}</td>
        <td class="editable-cell" data-field="stage">${job.stage}</td>
        <td class="editable-cell" data-field="pm">${job.pm}</td>
        <td class="editable-cell" data-field="due">${job.dueDate} <span style="color: ${job.daysOffset < 0 ? '#b85757' : '#6b9b6b'};">[${job.daysOffset > 0 ? '+' : ''}${job.daysOffset}D]</span></td>
        <td class="editable-cell" data-field="progress">${job.progress}</td>
    `;
    
    return row;
}
```

#### F. Update Save Functions to Use API:

```javascript
async function saveInlineEdit(jobNumber, field) {
    if (!currentlyEditingCell) return;
    
    const input = document.getElementById('inline-edit-input');
    const newValue = input.value.trim();
    
    try {
        // Get job ID
        const job = loadedJobs[jobNumber];
        if (!job || !job._id) {
            throw new Error('Job not found');
        }
        
        // Prepare update data
        const updateData = {};
        updateData[field] = newValue;
        
        // Send to API
        const updated = await apiUpdateJob(job._id, updateData);
        
        if (updated) {
            // Update local cache
            loadedJobs[jobNumber][field] = newValue;
            
            // Update cell display
            currentlyEditingCell.innerHTML = newValue;
            currentlyEditingCell.classList.remove('editing');
            
            // Log to terminal
            printToTerminal(`UPDATED: ${jobNumber} ${field.toUpperCase()} → ${newValue}`, '#6b9b6b');
            
            // Refresh job data
            await updateTableRowFromJobData(jobNumber);
        }
    } catch (error) {
        printToTerminal(`ERROR: Failed to update ${jobNumber}: ${error.message}`, '#b85757');
    }
    
    currentlyEditingCell = null;
}
```

### Step 4: Update Terminal Commands

Modify terminal commands to use API:

```javascript
async function executeCommand(cmd) {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    printToTerminal(`<span class="command-prompt">admin@lindsay-precast:~$</span> ${cmd}`);

    switch(command) {
        case 'list_jobs':
            const filter = args[0] ? args[0].toUpperCase() : 'ALL';
            printToTerminal(`LISTING JOBS: ${filter}`, '#6b9b6b');
            printToTerminal('─────────────────────────────────────────');
            
            try {
                const jobs = await apiGetJobs({ 
                    status: filter !== 'ALL' ? filter : undefined 
                });
                
                jobs.forEach(job => {
                    printToTerminal(`${job.jobNumber} | ${job.customerName} | ${job.stage} | ${job.status}`);
                });
                
                printToTerminal('─────────────────────────────────────────');
                printToTerminal(`TOTAL: ${jobs.length} jobs displayed`);
            } catch (error) {
                printToTerminal(`ERROR: ${error.message}`, '#b85757');
            }
            break;
        
        // Update other commands similarly...
    }
}
```

## Complete Integration Checklist

- [ ] Copy HTML file to `/public/index.html`
- [ ] Add script references to `config.js` and `api-integration.js`
- [ ] Remove hardcoded `users` object
- [ ] Remove hardcoded `jobData` object
- [ ] Update `login()` function to use `apiLogin()`
- [ ] Update login button handler to be async
- [ ] Create `loadJobs()` function
- [ ] Create `loadDashboardData()` function
- [ ] Update `openJobDetailPanel()` to use API
- [ ] Update `saveInlineEdit()` to use API
- [ ] Update terminal commands to use API
- [ ] Add error handling for API failures
- [ ] Add loading states for async operations
- [ ] Test all features with API backend

## Testing the Integration

### 1. Test Login
- Open browser console
- Try logging in
- Check for API call in Network tab
- Verify JWT token is stored

### 2. Test Data Loading
- Check if jobs table populates
- Verify metrics update
- Check production schedule loads

### 3. Test Updates
- Try inline editing
- Verify changes persist
- Check audit log via API

### 4. Test Terminal Commands
- Try `list_jobs`
- Try `job_status JOB-2025-087`
- Verify data comes from API

## Troubleshooting

### Jobs not loading
- Check browser console for errors
- Verify API is running (`http://localhost:5000/api/health`)
- Check if logged in (token present)
- Verify CORS is enabled

### Updates not saving
- Check Network tab for failed requests
- Verify JWT token is valid
- Check server console for errors
- Verify user has permissions

### Login fails
- Check username/password
- Verify MongoDB is running
- Check if users were seeded
- Look for error in server console

## Benefits of API Integration

✅ **Data Persistence**: Changes saved to MongoDB
✅ **Real-time Updates**: Multiple users see same data
✅ **Automation**: 10 automated workflows
✅ **Audit Trail**: All changes logged
✅ **Security**: JWT authentication
✅ **Scalability**: Ready for production
✅ **Backup**: Database backup/restore
✅ **API Access**: Integrate with other systems

---

Your frontend is now fully integrated with the MongoDB-backed API! 🎉

