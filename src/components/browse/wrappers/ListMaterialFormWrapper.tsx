
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
  
  const handleSubmit = async (formData: any, imageFile?: File) => {
    try {
      setIsLoading(true);
      
      console.log("Form data received:", formData);
      console.log("Image file received:", imageFile);
      
      if (initialData?.id) {
        // Update existing material
        await updateMaterial({ ...formData, id: initialData.id }, imageFile);
        toast.success("Material updated successfully");
      } else {
        // Create new material
        await createMaterial(formData, imageFile);
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
    <div>
      <ListMaterialForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
