import ApplicationModel from "../models/applicationModel.js";
import JobModel from "../models/jobModel.js";
import NotificationModel from "../models/notificationModel.js";
import UserModel from "../models/userModel.js";

// Get all applications (admin only)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.getAll();
    res.json(applications);
  } catch (error) {
    console.error("Get all applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
   
    const application = await ApplicationModel.getById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user is either the applicant or job poster
    if (
      application.user_id !== req.user.id &&
      application.poster_id !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this application" });
    }

    res.json(application);
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit job application

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

// Get applications by job ID
export const getApplicationsByJobId = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // First verify the job exists and the requesting user is the job poster
    const job = await JobModel.getById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the requesting user is the job poster
    if (job.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only view applications for your own jobs" });
    }

    // Get applications for the job
    const applications = await ApplicationModel.getByJobId(jobId);
    res.json(applications);
  } catch (error) {
    console.error("Get applications by job ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const validStatuses = [
    "Applied",
    "Reviewing",
    "Accepted",
    "Rejected",
    "Withdrawn",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const application = await ApplicationModel.getById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if job exists and get job details
    const job = await JobModel.getById(application.job_id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user is authorized to update status
    // Either the job poster or the applicant can update status
    if (job.user_id !== req.user.id && application.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    // Additional restrictions:
    // 1. Only job poster can mark as Accepted or Rejected
    if (
      (status === "Accepted" || status === "Rejected") &&
      job.user_id !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Only job poster can accept or reject applications" });
    }

    // 2. Only applicant can mark as Withdrawn
    if (status === "Withdrawn" && application.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only applicant can withdraw their application" });
    }

    // Update status
    const updated = await ApplicationModel.updateStatus(id, status);
    if (!updated) {
      return res
        .status(400)
        .json({ message: "Failed to update application status" });
    }

    // Get job poster and applicant details for notifications
    const jobPoster = await UserModel.getById(job.user_id);
    const applicant = await UserModel.getById(application.user_id);

    // Create notifications based on status change
    try {
      if (status === "Accepted") {
        // Notify applicant
        await NotificationModel.create({
          user_id: application.user_id,
          title: "Application Accepted",
          message: `Your application for "${job.title}" has been accepted by ${jobPoster.name}`,
          type: "application_status",
          reference_id: parseInt(id),
          reference_type: "job_application",
        });
      } else if (status === "Rejected") {
        // Notify applicant
        await NotificationModel.create({
          user_id: application.user_id,
          title: "Application Not Selected",
          message: `Your application for "${job.title}" was not selected by ${jobPoster.name}`,
          type: "application_status",
          reference_id: parseInt(id),
          reference_type: "job_application",
        });
      } else if (status === "Withdrawn") {
        // Notify job poster
        await NotificationModel.create({
          user_id: job.user_id,
          title: "Application Withdrawn",
          message: `${applicant.name} has withdrawn their application for "${job.title}"`,
          type: "application_status",
          reference_id: parseInt(id),
          reference_type: "job_application",
        });
      }
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the whole request if notification fails
    }

    res.json({
      message: "Application status updated successfully",
      status,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's submitted applications
export const getUserApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.getByUserId(req.user.id);
    res.json(applications);
  } catch (error) {
    console.error("Get user applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get applications to user's posted jobs
export const getJobApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.getToUserJobs(req.user.id);
    res.json(applications);
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
