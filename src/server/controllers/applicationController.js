
import ApplicationModel from '../models/applicationModel.js';

import NotificationModel from '../models/notificationModel.js';
import UserModel from '../models/userModel.js';

// Get all applications (admin only)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.getAll();
    res.json(applications);
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await ApplicationModel.getById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is either the applicant or job poster
    if (application.user_id !== req.user.id && application.poster_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit job application
export const submitApplication = async (req, res) => {
  const { job_id, cover_letter } = req.body;
  
  if (!job_id) {
    return res.status(400).json({ message: 'Job ID is required' });
  }
  
  try {
    // Check if job exists
    const job = await JobModel.getById(job_id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if job poster is applying to their own job
    if (job.user_id === req.user.id) {
      return res.status(400).json({ message: 'Cannot apply to your own job' });
    }
    
    // Check if user already applied
    const hasDuplicate = await ApplicationModel.checkDuplicate(job_id, req.user.id);
    if (hasDuplicate) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    
    // Create application
    const applicationId = await ApplicationModel.create({
      job_id,
      user_id: req.user.id,
      cover_letter: cover_letter || ''
    });

    // Get job poster and applicant details
    const jobPoster = await UserModel.getById(job.user_id);
    const applicant = await UserModel.getById(req.user.id);
    
    // Create notification for job poster
    await NotificationModel.create({
      user_id: job.user_id,
      title: 'New Job Application',
      message: `${applicant.name} has applied to your job posting: ${job.title}`,
      type: 'application',
      reference_id: applicationId,
      reference_type: 'job_application'
    });
    
    // Create notification for applicant
    await NotificationModel.create({
      user_id: req.user.id,
      title: 'Application Submitted',
      message: `Your application to ${job.title} has been submitted to ${jobPoster.name}`,
      type: 'application',
      reference_id: applicationId,
      reference_type: 'job_application'
    });
    
    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const validStatuses = ['Applied', 'Reviewing', 'Accepted', 'Rejected', 'Withdrawn'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    // Get application
    const application = await ApplicationModel.getById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if job exists and get job details
    const job = await JobModel.getById(application.job_id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user is authorized to update status
    if (job.user_id !== req.user.id && application.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    
    // Additional restrictions:
    // 1. Only job poster can mark as Accepted or Rejected
    if ((status === 'Accepted' || status === 'Rejected') && job.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Only job poster can accept or reject applications' });
    }
    
    // 2. Only applicant can mark as Withdrawn
    if (status === 'Withdrawn' && application.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Only applicant can withdraw their application' });
    }
    
    // Update status
    const updated = await ApplicationModel.updateStatus(id, status);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update application status' });
    }
    
    // Get job poster and applicant details
    const jobPoster = await UserModel.getById(job.user_id);
    const applicant = await UserModel.getById(application.user_id);
    
    // Create notifications based on status change
    if (status === 'Accepted') {
      // Notify applicant
      await NotificationModel.create({
        user_id: application.user_id,
        title: 'Application Accepted',
        message: `Your application for "${job.title}" has been accepted by ${jobPoster.name}`,
        type: 'application_status',
        reference_id: parseInt(id),
        reference_type: 'job_application'
      });
    } else if (status === 'Rejected') {
      // Notify applicant
      await NotificationModel.create({
        user_id: application.user_id,
        title: 'Application Not Selected',
        message: `Your application for "${job.title}" was not selected by ${jobPoster.name}`,
        type: 'application_status',
        reference_id: parseInt(id),
        reference_type: 'job_application'
      });
    } else if (status === 'Withdrawn') {
      // Notify job poster
      await NotificationModel.create({
        user_id: job.user_id,
        title: 'Application Withdrawn',
        message: `${applicant.name} has withdrawn their application for "${job.title}"`,
        type: 'application_status',
        reference_id: parseInt(id),
        reference_type: 'job_application'
      });
    }
    
    res.json({ 
      message: 'Application status updated successfully',
      status
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's submitted applications
export const getUserApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.getByUserId(req.user.id);
    res.json(applications);
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get applications to user's posted jobs
export const getJobApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.getToUserJobs(req.user.id);
    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
