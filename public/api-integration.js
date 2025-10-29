// API Integration Helper Functions

/**
 * Make an authenticated API request with JWT token
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The JSON response
 */
async function makeAuthenticatedRequest(url, options = {}) {
    const token = sessionStorage.getItem('authToken');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            // Token expired or invalid
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('currentUser');
            window.location.reload();
            throw new Error('Unauthorized - Please login again');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || 'API Error');
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * Get all jobs
 */
async function getJobs() {
    return makeAuthenticatedRequest(`${API_BASE_URL}/api/jobs`);
}

/**
 * Get a specific job
 */
async function getJob(jobNumber) {
    return makeAuthenticatedRequest(`${API_BASE_URL}/api/jobs/${jobNumber}`);
}

/**
 * Update a job
 */
async function updateJob(jobNumber, data) {
    return makeAuthenticatedRequest(`${API_BASE_URL}/api/jobs/${jobNumber}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * Create a new job
 */
async function createJob(data) {
    return makeAuthenticatedRequest(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * Get employees
 */
async function getEmployees() {
    return makeAuthenticatedRequest(`${API_BASE_URL}/api/employees`);
}

/**
 * Get inventory
 */
async function getInventory() {
    return makeAuthenticatedRequest(`${API_BASE_URL}/api/inventory`);
}

/**
 * Get customers
 */
async function getCustomers() {
    return makeAuthenticatedRequest(`${API_BASE_URL}/api/customers`);
}

/**
 * Create a new customer
 */
async function createCustomer(data) {
    return makeAuthenticatedRequest(`${API_BASE_URL}/api/customers`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}
