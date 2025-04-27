import JobModel from '../models/jobModel.js';

// Get all jobs
export async function getAllJobs(req, res) {
  try {
    const jobs = await JobModel.getAll();
    res.json(jobs);
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get job by ID
export async function getJobById(req, res) {
  try {
    const job = await JobModel.getById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Create new job
export async function createJob(req, res) {
  try {
    const jobData = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type || 'General', // Default value
      payment: req.body.payment || '0', // Match varchar(100) type
      deadline: req.body.deadline,
      requirements: req.body.requirements || '',
      location: req.body.location || 'Remote',
      user_id: req.user.id // Changed from clientId to match schema
    };

    console.log('Creating job with data:', {
      ...jobData,
      description: jobData.description.substring(0, 50) + '...',
      requirements: jobData.requirements.substring(0, 50) + '...'
    });

    const jobId = await JobModel.create(jobData);
    
    return res.status(201).json({
      success: true,
      jobId,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Create job controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
// Update job
export async function updateJob(req, res) {
  try {
    // First check if job exists and belongs to user
    const job = await JobModel.getById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }
    
    const updated = await JobModel.update(req.params.id, req.body);
    if (updated) {
      res.json({ message: 'Job updated successfully' });
    } else {
      res.status(400).json({ message: 'Job update failed' });
    }
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete job
export async function deleteJob(req, res) {
  try {
    // First check if job exists and belongs to user
    const job = await JobModel.getById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    
    const deleted = await JobModel.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Job deleted successfully' });
    } else {
      res.status(400).json({ message: 'Job deletion failed' });
    }
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get user's jobs
export async function getUserJobs(req, res) {
  try {
    const jobs = await JobModel.getUserJobs(req.user.id);
    res.json(jobs);
  } catch (error) {
    console.error('Get user jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}