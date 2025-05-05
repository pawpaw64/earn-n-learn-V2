import SkillModel from '../models/skillModel.js';

// Get all skills in marketplace
export async function getAllSkills(req, res) {
  try {
    const excludeUserId = req.query.excludeUserId;
    let skills;
    
    if (excludeUserId) {
      skills = await SkillModel.getAllExcludingUser(excludeUserId);
    } else {
      skills = await SkillModel.getAllSkills();
    }
    
    res.json(skills);
  } catch (error) {
    console.error('Get all skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get skill by ID
export async function getSkillById(req, res) {
  try {
    const skill = await SkillModel.getSkillById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Create new skill listing
export async function createSkill(req, res) {
  const { skill_name, description, pricing, availability } = req.body;
  
  if (!skill_name || !description) {
    return res.status(400).json({ message: 'Please provide skill name and description' });
  }
  
  try {
    const skillId = await SkillModel.createSkill({
      user_id: req.user.id,
      skill_name,
      description,
      pricing,
      availability
    });
    
    res.status(201).json({ 
      skillId,
      message: 'Skill posted successfully' 
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update skill
export async function updateSkill(req, res) {
  try {
    const skill = await SkillModel.getSkillById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    if (skill.user_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    const updated = await SkillModel.updateSkill(req.params.id, req.body);
    res.json(updated ? { message: 'Skill updated' } : { message: 'Update failed' });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete skill
export async function deleteSkill(req, res) {
  try {
    const skill = await SkillModel.getSkillById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    if (skill.user_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    const deleted = await SkillModel.deleteSkill(req.params.id);
    res.json(deleted ? { message: 'Skill deleted' } : { message: 'Deletion failed' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get user's skills
export async function getUserSkills(req, res) {
  try {
    const skills = await SkillModel.getUserSkills(req.user.id);
    res.json(skills);
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// REMOVE the export block at the bottom completely