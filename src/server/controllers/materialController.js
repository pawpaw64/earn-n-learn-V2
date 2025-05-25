
import MaterialModel from '../models/materialModel.js';

// Get all materials
export async function getAllMaterials(req, res) {
  try {
    const excludeUserId = req.query.excludeUserId;
    let materials;
    
    if (excludeUserId) {
      materials = await MaterialModel.getAllExcludingUser(excludeUserId);
    } else {
      materials = await MaterialModel.getAll();
    }
    
    res.json(materials);
  } catch (error) {
    console.error('Get all materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get material by ID
export async function getMaterialById(req, res) {
  try {
    const material = await MaterialModel.getById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    console.error('Get material by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Create new material
export async function createMaterial(req, res) {
  const { title, description, condition, price, availability, image_url, type } = req.body;
  
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
      availability,
      image_url,
      type
    });
    
    res.status(201).json({ 
      materialId,
      message: 'Material posted successfully' 
    });
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update material
export async function updateMaterial(req, res) {
  try {
    const material = await MaterialModel.getById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    if (material.user_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    const updated = await MaterialModel.update(req.params.id, req.body);
    res.json(updated ? { message: 'Material updated' } : { message: 'Update failed' });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete material
export async function deleteMaterial(req, res) {
  try {
    const material = await MaterialModel.getById(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    if (material.user_id !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    const deleted = await MaterialModel.remove(req.params.id);
    res.json(deleted ? { message: 'Material deleted' } : { message: 'Deletion failed' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get user's materials
export async function getUserMaterials(req, res) {
  try {
    const materials = await MaterialModel.getUserMaterials(req.user.id);
    res.json(materials);
  } catch (error) {
    console.error('Get user materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
