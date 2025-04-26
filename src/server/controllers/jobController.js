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
  const { title, description, type, payment, deadline, requirements, location } = req.body;
  
  // Validation
  if (!title || !description || !type) {
    return res.status(400).json({ message: 'Please provide title, description and type' });
  }
  
  try {
    const jobId = await JobModel.create({
      title,
      description,
      type,
      payment,
      deadline,
      requirements,
      location,
      user_id: req.user.id
    });
    
    res.status(201).json({ 
      jobId,
      message: 'Job posted successfully' 
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
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