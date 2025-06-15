import JobModel from '../models/jobModel.js';
// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const excludeUserId = req.query.excludeUserId;
    let jobs;
    
    if (excludeUserId) {
      // We'll need to modify the model to handle this
      jobs = await JobModel.getAllExcludingUser(excludeUserId);
    } else {
      jobs = await JobModel.getAll();
    }
    
    res.json(jobs);
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await JobModel.getById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get jobs by user ID
export const getJobsByUserId = async (req, res) => {
  try {
    const jobs = await JobModel.getUserJobs(req.params.userId);
    
    res.json(jobs);
  } catch (error) {
    console.error('Get user materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new job
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      user_id: req.user.id
    };

    const createdJob = await JobModel.create(jobData);
    
    return res.status(201).json({
      success: true,
      data: createdJob,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update job
export const updateJob = async (req, res) => {
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
    res.status(500).json({ 
      message: 'Failed to update job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
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
    res.status(500).json({ 
      message: 'Failed to delete job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};