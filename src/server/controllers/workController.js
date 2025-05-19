
import WorkModel from '../models/workModel.js';
import ApplicationModel from '../models/applicationModel.js';
import ContactModel from '../models/contactModel.js';
import NotificationModel from '../models/notificationModel.js';

// Create work assignment from job application
export const createWorkFromApplication = async (req, res) => {
  const { application_id } = req.body;
  
  if (!application_id) {
    return res.status(400).json({ message: 'Application ID is required' });
  }
  
  try {
    // Get application to verify 
    const application = await ApplicationModel.getApplicationById(application_id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user is the job poster
    if (application.job_user_id !== req.user.id) {
      return res.status(403).json({ message: 'Only job poster can create work from application' });
    }
    
    // Create work assignment
    const workId = await WorkModel.createFromJobApplication(
      application_id, 
      application.user_id, // applicant becomes provider
      req.user.id // job poster becomes client
    );
    
    // Update application status
    await ApplicationModel.updateStatus(application_id, 'Accepted');
    
    // Create notifications for both parties
    await NotificationModel.create({
      user_id: application.user_id,
      title: 'Application Accepted',
      message: `Your application for "${application.job_title}" has been accepted and work has been created`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    await NotificationModel.create({
      user_id: req.user.id,
      title: 'Work Created',
      message: `You've created a work assignment for "${application.job_title}"`,
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create work assignment from skill contact
export const createWorkFromSkillContact = async (req, res) => {
  const { contact_id } = req.body;
  
  if (!contact_id) {
    return res.status(400).json({ message: 'Contact ID is required' });
  }
  
  try {
    // Get contact to verify
    const contact = await ContactModel.getSkillContactById(contact_id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Skill contact not found' });
    }
    
    // Check if user is the skill provider
    if (contact.provider_id !== req.user.id) {
      return res.status(403).json({ message: 'Only skill provider can create work from contact' });
    }
    
    // Create work assignment
    const workId = await WorkModel.createFromSkillContact(
      contact_id,
      req.user.id, // skill provider becomes provider
      contact.user_id // contact initiator becomes client
    );
    
    // Update contact status
    await ContactModel.updateSkillContactStatus(contact_id, 'Agreement Reached');
    
    // Create notifications for both parties
    await NotificationModel.create({
      user_id: contact.user_id,
      title: 'Skill Contact Accepted',
      message: `Your inquiry about "${contact.skill_name}" has been accepted and work has been created`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    await NotificationModel.create({
      user_id: req.user.id,
      title: 'Work Created',
      message: `You've created a work assignment for your skill "${contact.skill_name}"`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    res.status(201).json({ 
      message: 'Work assignment created successfully',
      workId
    });
  } catch (error) {
    console.error('Create work from skill contact error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create work assignment from material contact
export const createWorkFromMaterialContact = async (req, res) => {
  const { contact_id } = req.body;
  
  if (!contact_id) {
    return res.status(400).json({ message: 'Contact ID is required' });
  }
  
  try {
    // Get contact to verify
    const contact = await ContactModel.getMaterialContactById(contact_id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Material contact not found' });
    }
    
    // Check if user is the material seller
    if (contact.seller_id !== req.user.id) {
      return res.status(403).json({ message: 'Only material seller can create work from contact' });
    }
    
    // Create work assignment
    const workId = await WorkModel.createFromMaterialContact(
      contact_id,
      req.user.id, // material seller becomes provider
      contact.user_id // contact initiator becomes client
    );
    
    // Update contact status
    await ContactModel.updateMaterialContactStatus(contact_id, 'Agreement Reached');
    
    // Create notifications for both parties
    await NotificationModel.create({
      user_id: contact.user_id,
      title: 'Material Contact Accepted',
      message: `Your inquiry about "${contact.title}" has been accepted and work has been created`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    await NotificationModel.create({
      user_id: req.user.id,
      title: 'Work Created',
      message: `You've created a work assignment for your material "${contact.title}"`,
      type: 'work',
      reference_id: workId,
      reference_type: 'work_assignment'
    });
    
    res.status(201).json({ 
      message: 'Work assignment created successfully',
      workId
    });
  } catch (error) {
    console.error('Create work from material contact error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    // Get work to verify ownership
    const work = await WorkModel.getById(id);
    
    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }
    
    // Check if user is involved in this work
    if (work.provider_id !== req.user.id && work.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this work' });
    }
    
    // Update work with notes if provided
    let updated;
    if (status === 'Completed') {
      updated = await WorkModel.complete(id, notes);
    } else {
      updated = await WorkModel.updateStatus(id, status, notes);
    }
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update work status' });
    }
    
    // Create notification for the other party
    const otherUserId = (req.user.id === work.provider_id) ? work.client_id : work.provider_id;
    const workTitle = work.job_title || work.skill_name || work.material_title || 'Work';
    
    await NotificationModel.create({
      user_id: otherUserId,
      title: `Work ${status}`,
      message: `Work for "${workTitle}" has been updated to: ${status}`,
      type: 'work_status',
      reference_id: parseInt(id),
      reference_type: 'work_assignment'
    });
    
    res.json({ 
      message: 'Work status updated successfully',
      status
    });
  } catch (error) {
    console.error('Update work status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get works where user is provider
export const getProviderWorks = async (req, res) => {
  try {
    const works = await WorkModel.getByProviderId(req.user.id);
    res.json(works);
  } catch (error) {
    console.error('Get provider works error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get works where user is client
export const getClientWorks = async (req, res) => {
  try {
    const works = await WorkModel.getByClientId(req.user.id);
    res.json(works);
  } catch (error) {
    console.error('Get client works error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get work by ID
export const getWorkById = async (req, res) => {
  try {
    const work = await WorkModel.getById(req.params.id);
    
    if (!work) {
      return res.status(404).json({ message: 'Work not found' });
    }
    
    // Check if user is involved in this work
    if (work.provider_id !== req.user.id && work.client_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this work' });
    }
    
    res.json(work);
  } catch (error) {
    console.error('Get work by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
