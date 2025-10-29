const AuditLog = require('../models/AuditLog');

// Middleware to automatically log certain actions
exports.logAction = (eventType, entityType) => {
  return async (req, res, next) => {
    // Store original send function
    const originalSend = res.send;

    // Override send function to log after successful response
    res.send = async function(data) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const logEntry = {
            eventType,
            entityType,
            user: req.user ? req.user._id : null,
            username: req.user ? req.user.username : 'system',
            action: `${req.method} ${req.originalUrl}`,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            details: {
              method: req.method,
              path: req.originalUrl,
              query: req.query,
              body: req.method !== 'GET' ? req.body : undefined
            }
          };

          // Add entity information if available in response
          if (data && typeof data === 'object') {
            try {
              const parsedData = JSON.parse(data);
              if (parsedData.data && parsedData.data._id) {
                logEntry.entityId = parsedData.data._id;
                logEntry.entityName = parsedData.data.jobNumber || parsedData.data.name || parsedData.data.companyName;
              }
            } catch (e) {
              // Not JSON or parsing failed, skip entity info
            }
          }

          await AuditLog.create(logEntry);
        } catch (error) {
          console.error('Audit log error:', error);
          // Don't fail the request if audit logging fails
        }
      }

      // Call original send
      originalSend.call(this, data);
    };

    next();
  };
};

// Manual audit log creation utility
exports.createAuditLog = async (eventType, entityType, entityId, entityName, user, action, details, previousValue, newValue) => {
  try {
    await AuditLog.create({
      eventType,
      entityType,
      entityId,
      entityName,
      user: user ? user._id : null,
      username: user ? user.username : 'system',
      action,
      details,
      previousValue,
      newValue
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

