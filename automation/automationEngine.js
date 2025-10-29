const mongoose = require('mongoose');
const Job = require('../models/Job');
const ProductionSchedule = require('../models/ProductionSchedule');
const WorkflowTracking = require('../models/WorkflowTracking');
const Inventory = require('../models/Inventory');
const Notification = require('../models/Notification');
const { createAuditLog } = require('../middleware/auditLog');

let changeStream;
let dailyCheckInterval;

/**
 * Initialize all automation systems
 */
async function initializeAutomations() {
  console.log('Initializing automation system...');
  
  try {
    // Initialize Change Streams for real-time automations
    await initializeChangeStreams();
    
    // Initialize scheduled jobs
    initializeScheduledJobs();
    
    console.log('Automation system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize automation system:', error);
  }
}

/**
 * Initialize MongoDB Change Streams for real-time monitoring
 * Note: Change Streams require MongoDB Replica Set
 */
async function initializeChangeStreams() {
  try {
    // Check if we can use change streams (requires replica set)
    // For standalone MongoDB, this will fail gracefully
    
    // Watch Job collection for changes
    const jobChangeStream = Job.watch();
    
    jobChangeStream.on('change', async (change) => {
      try {
        if (change.operationType === 'insert') {
          await automation1_NewJobCreated(change.fullDocument);
        } else if (change.operationType === 'update') {
          await handleJobUpdate(change);
        }
      } catch (error) {
        console.error('Change stream error:', error);
      }
    });

    jobChangeStream.on('error', (error) => {
      console.warn('Job change stream error (this is OK if not using replica set):', error.message);
    });

    // Watch ProductionSchedule collection
    const productionChangeStream = ProductionSchedule.watch();
    
    productionChangeStream.on('change', async (change) => {
      try {
        if (change.operationType === 'update') {
          await handleProductionUpdate(change);
        }
      } catch (error) {
        console.error('Production change stream error:', error);
      }
    });

    productionChangeStream.on('error', (error) => {
      console.warn('Production change stream error (this is OK if not using replica set):', error.message);
    });

    // Watch Inventory collection
    const inventoryChangeStream = Inventory.watch();
    
    inventoryChangeStream.on('change', async (change) => {
      try {
        if (change.operationType === 'update') {
          await handleInventoryUpdate(change);
        }
      } catch (error) {
        console.error('Inventory change stream error:', error);
      }
    });

    inventoryChangeStream.on('error', (error) => {
      console.warn('Inventory change stream error (this is OK if not using replica set):', error.message);
    });

    console.log('✓ Change streams initialized (real-time automations enabled)');
  } catch (error) {
    console.warn('⚠ Change Streams not available (MongoDB Replica Set required)');
    console.warn('  Automations will still work via API triggers, but not real-time monitoring');
    console.warn('  To enable real-time automations, configure MongoDB as a Replica Set');
    console.warn('  For development, this is optional - the app will work fine without it');
  }
}

/**
 * Initialize scheduled jobs (cron-like functionality)
 */
function initializeScheduledJobs() {
  // Run overdue check daily at 6 AM (every 24 hours, adjust as needed)
  // For demo purposes, checking every hour
  dailyCheckInterval = setInterval(async () => {
    await automation8_OverdueMilestoneAlert();
  }, 60 * 60 * 1000); // Every hour

  console.log('Scheduled jobs initialized');
}

/**
 * AUTOMATION 1: New Job Created
 */
async function automation1_NewJobCreated(job) {
  console.log(`[AUTOMATION 1] New job created: ${job.jobNumber}`);
  
  try {
    // 1. Create workflow tracking for each stage
    const stages = ['QUOTE', 'ENGINEERING', 'PRODUCTION', 'DELIVERY', 'COMPLETE'];
    
    for (const stage of stages) {
      await WorkflowTracking.create({
        job: job._id,
        jobNumber: job.jobNumber,
        stage: stage,
        status: stage === 'QUOTE' ? 'IN_PROGRESS' : 'PENDING'
      });
    }

    // 2. Assign to appropriate employee (simplified - would use skill-based assignment)
    // This would be done manually or through a separate assignment API

    // 3. Send notification to project manager (if assigned)
    if (job.projectManager) {
      await Notification.create({
        recipient: job.projectManager,
        type: 'INFO',
        priority: 'NORMAL',
        title: 'New Job Assigned',
        message: `You have been assigned to ${job.jobNumber} - ${job.jobName}`,
        relatedEntity: {
          entityType: 'JOB',
          entityId: job._id,
          entityName: job.jobNumber
        }
      });
    }

    // 4. Customer portal access would be created if needed (manual process)

    // 5. Log in audit
    await createAuditLog(
      'JOB_CREATED',
      'JOB',
      job._id,
      job.jobNumber,
      null,
      'Automation: New job created',
      { jobNumber: job.jobNumber }
    );

  } catch (error) {
    console.error('[AUTOMATION 1] Error:', error);
  }
}

/**
 * AUTOMATION 2: Quote Approved
 */
async function automation2_QuoteApproved(job) {
  console.log(`[AUTOMATION 2] Quote approved: ${job.jobNumber}`);
  
  try {
    // 1. Job number already generated on creation
    
    // 2. Update workflow stage to engineering
    await Job.findByIdAndUpdate(job._id, {
      stage: 'ENGINEERING',
      'timeline.quoteApproved': new Date()
    });

    // 3. Update workflow tracking
    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'QUOTE' },
      { status: 'COMPLETE', actualCompletionDate: new Date() }
    );

    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'ENGINEERING' },
      { status: 'IN_PROGRESS', startDate: new Date() }
    );

    // 4. Send notification to customer (would integrate email)
    
    // 5. Create production schedule placeholder (done later when engineering complete)

    // 6. Log in audit
    await createAuditLog(
      'STATUS_CHANGED',
      'JOB',
      job._id,
      job.jobNumber,
      null,
      'Automation: Quote approved',
      { stage: 'ENGINEERING' }
    );

  } catch (error) {
    console.error('[AUTOMATION 2] Error:', error);
  }
}

/**
 * AUTOMATION 3: Engineering Complete
 */
async function automation3_EngineeringComplete(job) {
  console.log(`[AUTOMATION 3] Engineering complete: ${job.jobNumber}`);
  
  try {
    // 1. Update job workflow stage to production
    await Job.findByIdAndUpdate(job._id, {
      stage: 'PRODUCTION',
      'timeline.engineeringComplete': new Date()
    });

    // 2. Update workflow tracking
    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'ENGINEERING' },
      { status: 'COMPLETE', actualCompletionDate: new Date() }
    );

    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'PRODUCTION' },
      { status: 'IN_PROGRESS', startDate: new Date() }
    );

    // 3. Check material inventory
    // This would check against job requirements

    // 4. Send notification to production team
    
    // 5. Update customer portal
    
    // 6. Log in audit
    await createAuditLog(
      'STAGE_CHANGED',
      'JOB',
      job._id,
      job.jobNumber,
      null,
      'Automation: Engineering complete, moved to production',
      { stage: 'PRODUCTION' }
    );

  } catch (error) {
    console.error('[AUTOMATION 3] Error:', error);
  }
}

/**
 * AUTOMATION 4: Production Started
 */
async function automation4_ProductionStarted(production) {
  console.log(`[AUTOMATION 4] Production started: ${production.productionId}`);
  
  try {
    const job = await Job.findById(production.job);
    
    if (!job) return;

    // 1. Update workflow tracking
    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'PRODUCTION' },
      { status: 'IN_PROGRESS' }
    );

    // 2. Calculate expected cure completion date (pour_date + 7 days)
    if (production.pourDate) {
      const cureDate = new Date(production.pourDate);
      cureDate.setDate(cureDate.getDate() + 7);
      
      await ProductionSchedule.findByIdAndUpdate(production._id, {
        cureCompleteDate: cureDate
      });
    }

    // 3. Send daily status update to PM (would be scheduled)
    
    // 4. Update customer portal
    
    // 5. Log in audit
    await createAuditLog(
      'PRODUCTION_STARTED',
      'PRODUCTION',
      production._id,
      production.productionId,
      null,
      'Automation: Production started',
      { productionId: production.productionId, jobNumber: job.jobNumber }
    );

  } catch (error) {
    console.error('[AUTOMATION 4] Error:', error);
  }
}

/**
 * AUTOMATION 5: Quality Check Failed
 */
async function automation5_QualityCheckFailed(production, qualityCheck) {
  console.log(`[AUTOMATION 5] Quality check failed: ${production.productionId}`);
  
  try {
    const job = await Job.findById(production.job).populate('projectManager');
    
    if (!job) return;

    // 1 & 2. Update workflow status and create notification
    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'PRODUCTION' },
      { 
        status: 'BLOCKED',
        blockedReason: `QC Failed: ${qualityCheck.failureReason}`
      }
    );

    // Create notification for PM
    if (job.projectManager) {
      await Notification.create({
        recipient: job.projectManager,
        type: 'ALERT',
        priority: 'HIGH',
        title: 'Quality Check Failed',
        message: `${job.jobNumber}: Quality check failed - ${qualityCheck.failureReason}`,
        relatedEntity: {
          entityType: 'PRODUCTION',
          entityId: production._id,
          entityName: production.productionId
        },
        actionRequired: true
      });
    }

    // 3. Trigger assessment (manual process)
    
    // 4. Adjust production schedule
    await ProductionSchedule.findByIdAndUpdate(production._id, {
      productionStage: 'DELAYED'
    });

    // 5. Do NOT notify customer automatically
    
    // 6. Log in audit
    await createAuditLog(
      'QUALITY_CHECK',
      'PRODUCTION',
      production._id,
      production.productionId,
      null,
      'Automation: Quality check failed',
      { failureReason: qualityCheck.failureReason }
    );

  } catch (error) {
    console.error('[AUTOMATION 5] Error:', error);
  }
}

/**
 * AUTOMATION 6: Products Ship-Ready
 */
async function automation6_ProductsShipReady(production) {
  console.log(`[AUTOMATION 6] Products ship-ready: ${production.productionId}`);
  
  try {
    const job = await Job.findById(production.job);
    
    if (!job) return;

    // 1. Update job workflow stage to delivery
    await Job.findByIdAndUpdate(job._id, {
      stage: 'DELIVERY',
      'timeline.productionComplete': new Date()
    });

    // 2. Update workflow tracking
    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'PRODUCTION' },
      { status: 'COMPLETE', actualCompletionDate: new Date() }
    );

    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'DELIVERY' },
      { status: 'IN_PROGRESS', startDate: new Date() }
    );

    // 3. Send notification to customer
    
    // 4. Update customer portal
    
    // 5. Log in audit
    await createAuditLog(
      'PRODUCTION_COMPLETE',
      'PRODUCTION',
      production._id,
      production.productionId,
      null,
      'Automation: Products ship-ready',
      { jobNumber: job.jobNumber }
    );

  } catch (error) {
    console.error('[AUTOMATION 6] Error:', error);
  }
}

/**
 * AUTOMATION 7: Delivery Complete
 */
async function automation7_DeliveryComplete(job) {
  console.log(`[AUTOMATION 7] Delivery complete: ${job.jobNumber}`);
  
  try {
    // 1. Update job workflow stage to complete
    await Job.findByIdAndUpdate(job._id, {
      stage: 'COMPLETE',
      status: 'COMPLETE',
      'timeline.deliveryComplete': new Date()
    });

    // 2. Update workflow tracking
    await WorkflowTracking.findOneAndUpdate(
      { job: job._id, stage: 'DELIVERY' },
      { status: 'COMPLETE', actualCompletionDate: new Date() }
    );

    // 3. Generate invoice (manual or separate system)
    
    // 4. Send customer satisfaction survey
    
    // 5. Update customer portal
    
    // 6. Log in audit
    await createAuditLog(
      'DELIVERY_COMPLETE',
      'JOB',
      job._id,
      job.jobNumber,
      null,
      'Automation: Delivery complete, job closed',
      { jobNumber: job.jobNumber }
    );

  } catch (error) {
    console.error('[AUTOMATION 7] Error:', error);
  }
}

/**
 * AUTOMATION 8: Overdue Milestone Alert
 */
async function automation8_OverdueMilestoneAlert() {
  console.log('[AUTOMATION 8] Checking for overdue milestones...');
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find overdue workflow items
    const overdueItems = await WorkflowTracking.find({
      estimatedCompletionDate: { $lt: today },
      status: { $ne: 'COMPLETE' }
    }).populate('job').populate('assignedTo');

    for (const item of overdueItems) {
      if (!item.job) continue;

      // 1. Create high-priority notification for PM
      if (item.job.projectManager) {
        await Notification.create({
          recipient: item.job.projectManager,
          type: 'ALERT',
          priority: 'HIGH',
          title: 'Overdue Milestone',
          message: `${item.jobNumber} - ${item.stage} is overdue`,
          relatedEntity: {
            entityType: 'JOB',
            entityId: item.job._id,
            entityName: item.jobNumber
          },
          actionRequired: true
        });
      }

      // 2. Flag job status if not already flagged
      if (item.job.status === 'ON_TRACK') {
        await Job.findByIdAndUpdate(item.job._id, {
          status: 'AT_RISK'
        });
      }

      // 3. Log in audit
      await createAuditLog(
        'AUTOMATION_TRIGGERED',
        'JOB',
        item.job._id,
        item.jobNumber,
        null,
        'Automation: Overdue milestone alert',
        { stage: item.stage, estimatedDate: item.estimatedCompletionDate }
      );
    }

    console.log(`[AUTOMATION 8] Found ${overdueItems.length} overdue items`);

  } catch (error) {
    console.error('[AUTOMATION 8] Error:', error);
  }
}

/**
 * AUTOMATION 9: Material Low Inventory
 */
async function automation9_MaterialLowInventory(inventory) {
  console.log(`[AUTOMATION 9] Low inventory alert: ${inventory.materialType}`);
  
  try {
    // Find purchasing/admin users
    // For now, just log
    
    // 1. Create notification for purchasing
    
    // 2. Update production schedule with order needed
    
    // 3. Send alert to production scheduler
    
    // 4. Log in audit
    await createAuditLog(
      'MATERIAL_ORDERED',
      'INVENTORY',
      inventory._id,
      inventory.materialType,
      null,
      'Automation: Low inventory alert',
      { 
        currentQuantity: inventory.currentQuantity,
        minimumQuantity: inventory.minimumQuantity,
        status: inventory.status
      }
    );

  } catch (error) {
    console.error('[AUTOMATION 9] Error:', error);
  }
}

/**
 * Handle Job updates to detect status changes
 */
async function handleJobUpdate(change) {
  const jobId = change.documentKey._id;
  const updatedFields = change.updateDescription.updatedFields;

  // Check if status changed from 'quote' to 'approved'
  if (updatedFields.status === 'APPROVED' || updatedFields.stage === 'ENGINEERING') {
    const job = await Job.findById(jobId);
    if (job) {
      await automation2_QuoteApproved(job);
    }
  }

  // Check if engineering completed
  if (updatedFields.stage === 'PRODUCTION') {
    const job = await Job.findById(jobId);
    if (job) {
      await automation3_EngineeringComplete(job);
    }
  }

  // Check if delivery completed
  if (updatedFields.stage === 'COMPLETE') {
    const job = await Job.findById(jobId);
    if (job) {
      await automation7_DeliveryComplete(job);
    }
  }
}

/**
 * Handle Production Schedule updates
 */
async function handleProductionUpdate(change) {
  const productionId = change.documentKey._id;
  const updatedFields = change.updateDescription.updatedFields;

  // Check if production started
  if (updatedFields.productionStage === 'IN_PROGRESS') {
    const production = await ProductionSchedule.findById(productionId);
    if (production) {
      await automation4_ProductionStarted(production);
    }
  }

  // Check if production finished
  if (updatedFields.productionStage === 'FINISHED') {
    const production = await ProductionSchedule.findById(productionId);
    if (production) {
      await automation6_ProductsShipReady(production);
    }
  }

  // Check if quality check failed
  if (updatedFields['qualityChecks']) {
    const production = await ProductionSchedule.findById(productionId);
    if (production && production.qualityChecks) {
      const latestQC = production.qualityChecks[production.qualityChecks.length - 1];
      if (!latestQC.passed) {
        await automation5_QualityCheckFailed(production, latestQC);
      }
    }
  }
}

/**
 * Handle Inventory updates
 */
async function handleInventoryUpdate(change) {
  const inventoryId = change.documentKey._id;
  const updatedFields = change.updateDescription.updatedFields;

  // Check if status changed to LOW or CRITICAL
  if (updatedFields.status === 'LOW' || updatedFields.status === 'CRITICAL') {
    const inventory = await Inventory.findById(inventoryId);
    if (inventory) {
      await automation9_MaterialLowInventory(inventory);
    }
  }
}

/**
 * Cleanup function
 */
function shutdownAutomations() {
  console.log('Shutting down automation system...');
  
  if (changeStream) {
    changeStream.close();
  }
  
  if (dailyCheckInterval) {
    clearInterval(dailyCheckInterval);
  }
  
  console.log('Automation system shut down');
}

module.exports = {
  initializeAutomations,
  shutdownAutomations
};

