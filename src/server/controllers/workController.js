
import WorkModel from '../models/workModel.js';
import ApplicationModel from '../models/applicationModel.js';
import JobModel from '../models/jobModel.js';
import ContactModel from '../models/contactModel.js';
import NotificationModel from '../models/notificationModel.js';
import InvoiceModel from '../models/invoiceModel.js';
import UserModel from '../models/userModel.js';

// Create work from job application
export const createWorkFromApplication = async (req, res) => {
  const { application_id } = req.body;
  
  if (!application_id) {
    return res.status(400).json({ message: 'Application ID is required' });
  }
  
  try {
    // Get application details
    const application = await ApplicationModel.getById(application_id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is job poster
    const job = await JobModel.getById(application.job_id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Only job poster can create work assignments' });
    }
    
    // Create work assignment
    const workId = await WorkModel.createFromJobApplication(
      application_id,
      application.user_id,  // Provider (applicant)
      job.user_id           // Client (job poster)
    );
    
    // Update application status
    await ApplicationModel.updateStatus(application_id, 'Accepted');
    
    // Get provider and client details
    const provider = await UserModel.getById(application.user_id);
    const client = await UserModel.getById(job.user_id);
    
    // Create notification for provider
    await NotificationModel.create({
      user_id: provider.id,
      title: 'Work Assignment Created',
      message: `Your application for "${job.title}" has been accepted and a work assignment has been created`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    // Create notification for client
    await NotificationModel.create({
      user_id: client.id,
      title: 'Work Assignment Created',
      message: `You have created a work assignment for "${job.title}" with ${provider.name}`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    res.status(201).json({
      message: 'Work assignment created successfully',
      workId
    });
  } catch (error) {
    console.error('Create work from application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create work from skill contact
export const createWorkFromSkillContact = async (req, res) => {
  const { contact_id } = req.body;
  
  if (!contact_id) {
    return res.status(400).json({ message: 'Contact ID is required' });
  }
  
  try {
    // Get skill contacts to user's skills
    const skillContacts = await ContactModel.getToUserSkills(req.user.id);
    const contact = skillContacts.find(c => c.id === parseInt(contact_id));
    
    if (!contact) {
      return res.status(404).json({ message: 'Skill contact not found or you are not authorized' });
    }
    
    // Create work assignment
    const workId = await WorkModel.createFromSkillContact(
      contact_id,
      req.user.id,       // Provider (skill owner)
      contact.user_id    // Client (contact initiator)
    );
    
    // Update skill contact status
    await ContactModel.updateSkillContactStatus(contact_id, 'Agreement Reached');
    
    // Get provider and client details
    const provider = await UserModel.getById(req.user.id);
    const client = await UserModel.getById(contact.user_id);
    
    // Create notification for client
    await NotificationModel.create({
      user_id: client.id,
      title: 'Work Agreement Created',
      message: `Your inquiry about "${contact.skill_name}" has been accepted and a work agreement has been created`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    // Create notification for provider
    await NotificationModel.create({
      user_id: provider.id,
      title: 'Work Agreement Created',
      message: `You have created a work agreement for "${contact.skill_name}" with ${client.name}`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    res.status(201).json({
      message: 'Work agreement created successfully',
      workId
    });
  } catch (error) {
    console.error('Create work from skill contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create work from material contact
export const createWorkFromMaterialContact = async (req, res) => {
  const { contact_id } = req.body;
  
  if (!contact_id) {
    return res.status(400).json({ message: 'Contact ID is required' });
  }
  
  try {
    // Get material contacts to user's materials
    const materialContacts = await ContactModel.getToUserMaterials(req.user.id);
    const contact = materialContacts.find(c => c.id === parseInt(contact_id));
    
    if (!contact) {
      return res.status(404).json({ message: 'Material contact not found or you are not authorized' });
    }
    
    // Create work assignment
    const workId = await WorkModel.createFromMaterialContact(
      contact_id,
      req.user.id,       // Provider (material owner)
      contact.user_id    // Client (contact initiator)
    );
    
    // Update material contact status
    await ContactModel.updateMaterialContactStatus(contact_id, 'Agreement Reached');
    
    // Get provider and client details
    const provider = await UserModel.getById(req.user.id);
    const client = await UserModel.getById(contact.user_id);
    
    // Create notification for client
    await NotificationModel.create({
      user_id: client.id,
      title: 'Sale Agreement Created',
      message: `Your inquiry about "${contact.title}" has been accepted and a sale agreement has been created`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    // Create notification for provider
    await NotificationModel.create({
      user_id: provider.id,
      title: 'Sale Agreement Created',
      message: `You have created a sale agreement for "${contact.title}" with ${client.name}`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    res.status(201).json({
      message: 'Sale agreement created successfully',
      workId
    });
  } catch (error) {
    console.error('Create work from material contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update work status
export const updateWorkStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const validStatuses = ['In Progress', 'Paused', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    // Get work assignment
    const work = await WorkModel.getById(id);
    if (!work) {
      return res.status(404).json({ message: 'Work assignment not found' });
    }
    
    // Check authorization - either provider or client can update
    if (work.provider_id !== req.user.id && work.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this work assignment' });
    }
    
    // Update status
    const updated = await WorkModel.updateStatus(id, status);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update work status' });
    }
    
    // If status is Completed, update end date
    if (status === 'Completed') {
      await WorkModel.complete(id);
      
      // Generate invoice automatically
      try {
        const invoiceId = await InvoiceModel.createFromWork(id);
        
        // Notify both parties
        await NotificationModel.create({
          user_id: work.provider_id,
          title: 'Invoice Generated',
          message: `An invoice has been generated for your completed work: ${work.job_title || work.skill_name || work.material_title}`,
          type: 'invoice',
          reference_id: invoiceId,
          reference_type: 'invoice'
        });
        
        await NotificationModel.create({
          user_id: work.client_id,
          title: 'Payment Due',
          message: `A payment is due for your completed work: ${work.job_title || work.skill_name || work.material_title}`,
          type: 'invoice',
          reference_id: invoiceId,
          reference_type: 'invoice'
        });
      } catch (invoiceError) {
        console.error('Failed to create invoice:', invoiceError);
        // Continue even if invoice creation fails
      }
    }
    
    // Create notifications for both provider and client
    const updater = await UserModel.getById(req.user.id);
    
    await NotificationModel.create({
      user_id: work.provider_id,
      title: 'Work Status Updated',
      message: `The status of your work "${work.job_title || work.skill_name || work.material_title}" has been updated to ${status} ${updater.id === work.provider_id ? '' : `by ${updater.name}`}`,
      type: 'work_status',
      reference_id: parseInt(id),
      reference_type: 'work_assignment'
    });
    
    if (work.provider_id !== work.client_id) {
      await NotificationModel.create({
        user_id: work.client_id,
        title: 'Work Status Updated',
        message: `The status of your work "${work.job_title || work.skill_name || work.material_title}" has been updated to ${status} ${updater.id === work.client_id ? '' : `by ${updater.name}`}`,
        type: 'work_status',
        reference_id: parseInt(id),
        reference_type: 'work_assignment'
      });
    }
    
    res.json({ 
      message: 'Work status updated successfully',
      status
    });
  } catch (error) {
    console.error('Update work status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get work assignments where user is provider
export const getProviderWorks = async (req, res) => {
  try {
    const works = await WorkModel.getByProviderId(req.user.id);
    res.json(works);
  } catch (error) {
    console.error('Get provider works error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get work assignments where user is client
export const getClientWorks = async (req, res) => {
  try {
    const works = await WorkModel.getByClientId(req.user.id);
    res.json(works);
  } catch (error) {
    console.error('Get client works error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific work by ID
export const getWorkById = async (req, res) => {
  try {
    const work = await WorkModel.getById(req.params.id);
    
    if (!work) {
      return res.status(404).json({ message: 'Work assignment not found' });
    }
    
    // Check if user is either provider or client
    if (work.provider_id !== req.user.id && work.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this work assignment' });
    }
    
    res.json(work);
  } catch (error) {
    console.error('Get work by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
