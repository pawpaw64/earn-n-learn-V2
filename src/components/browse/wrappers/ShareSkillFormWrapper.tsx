
import React, { useState } from 'react';
import ShareSkillForm from '../../forms/ShareSkillForm';
import { useToast } from '@/hooks/use-toast';
import { createSkill, updateSkill } from '@/services/skills';
import { useNavigate } from 'react-router-dom';

const ShareSkillFormWrapper = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const response = await createSkill(formData);
      toast({
        title: "Success!",
        description: "Skill has been shared successfully",
      });
      navigate('/dashboard/browse');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to share skill",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-4">
      <ShareSkillForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default ShareSkillFormWrapper;
