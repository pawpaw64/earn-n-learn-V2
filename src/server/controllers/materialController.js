
const MaterialModel = require('../models/materialModel');

// Get all materials
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await MaterialModel.getAll();
    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get material by ID
exports.getMaterialById = async (req, res) => {
  try {
    const material = await MaterialModel.getById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new material
exports.createMaterial = async (req, res) => {
  const { title, description, condition, price, availability } = req.body;
  
  // Validation
  if (!title || !description) {
    return res.status(400).json({ message: 'Please provide title and description' });
  }
  
  try {
    const materialId = await MaterialModel.create({
      user_id: req.user.id,
      title,
      description,
      condition,
      price,
      availability
    });
    
    res.status(201).json({ 
      materialId,
      message: 'Material posted successfully' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update material
exports.updateMaterial = async (req, res) => {
  try {
    // First check if material exists and belongs to user
    const material = await MaterialModel.getById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    if (material.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this material' });
    }
    
    const updated = await MaterialModel.update(req.params.id, req.body);
    if (updated) {
      res.json({ message: 'Material updated successfully' });
    } else {
      res.status(400).json({ message: 'Material update failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
  try {
    // First check if material exists and belongs to user
    const material = await MaterialModel.getById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    if (material.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this material' });
    }
    
    const deleted = await MaterialModel.delete(req.params.id);
    if (deleted) {
      res.json({ message: 'Material deleted successfully' });
    } else {
      res.status(400).json({ message: 'Material deletion failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's materials
exports.getUserMaterials = async (req, res) => {
  try {
    const materials = await MaterialModel.getUserMaterials(req.user.id);
    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
