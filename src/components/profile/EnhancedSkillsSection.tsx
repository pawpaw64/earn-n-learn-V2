import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Search, ChevronDown, Award, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { addUserSkill, removeUserSkill } from '@/services/profile';

interface Skill {
  id: string;
  name: string;
  description?: string;
  acquired_from?: string;
  proficiency_level?: string;
  experience_years?: number;
  certifications?: string;
  user_id: string;
}

interface PredefinedSkill {
  name: string;
  category: string;
  description?: string;
}

interface EnhancedSkillsSectionProps {
  skills: Skill[];
  onSkillsUpdate: () => void;
  isOwnProfile: boolean;
}

const proficiencyLevels = [
  { value: 'Beginner', color: 'bg-gray-100 text-gray-800', icon: '🌱' },
  { value: 'Intermediate', color: 'bg-blue-100 text-blue-800', icon: '📈' },
  { value: 'Advanced', color: 'bg-green-100 text-green-800', icon: '🎯' },
  { value: 'Expert', color: 'bg-purple-100 text-purple-800', icon: '👑' }
];

const skillCategories = [
  'Programming', 'Web Development', 'Database', 'Cloud & DevOps', 
  'Data Science & AI', 'Design', 'Mobile Development', 'Business & Marketing', 
  'Soft Skills', 'Languages', 'Version Control', 'Operating Systems', 
  'Security', 'Networking', 'Backend', 'Architecture', 'Custom'
];

export default function EnhancedSkillsSection({ skills, onSkillsUpdate, isOwnProfile }: EnhancedSkillsSectionProps) {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<PredefinedSkill[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    acquiredFrom: '',
    proficiencyLevel: 'Beginner',
    experienceYears: 0,
    certifications: '',
    isCustom: false
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch skill suggestions based on search term
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 1) {
        try {
          const response = await fetch(`http://localhost:8080/api/users/skills/predefined?search=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.skills || []);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const handleSkillSelection = (skill: PredefinedSkill) => {
    setNewSkill(prev => ({
      ...prev,
      name: skill.name,
      isCustom: false
    }));
    setSearchTerm(skill.name);
    setShowSuggestions(false);
  };

  const handleCustomSkill = () => {
    setNewSkill(prev => ({
      ...prev,
      name: searchTerm,
      isCustom: true
    }));
    setShowSuggestions(false);
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    try {
      const skillData = {
        name: newSkill.name,
        description: newSkill.description,
        acquiredFrom: newSkill.acquiredFrom,
        proficiencyLevel: newSkill.proficiencyLevel,
        experienceYears: newSkill.experienceYears,
        certifications: newSkill.certifications,
        isCustom: newSkill.isCustom
      };

      const response = await addUserSkill(skillData);
      
      if (response.success) {
        toast.success('Skill added successfully!');
        onSkillsUpdate();
        resetForm();
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      const response = await removeUserSkill(skillId);
      
      if (response.success) {
        toast.success('Skill removed successfully!');
        onSkillsUpdate();
      }
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
    }
  };

  const resetForm = () => {
    setNewSkill({
      name: '',
      description: '',
      acquiredFrom: '',
      proficiencyLevel: 'Beginner',
      experienceYears: 0,
      certifications: '',
      isCustom: false
    });
    setSearchTerm('');
    setIsAddingSkill(false);
    setShowSuggestions(false);
  };

  const getProficiencyConfig = (level: string) => {
    return proficiencyLevels.find(p => p.value === level) || proficiencyLevels[0];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Skills & Expertise
        </CardTitle>
        {isOwnProfile && (
          <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Skill Name with Auto-suggestions */}
                <div className="space-y-2">
                  <Label htmlFor="skillName">Skill Name *</Label>
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          ref={searchInputRef}
                          id="skillName"
                          placeholder="Start typing to search skills..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                          className="pl-10"
                        />
                        
                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-y-auto">
                            {suggestions.map((skill, index) => (
                              <div
                                key={index}
                                className="px-3 py-2 hover:bg-accent cursor-pointer border-b last:border-b-0"
                                onClick={() => handleSkillSelection(skill)}
                              >
                                <div className="font-medium">{skill.name}</div>
                                <div className="text-sm text-muted-foreground">{skill.category}</div>
                              </div>
                            ))}
                            
                            {/* Add Custom Skill Option */}
                            {searchTerm && !suggestions.some(s => s.name.toLowerCase() === searchTerm.toLowerCase()) && (
                              <div
                                className="px-3 py-2 hover:bg-accent cursor-pointer border-t bg-muted/50"
                                onClick={handleCustomSkill}
                              >
                                <div className="font-medium text-primary">+ Add "{searchTerm}" as custom skill</div>
                                <div className="text-sm text-muted-foreground">This will be available for other users too</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          {skillCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Proficiency Level */}
                <div className="space-y-2">
                  <Label>Proficiency Level</Label>
                  <Select value={newSkill.proficiencyLevel} onValueChange={(value) => setNewSkill(prev => ({ ...prev, proficiencyLevel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {proficiencyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <span>{level.icon}</span>
                            {level.value}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Years */}
                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    max="50"
                    value={newSkill.experienceYears}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, experienceYears: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your experience with this skill..."
                    value={newSkill.description}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Acquired From */}
                <div className="space-y-2">
                  <Label htmlFor="acquiredFrom">Where did you learn this? (Optional)</Label>
                  <Input
                    id="acquiredFrom"
                    placeholder="e.g., University, Online Course, Self-taught, Work Experience"
                    value={newSkill.acquiredFrom}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, acquiredFrom: e.target.value }))}
                  />
                </div>

                {/* Certifications */}
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications (Optional)</Label>
                  <Textarea
                    id="certifications"
                    placeholder="List any relevant certifications or credentials..."
                    value={newSkill.certifications}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, certifications: e.target.value }))}
                    rows={2}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSkill}>
                    Add Skill
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No skills added yet</p>
            {isOwnProfile && (
              <p className="text-sm">Start building your skill profile by adding your expertise</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {skills.map((skill) => {
              const proficiencyConfig = getProficiencyConfig(skill.proficiency_level || 'Beginner');
              
              return (
                <div key={skill.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{skill.name}</h3>
                        <Badge className={`text-xs ${proficiencyConfig.color}`}>
                          {proficiencyConfig.icon} {skill.proficiency_level || 'Beginner'}
                        </Badge>
                        {skill.experience_years && skill.experience_years > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {skill.experience_years} year{skill.experience_years !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      
                      {skill.description && (
                        <p className="text-muted-foreground text-sm">{skill.description}</p>
                      )}
                      
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {skill.acquired_from && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{skill.acquired_from}</span>
                          </div>
                        )}
                      </div>
                      
                      {skill.certifications && (
                        <div className="text-sm">
                          <span className="font-medium text-muted-foreground">Certifications:</span>
                          <p className="text-muted-foreground mt-1">{skill.certifications}</p>
                        </div>
                      )}
                    </div>
                    
                    {isOwnProfile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}