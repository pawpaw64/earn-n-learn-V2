
import ApplicationModel from '../models/applicationModel.js';
import JobModel from '../models/jobModel.js';
import UserModel from '../models/userModel.js';

// Submit application
export async function submitApplication(req, res) {
  console.log('Submitting application... [applicationController.js.submitApplication]');
  
  try {
    const { job_id, cover_letter, phone, resume_url } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!job_id || !cover_letter) {
      return res.status(400).json({ 
        success: false,
        message: 'Job ID and cover letter are required' 
      });
    }

    // Check if job exists
    const job = await JobModel.getById(job_id);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }

    // Check if user is trying to apply to their own job
    if (job.user_id === user_id) {
      return res.status(400).json({ 
        success: false,
        message: 'You cannot apply to your own job' 
      });
    }

    // Check for duplicate applications
    const existingApplications = await ApplicationModel.checkDuplicate(job_id, user_id);
    if (existingApplications && existingApplications.length > 0) {
      return res.status(409).json({ 
        success: false,
        message: 'You have already applied for this job' 
      });
    }

    // Create application with additional fields
    const applicationData = {
      job_id,
      user_id,
      cover_letter,
      phone: phone || null,
      resume_url: resume_url || null
    };

    const applicationId = await ApplicationModel.create(applicationData);

    if (!applicationId) {
      throw new Error('Failed to create application');
    }

    console.log('Application submitted successfully:', applicationId);
    
    res.status(201).json({ 
      success: true,
      applicationId,
      message: 'Application submitted successfully' 
    });

  } catch (error) {
    console.error('Submit application error:', {
      error: error.message,
      body: req.body,
      userId: req.user?.id,
      stack: error.stack
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit application',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Get application by ID
export async function getApplicationById(req, res) {
  console.log('Getting application by ID... [applicationController.js.getApplicationById]');
  
  try {
    const { id } = req.params;
    const application = await ApplicationModel.getById(id);
    
    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    // Check if user has permission to view this application
    const userId = req.user.id;
    if (application.user_id !== userId && application.poster_id !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }
    
    res.json({
      success: true,
      data: application
    });
    
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch application' 
    });
  }
}

// Update application status
export async function updateApplicationStatus(req, res) {
  console.log('Updating application status... [applicationController.js.updateApplicationStatus]');
  
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status value' 
      });
    }

    // Get application details to check permissions
    const application = await ApplicationModel.getById(id);
    if (!application) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    // Check permissions - only applicant can withdraw, only job poster can accept/reject
    if (status === 'Withdrawn' && application.user_id !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Only applicants can withdraw their applications' 
      });
    } else if ((status === 'Accepted' || status === 'Rejected') && application.poster_id !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Only job posters can accept or reject applications' 
      });
    }

    const updated = await ApplicationModel.updateStatus(id, status);
    
    if (updated) {
      res.json({ 
        success: true,
        message: `Application status updated to ${status}` 
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: 'Failed to update application status' 
      });
    }
    
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update application status' 
    });
  }
}

// Get user's submitted applications
export async function getUserApplications(req, res) {
  console.log('Getting user applications... [applicationController.js.getUserApplications]');
  
  try {
    const userId = req.user.id;
    const applications = await ApplicationModel.getByUserId(userId);
    
    res.json({
      success: true,
      data: applications || []
    });
    
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch applications',
      data: []
    });
  }
}

// Get applications for user's jobs
export async function getJobApplications(req, res) {
  console.log('Getting job applications... [applicationController.js.getJobApplications]');
  
  try {
    const userId = req.user.id;
    const applications = await ApplicationModel.getToUserJobs(userId);
    
    res.json({
      success: true,
      data: applications || []
    });
    
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch job applications',
      data: []
    });
  }
}

// Get applications for a specific job
export async function getApplicationsByJobId(req, res) {
  console.log('Getting applications by job ID... [applicationController.js.getApplicationsByJobId]');
  
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    // Verify the user owns this job
    const job = await JobModel.getById(jobId);
    if (!job || job.user_id !== userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied - you can only view applications for your own jobs' 
      });
    }

    const applications = await ApplicationModel.getByJobId(jobId);
    
    res.json({
      success: true,
      data: applications || []
    });
    
  } catch (error) {
    console.error('Get applications by job ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch job applications',
      data: []
    });
  }
}
