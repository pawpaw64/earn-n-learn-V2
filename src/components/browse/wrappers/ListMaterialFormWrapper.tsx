
import React, { useState, useEffect } from 'react';
import ListMaterialForm from '../../forms/ListMaterialForm';
import { useToast } from '@/hooks/use-toast';
import { createMaterial, updateMaterial } from '@/services/materials';
import { useNavigate } from 'react-router-dom';

interface ListMaterialFormWrapperProps {
  // The component accepts any props that may be passed to it
}

const ListMaterialFormWrapper: React.FC<ListMaterialFormWrapperProps> = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const response = await createMaterial(formData);
      toast({
        title: "Success!",
        description: "Material has been listed successfully",
      });
      navigate('/dashboard/browse');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to list material",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-4">
      <ListMaterialForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default ListMaterialFormWrapper;
