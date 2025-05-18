
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ShareSkillForm from '@/components/forms/ShareSkillForm';
import { shareSkill } from '@/services/skills';

interface ShareSkillFormWrapperProps {
  onSuccess?: () => void;
}

const ShareSkillFormWrapper: React.FC<ShareSkillFormWrapperProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('You must be logged in to share a skill');
        navigate('/');
        return;
      }

      await shareSkill(formData);
      toast.success('Skill shared successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error sharing skill:', error);
      toast.error('Failed to share skill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ShareSkillForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading} 
    />
  );
};

export default ShareSkillFormWrapper;
