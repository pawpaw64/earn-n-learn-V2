
import MaterialModel from '../models/materialModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/materials/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'material-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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
  const { title, description, conditions, price, availability } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Please provide title and description' });
  }
  
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/materials/${req.file.filename}`;
      console.log('Image uploaded:', imageUrl);
    }

    const materialData = {
      user_id: req.user.id,
      title,
      description,
      conditions,
      price,
      availability,
      image_url: imageUrl
    };

    console.log('Creating material with data:', materialData);
    const result = await MaterialModel.create(materialData);
    
    res.status(201).json({ 
      materialId: result.id,
      message: 'Material posted successfully',
      image_url: result.image_url
    });
  } catch (error) {
    // Clean up uploaded file if material creation failed
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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
    
    const updateData = { ...req.body };
    let newImageUrl = null;
    
    if (req.file) {
      newImageUrl = `/uploads/materials/${req.file.filename}`;
      updateData.image_url = newImageUrl;
      
      // Delete old image if it exists
      if (material.image_url) {
        const oldImagePath = path.join(process.cwd(), 'public', material.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    const result = await MaterialModel.update(req.params.id, updateData);
    
    if (!result.success) {
      // Clean up new image if update failed
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: 'Update failed' });
    }
    
    res.json({ 
      message: 'Material updated',
      image_url: result.image_url || material.image_url
    });
  } catch (error) {
    // Clean up new image if error occurred
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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
    
    // Delete associated image file
    if (material.image_url) {
      const imagePath = path.join(process.cwd(), 'uploads', 'materials', path.basename(material.image_url));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
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

// Upload material image
export async function uploadMaterialImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/materials/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload material image error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
}

// Check if material can be deleted
export async function checkMaterialDeletePermission(req, res) {
  try {
    res.json({ canDelete: true });
  } catch (error) {
    console.error('Check material delete permission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Export multer middleware
export const uploadMaterialImageMiddleware = upload.single('image');
