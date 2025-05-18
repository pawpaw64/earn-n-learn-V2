
import ContactModel from '../models/contactModel.js';
import SkillModel from '../models/skillModel.js';
import MaterialModel from '../models/materialModel.js';
import NotificationModel from '../models/notificationModel.js';
import UserModel from '../models/userModel.js';

// Submit skill contact
export const submitSkillContact = async (req, res) => {
  const { skill_id, message } = req.body;
  
  if (!skill_id) {
    return res.status(400).json({ message: 'Skill ID is required' });
  }
  
  try {
   
    // Check if skill exists
    const skill = await SkillModel.getById(skill_id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found'});
    }
    
    // Check if user is contacting their own skill
    if (skill.user_id === req.user.id) {
      
      return res.status(400).json({ message: 'Cannot contact your own skill posting' });
    }
    console.log('Contacting skill:', skill_id, 'by user:', req.user.id);
    // Create contact
    const contactId = await ContactModel.createSkillContact({
      skill_id,
      user_id: req.user.id,
      message: message || ''
    });

    // Get skill provider and contact initiator details
    const skillProvider = await UserModel.getById(skill.user_id);
    const contactInitiator = await UserModel.getById(req.user.id);
    
    // Create notification for skill provider
    await NotificationModel.create({
      user_id: skill.user_id,
      title: 'New Skill Inquiry',
      message: `${contactInitiator.name} is interested in your skill: ${skill.skill_name}`,
      type: 'contact',
      reference_id: contactId,
      reference_type: 'skill_contact'
    });
    
    // Create notification for contact initiator
    await NotificationModel.create({
      user_id: req.user.id,
      title: 'Inquiry Sent',
      message: `Your message about "${skill.skill_name}" has been sent to ${skillProvider.name}`,
      type: 'contact',
      reference_id: contactId,
      reference_type: 'skill_contact'
    });
    
    res.status(201).json({ 
      message: 'Contact request sent successfully',
      contactId
    });
  } catch (error) {
    console.error('Submit skill contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit material contact
export const submitMaterialContact = async (req, res) => {
  const { material_id, message } = req.body;
  
  if (!material_id) {
    return res.status(400).json({ message: 'Material ID is required' });
  }
  
  try {
    // Check if material exists
    const material = await MaterialModel.getById(material_id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if user is contacting their own material
    if (material.user_id === req.user.id) {
      return res.status(400).json({ message: 'Cannot contact about your own material posting' });
    }
    
    // Create contact
    const contactId = await ContactModel.createMaterialContact({
      material_id,
      user_id: req.user.id,
      message: message || ''
    });

    // Get material seller and contact initiator details
    const materialSeller = await UserModel.getById(material.user_id);
    const contactInitiator = await UserModel.getById(req.user.id);
    
    // Create notification for material seller
    await NotificationModel.create({
      user_id: material.user_id,
      title: 'New Material Inquiry',
      message: `${contactInitiator.name} is interested in your material: ${material.title}`,
      type: 'contact',
      reference_id: contactId,
      reference_type: 'material_contact'
    });
    
    // Create notification for contact initiator
    await NotificationModel.create({
      user_id: req.user.id,
      title: 'Inquiry Sent',
      message: `Your message about "${material.title}" has been sent to ${materialSeller.name}`,
      type: 'contact',
      reference_id: contactId,
      reference_type: 'material_contact'
    });
    
    res.status(201).json({ 
      message: 'Contact request sent successfully',
      contactId
    });
  } catch (error) {
    console.error('Submit material contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update skill contact status
export const updateSkillContactStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const validStatuses = ['Contact Initiated', 'Responded', 'In Discussion', 'Agreement Reached', 'Declined', 'Completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    // Get the skill contact
    const skillContacts = await ContactModel.getToUserSkills(req.user.id);
    const contact = skillContacts.find(c => c.id === parseInt(id));
    
    if (!contact) {
      return res.status(404).json({ message: 'Skill contact not found or you are not authorized' });
    }
    
    // Update status
    const updated = await ContactModel.updateSkillContactStatus(id, status);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update contact status' });
    }
    
    // Create notification for contact initiator
    await NotificationModel.create({
      user_id: contact.user_id,
      title: 'Skill Inquiry Update',
      message: `Your inquiry about "${contact.skill_name}" status has been updated to: ${status}`,
      type: 'contact_status',
      reference_id: parseInt(id),
      reference_type: 'skill_contact'
    });
    
    res.json({ 
      message: 'Contact status updated successfully',
      status
    });
  } catch (error) {
    console.error('Update skill contact status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update material contact status
export const updateMaterialContactStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  const validStatuses = ['Contact Initiated', 'Responded', 'In Discussion', 'Agreement Reached', 'Declined', 'Completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  try {
    // Get the material contact
    const materialContacts = await ContactModel.getToUserMaterials(req.user.id);
    const contact = materialContacts.find(c => c.id === parseInt(id));
    
    if (!contact) {
      return res.status(404).json({ message: 'Material contact not found or you are not authorized' });
    }
    
    // Update status
    const updated = await ContactModel.updateMaterialContactStatus(id, status);
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update contact status' });
    }
    
    // Create notification for contact initiator
    await NotificationModel.create({
      user_id: contact.user_id,
      title: 'Material Inquiry Update',
      message: `Your inquiry about "${contact.title}" status has been updated to: ${status}`,
      type: 'contact_status',
      reference_id: parseInt(id),
      reference_type: 'material_contact'
    });
    
    res.json({ 
      message: 'Contact status updated successfully',
      status
    });
  } catch (error) {
    console.error('Update material contact status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's initiated skill contacts
export const getUserSkillContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.getSkillContactsByUserId(req.user.id);
    res.json(contacts);
  } catch (error) {
    console.error('Get user skill contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's initiated material contacts
export const getUserMaterialContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.getMaterialContactsByUserId(req.user.id);
    res.json(contacts);
  } catch (error) {
    console.error('Get user material contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get contacts to user's skills
export const getSkillContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.getToUserSkills(req.user.id);
    res.json(contacts);
  } catch (error) {
    console.error('Get skill contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get contacts to user's materials
export const getMaterialContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.getToUserMaterials(req.user.id);
    res.json(contacts);
  } catch (error) {
    console.error('Get material contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
