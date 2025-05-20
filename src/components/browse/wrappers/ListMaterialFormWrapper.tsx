
import React, { useState } from "react";
import ListMaterialForm from "@/components/forms/ListMaterialForm";
import { MaterialType } from "@/types/marketplace";
import { createMaterial, updateMaterial } from "@/services/materials";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ListMaterialFormWrapperProps {
  initialData?: MaterialType;
}

export const ListMaterialFormWrapper: React.FC<ListMaterialFormWrapperProps> = ({ 
  initialData 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      
      if (initialData?.id) {
        // Update existing material
        await updateMaterial(initialData.id, formData);
        toast.success("Material updated successfully");
      } else {
        // Create new material
        await createMaterial(formData);
        toast.success("Material listed successfully");
      }
      
      // Redirect to the browse page
      navigate("/dashboard/browse");
    } catch (error) {
      console.error("Error creating/updating material:", error);
      toast.error("Failed to save material listing");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ListMaterialForm 
      initialData={initialData} 
      onSubmit={handleSubmit} 
      isLoading={isLoading} 
    />
  );
};
