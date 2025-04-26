
const SkillModel = require('../models/skillModel');

// Get all skills in marketplace
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await SkillModel.getAll();
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get skill by ID
exports.getSkillById = async (req, res) => {
  try {
    const skill = await SkillModel.getById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new skill listing
exports.createSkill = async (req, res) => {
  const { skill_name, description, pricing, availability } = req.body;
  
  // Validation
  if (!skill_name || !description) {
    return res.status(400).json({ message: 'Please provide skill name and description' });
  }
  
  try {
    const skillId = await SkillModel.create({
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update skill
exports.updateSkill = async (req, res) => {
  try {
    // First check if skill exists and belongs to user
    const skill = await SkillModel.getById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (skill.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this skill' });
    }
    
    const updated = await SkillModel.update(req.params.id, req.body);
    if (updated) {
      res.json({ message: 'Skill updated successfully' });
    } else {
      res.status(400).json({ message: 'Skill update failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete skill
exports.deleteSkill = async (req, res) => {
  try {
    // First check if skill exists and belongs to user
    const skill = await SkillModel.getById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (skill.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this skill' });
    }
    
    const deleted = await SkillModel.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Skill deleted successfully' });
    } else {
      res.status(400).json({ message: 'Skill deletion failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's skills in marketplace
exports.getUserSkills = async (req, res) => {
  try {
    const skills = await SkillModel.getUserSkills(req.user.id);
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
