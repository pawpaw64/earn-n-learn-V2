import UserModel from '../models/userModel.js';
import JobModel from '../models/jobModel.js';
import SkillModel from '../models/skillModel.js';
import MaterialModel from '../models/materialModel.js';

class RecommendationController {
  // Calculate skill match percentage between user skills and item requirements
  static calculateSkillMatch(userSkills, itemSkills) {
    if (!userSkills?.length || !itemSkills?.length) return 0;
    
    const userSkillsLower = userSkills.map(s => s.name?.toLowerCase() || s.skill_name?.toLowerCase());
    const itemSkillsLower = itemSkills.map(s => s.toLowerCase());
    
    const matches = itemSkillsLower.filter(skill => 
      userSkillsLower.some(userSkill => 
        userSkill.includes(skill) || skill.includes(userSkill)
      )
    );
    
    return Math.round((matches.length / itemSkillsLower.length) * 100);
  }

  // Extract skills from text descriptions
  static extractSkillsFromText(text, predefinedSkills) {
    if (!text || !predefinedSkills?.length) return [];
    
    const textLower = text.toLowerCase();
    return predefinedSkills.filter(skill => 
      textLower.includes(skill.name.toLowerCase())
    ).map(skill => skill.name);
  }

  // Get job recommendations
  static async getJobRecommendations(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user skills
      const userSkills = await UserModel.getUserSkills(userId);
      const predefinedSkills = await UserModel.getPredefinedSkills();
      
      // Get all jobs excluding user's own
      const jobs = await JobModel.getAllExcludingUser(userId);
      
      // Calculate match percentages
      const recommendations = jobs.map(job => {
        // Extract skills from job description and requirements
        const jobSkills = [
          ...this.extractSkillsFromText(job.description, predefinedSkills),
          ...this.extractSkillsFromText(job.requirements, predefinedSkills)
        ];
        
        const matchPercentage = this.calculateSkillMatch(userSkills, jobSkills);
        
        return {
          ...job,
          matchPercentage,
          type: 'job'
        };
      });
      
      // Sort by match percentage and return top 10
      const topRecommendations = recommendations
        .filter(rec => rec.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10);
      
      res.json(topRecommendations);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch job recommendations' });
    }
  }

  // Get skill recommendations
  static async getSkillRecommendations(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user skills and predefined skills
      const userSkills = await UserModel.getUserSkills(userId);
      const predefinedSkills = await UserModel.getPredefinedSkills();
      const allSkills = await SkillModel.getAllExcludingUser(userId);
      
      // Get skill categories user already has
      const userCategories = [...new Set(userSkills.map(s => s.category).filter(Boolean))];
      
      // Find complementary skills
      const recommendations = allSkills.map(skill => {
        // Check if skill is in same category as user's skills
        const skillInfo = predefinedSkills.find(ps => 
          ps.name.toLowerCase() === skill.skill.toLowerCase()
        );
        
        let matchPercentage = 0;
        
        if (skillInfo && userCategories.includes(skillInfo.category)) {
          matchPercentage = 75; // High match for same category
        } else if (skillInfo) {
          // Check for related categories
          const relatedCategories = this.getRelatedCategories(skillInfo.category);
          if (relatedCategories.some(cat => userCategories.includes(cat))) {
            matchPercentage = 50; // Medium match for related categories
          } else {
            matchPercentage = 25; // Low match for different categories
          }
        }
        
        return {
          ...skill,
          matchPercentage,
          type: 'skill'
        };
      });
      
      // Sort by match percentage and return top 10
      const topRecommendations = recommendations
        .filter(rec => rec.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10);
      
      res.json(topRecommendations);
    } catch (error) {
      console.error('Error fetching skill recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch skill recommendations' });
    }
  }

  // Get material recommendations
  static async getMaterialRecommendations(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user skills
      const userSkills = await UserModel.getUserSkills(userId);
      const predefinedSkills = await UserModel.getPredefinedSkills();
      
      // Get all materials excluding user's own
      const materials = await MaterialModel.getAllExcludingUser(userId);
      
      // Calculate match percentages
      const recommendations = materials.map(material => {
        // Extract skills from material description
        const materialSkills = this.extractSkillsFromText(material.description, predefinedSkills);
        
        const matchPercentage = this.calculateSkillMatch(userSkills, materialSkills);
        
        return {
          ...material,
          matchPercentage,
          type: 'material'
        };
      });
      
      // Sort by match percentage and return top 10
      const topRecommendations = recommendations
        .filter(rec => rec.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10);
      
      res.json(topRecommendations);
    } catch (error) {
      console.error('Error fetching material recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch material recommendations' });
    }
  }

  // Get all recommendations
static async getAllRecommendations(req, res) {
  try {
    const userId = req.user.id;
    
    // Get user skills
    const userSkills = await UserModel.getUserSkills(userId);
    if (!userSkills?.length) {
      return res.json({ jobs: [], skills: [], materials: [] });
    }
    
    const predefinedSkills = await UserModel.getPredefinedSkills();
    
    // Get all items
    const [jobs, skills, materials] = await Promise.all([
      JobModel.getAllExcludingUser(userId),
      SkillModel.getAllExcludingUser(userId),
      MaterialModel.getAllExcludingUser(userId)
    ]);
    
    // Calculate job recommendations - use arrow functions
    const jobRecommendations = jobs.map(job => {
      const jobSkills = [
        ...RecommendationController.extractSkillsFromText(job.description, predefinedSkills),
        ...RecommendationController.extractSkillsFromText(job.requirements, predefinedSkills)
      ];
      const matchPercentage = RecommendationController.calculateSkillMatch(userSkills, jobSkills);
      return { ...job, matchPercentage, type: 'job' };
    }).filter(rec => rec.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
    
    // Calculate skill recommendations
    const userCategories = [...new Set(userSkills.map(s => s.category).filter(Boolean))];
    const skillRecommendations = skills.map(skill => {
      const skillInfo = predefinedSkills.find(ps => 
        ps.name.toLowerCase() === skill.skill.toLowerCase()
      );
      
      let matchPercentage = 0;
      if (skillInfo && userCategories.includes(skillInfo.category)) {
        matchPercentage = 75;
      } else if (skillInfo) {
        const relatedCategories = RecommendationController.getRelatedCategories(skillInfo.category);
        if (relatedCategories.some(cat => userCategories.includes(cat))) {
          matchPercentage = 50;
        } else {
          matchPercentage = 25;
        }
      }
      
      return { ...skill, matchPercentage, type: 'skill' };
    }).filter(rec => rec.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
    
    // Calculate material recommendations
    const materialRecommendations = materials.map(material => {
      const materialSkills = RecommendationController.extractSkillsFromText(material.description, predefinedSkills);
      const matchPercentage = RecommendationController.calculateSkillMatch(userSkills, materialSkills);
      return { ...material, matchPercentage, type: 'material' };
    }).filter(rec => rec.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
    
    res.json({
      jobs: jobRecommendations,
      skills: skillRecommendations,
      materials: materialRecommendations
    });
  } catch (error) {
    console.error('Error fetching all recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}
  // Helper method to get related categories
  static getRelatedCategories(category) {
    const categoryRelations = {
      'Programming': ['Web Development', 'Mobile Development', 'Data Science'],
      'Web Development': ['Programming', 'UI/UX Design'],
      'Mobile Development': ['Programming', 'UI/UX Design'],
      'Data Science': ['Programming', 'Analytics'],
      'UI/UX Design': ['Web Development', 'Mobile Development', 'Graphic Design'],
      'Graphic Design': ['UI/UX Design', 'Creative'],
      'Digital Marketing': ['Analytics', 'Business'],
      'Business': ['Digital Marketing', 'Analytics'],
      'Analytics': ['Data Science', 'Digital Marketing', 'Business']
    };
    
    return categoryRelations[category] || [];
  }
}

export default RecommendationController;