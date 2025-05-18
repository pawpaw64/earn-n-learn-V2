
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ListMaterialForm from '@/components/forms/ListMaterialForm';
import { listMaterial } from '@/services/materials';

interface ListMaterialFormWrapperProps {
  onSuccess?: () => void;
}

const ListMaterialFormWrapper: React.FC<ListMaterialFormWrapperProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('You must be logged in to list a material');
        navigate('/');
        return;
      }

      await listMaterial(formData);
      toast.success('Material listed successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error listing material:', error);
      toast.error('Failed to list material. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ListMaterialForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading} 
    />
  );
};

export default ListMaterialFormWrapper;
