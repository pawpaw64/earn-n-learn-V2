import UserModel from '../models/userModel.js';
import JobModel from '../models/jobModel.js';
import SkillModel from '../models/skillModel.js';
import MaterialModel from '../models/materialModel.js';

class RecommendationController {
  // Enhanced skill matching with case-insensitive and fuzzy matching
  static calculateSkillMatch(userSkills, itemSkills) {
    if (!userSkills?.length || !itemSkills?.length) return 0;
    
    const userSkillsLower = userSkills.map(s => {
      const skillName = s.name?.toLowerCase() || s.skill_name?.toLowerCase() || '';
      return skillName.trim();
    }).filter(Boolean);
    
    const itemSkillsLower = itemSkills.map(s => s.toLowerCase().trim()).filter(Boolean);
    
    const matches = itemSkillsLower.filter(skill => 
      userSkillsLower.some(userSkill => {
        // Exact match
        if (userSkill === skill) return true;
        // Partial match (both directions)
        if (userSkill.includes(skill) || skill.includes(userSkill)) return true;
        // Fuzzy match for similar skills (e.g., "js" and "javascript")
        return this.isSimilarSkill(userSkill, skill);
      })
    );
    
    return Math.round((matches.length / itemSkillsLower.length) * 100);
  }

  // Helper method for fuzzy skill matching
  static isSimilarSkill(skill1, skill2) {
    const synonyms = {
      'javascript': ['js', 'node', 'nodejs'],
      'python': ['py'],
      'typescript': ['ts'],
      'react': ['reactjs'],
      'vue': ['vuejs'],
      'angular': ['angularjs'],
      'css': ['css3', 'styling'],
      'html': ['html5', 'markup'],
    };

    for (const [main, alts] of Object.entries(synonyms)) {
      if ((skill1.includes(main) || alts.some(alt => skill1.includes(alt))) &&
          (skill2.includes(main) || alts.some(alt => skill2.includes(alt)))) {
        return true;
      }
    }
    return false;
  }

  // Calculate category match score (higher weight in final recommendation)
  static calculateCategoryMatch(userCategories, itemCategory) {
    if (!userCategories?.length || !itemCategory) return 0;
    
    // Direct category match gets highest score
    if (userCategories.includes(itemCategory)) {
      return 100;
    }
    
    // Related categories get medium score
    const relatedCategories = this.getRelatedCategories(itemCategory);
    if (relatedCategories.some(cat => userCategories.includes(cat))) {
      return 60;
    }
    
    return 0;
  }

  // Final recommendation score combining category and skill matches
  static calculateFinalScore(categoryMatch, skillMatch) {
    // Category matching has 70% weight, skill matching has 30% weight
    return Math.round((categoryMatch * 0.7) + (skillMatch * 0.3));
  }

  // Extract skills from text descriptions
  static extractSkillsFromText(text, predefinedSkills) {
    if (!text || !predefinedSkills?.length) return [];
    
    const textLower = text.toLowerCase();
    return predefinedSkills.filter(skill => 
      textLower.includes(skill.name.toLowerCase())
    ).map(skill => skill.name);
  }

  // Enhanced job recommendations with two-stage filtering
  static async getJobRecommendations(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user data
      const userSkills = await UserModel.getUserSkills(userId);
      const predefinedSkills = await UserModel.getPredefinedSkills();
      
      if (!userSkills?.length) {
        return res.json([]);
      }
      
      // Stage 1: Determine user's primary categories
      const userCategories = [...new Set(userSkills.map(s => s.category).filter(Boolean))];
      
      // Get all jobs excluding user's own
      const jobs = await JobModel.getAllExcludingUser(userId);
      
      // Stage 2: Calculate recommendations with two-stage filtering
      const recommendations = jobs.map(job => {
        // Category matching (Stage 1)
        const categoryMatch = this.calculateCategoryMatch(userCategories, job.category);
        
        // Skill matching within category (Stage 2)
        const jobSkills = [
          ...this.extractSkillsFromText(job.description, predefinedSkills),
          ...this.extractSkillsFromText(job.requirements, predefinedSkills)
        ];
        const skillMatch = this.calculateSkillMatch(userSkills, jobSkills);
        
        // Final weighted score
        const finalScore = this.calculateFinalScore(categoryMatch, skillMatch);
        
        return {
          ...job,
          matchPercentage: finalScore,
          categoryMatch,
          skillMatch,
          type: 'job'
        };
      });
      
      // Sort by final score and return top 10
      const topRecommendations = recommendations
        .filter(rec => rec.matchPercentage > 10) // Minimum threshold
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10);
      
      res.json(topRecommendations);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch job recommendations' });
    }
  }

  // Enhanced skill recommendations with category-first approach
  static async getSkillRecommendations(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user data
      const userSkills = await UserModel.getUserSkills(userId);
      const allSkills = await SkillModel.getAllExcludingUser(userId);
      
      if (!userSkills?.length) {
        return res.json([]);
      }
      
      // Stage 1: Determine user's primary categories
      const userCategories = [...new Set(userSkills.map(s => s.category).filter(Boolean))];
      
      // Stage 2: Calculate recommendations
      const recommendations = allSkills.map(skill => {
        // Category matching (primary factor)
        const categoryMatch = this.calculateCategoryMatch(userCategories, skill.category);
        
        // Skill complementarity (secondary factor)
        const userSkillNames = userSkills.map(s => s.name?.toLowerCase()).filter(Boolean);
        const hasThisSkill = userSkillNames.includes(skill.skill?.toLowerCase());
        
        // Don't recommend skills the user already has
        if (hasThisSkill) {
          return { ...skill, matchPercentage: 0, type: 'skill' };
        }
        
        // Calculate skill complementarity within category
        let skillComplementarity = 0;
        if (categoryMatch > 0) {
          // Higher score for skills that complement existing skills in the same category
          skillComplementarity = 40;
        }
        
        // Final weighted score
        const finalScore = this.calculateFinalScore(categoryMatch, skillComplementarity);
        
        return {
          ...skill,
          matchPercentage: finalScore,
          categoryMatch,
          skillComplementarity,
          type: 'skill'
        };
      });
      
      // Sort by final score and return top 10
      const topRecommendations = recommendations
        .filter(rec => rec.matchPercentage > 10)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 10);
      
      res.json(topRecommendations);
    } catch (error) {
      console.error('Error fetching skill recommendations:', error);
      res.status(500).json({ error: 'Failed to fetch skill recommendations' });
    }
  }

  // Enhanced material recommendations with category-first approach
  static async getMaterialRecommendations(req, res) {
    try {
      const userId = req.user.id;
      
      // Get user data
      const userSkills = await UserModel.getUserSkills(userId);
      const predefinedSkills = await UserModel.getPredefinedSkills();
      
      if (!userSkills?.length) {
        return res.json([]);
      }
      
      // Stage 1: Determine user's primary categories
      const userCategories = [...new Set(userSkills.map(s => s.category).filter(Boolean))];
      
      // Get all materials excluding user's own
      const materials = await MaterialModel.getAllExcludingUser(userId);
      
      // Stage 2: Calculate recommendations
      const recommendations = materials.map(material => {
        // Category matching (primary factor)
        const categoryMatch = this.calculateCategoryMatch(userCategories, material.category);
        
        // Skill relevance within category (secondary factor)
        const materialSkills = this.extractSkillsFromText(material.description, predefinedSkills);
        const skillMatch = this.calculateSkillMatch(userSkills, materialSkills);
        
        // Final weighted score
        const finalScore = this.calculateFinalScore(categoryMatch, skillMatch);
        
        return {
          ...material,
          matchPercentage: finalScore,
          categoryMatch,
          skillMatch,
          type: 'material'
        };
      });
      
      // Sort by final score and return top 10
      const topRecommendations = recommendations
        .filter(rec => rec.matchPercentage > 10)
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
    
    // Check if profile is complete
    const isProfileComplete = await UserModel.isProfileComplete(userId);
    if (!isProfileComplete) {
      return res.json({ jobs: [], skills: [], materials: [], profileIncomplete: true });
    }
    
    // Get user skills
    const userSkills = await UserModel.getUserSkills(userId);
    if (!userSkills?.length) {
      return res.json({ jobs: [], skills: [], materials: [], profileIncomplete: true });
    }
    
    const predefinedSkills = await UserModel.getPredefinedSkills();
    
    // Stage 1: Determine user's primary categories
    const userCategories = [...new Set(userSkills.map(s => s.category).filter(Boolean))];
    
    // Get all items
    const [jobs, skills, materials] = await Promise.all([
      JobModel.getAllExcludingUser(userId),
      SkillModel.getAllExcludingUser(userId),
      MaterialModel.getAllExcludingUser(userId)
    ]);
    
    // Enhanced job recommendations with two-stage filtering
    const jobRecommendations = jobs.map(job => {
      const categoryMatch = RecommendationController.calculateCategoryMatch(userCategories, job.category);
      const jobSkills = [
        ...RecommendationController.extractSkillsFromText(job.description, predefinedSkills),
        ...RecommendationController.extractSkillsFromText(job.requirements, predefinedSkills)
      ];
      const skillMatch = RecommendationController.calculateSkillMatch(userSkills, jobSkills);
      const finalScore = RecommendationController.calculateFinalScore(categoryMatch, skillMatch);
      return { ...job, matchPercentage: finalScore, categoryMatch, skillMatch, type: 'job' };
    }).filter(rec => rec.matchPercentage > 10)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
    
    // Enhanced skill recommendations with category-first approach
    const skillRecommendations = skills.map(skill => {
      const categoryMatch = RecommendationController.calculateCategoryMatch(userCategories, skill.category);
      const userSkillNames = userSkills.map(s => s.name?.toLowerCase()).filter(Boolean);
      const hasThisSkill = userSkillNames.includes(skill.skill?.toLowerCase());
      
      if (hasThisSkill) {
        return { ...skill, matchPercentage: 0, type: 'skill' };
      }
      
      const skillComplementarity = categoryMatch > 0 ? 40 : 0;
      const finalScore = RecommendationController.calculateFinalScore(categoryMatch, skillComplementarity);
      return { ...skill, matchPercentage: finalScore, categoryMatch, skillComplementarity, type: 'skill' };
    }).filter(rec => rec.matchPercentage > 10)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);
    
    // Enhanced material recommendations with category-first approach
    const materialRecommendations = materials.map(material => {
      const categoryMatch = RecommendationController.calculateCategoryMatch(userCategories, material.category);
      const materialSkills = RecommendationController.extractSkillsFromText(material.description, predefinedSkills);
      const skillMatch = RecommendationController.calculateSkillMatch(userSkills, materialSkills);
      const finalScore = RecommendationController.calculateFinalScore(categoryMatch, skillMatch);
      return { ...material, matchPercentage: finalScore, categoryMatch, skillMatch, type: 'material' };
    }).filter(rec => rec.matchPercentage > 10)
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
  // Helper method to get related categories (updated for new 5-category system)
  static getRelatedCategories(category) {
    const categoryRelations = {
      'Academic Help': ['Coding', 'Design'], // Academic overlaps with technical skills
      'Coding': ['Academic Help', 'Freelance'], // Coding can be academic or freelance
      'Design': ['Academic Help', 'Marketing', 'Freelance'], // Design spans multiple areas
      'Marketing': ['Design', 'Freelance'], // Marketing often needs design and is freelance work
      'Freelance': ['Coding', 'Design', 'Marketing'] // Freelance encompasses many skill types
    };
    
    return categoryRelations[category] || [];
  }
}

export default RecommendationController;