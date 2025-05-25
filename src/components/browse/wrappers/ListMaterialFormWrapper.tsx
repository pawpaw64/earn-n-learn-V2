
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
      
      // Handle image upload if present
      let imageUrl = initialData?.image_url || "";
      if (formData.image) {
        // For now, we'll create a placeholder URL. In a real app, you'd upload to a service
        const reader = new FileReader();
        reader.readAsDataURL(formData.image);
        imageUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
        });
      }
      
      const materialData = {
        title: formData.title,
        description: formData.description,
        condition: formData.condition,
        price: formData.price,
        availability: formData.availability,
        image_url: imageUrl,
        type: formData.type
      };
      
      if (initialData?.id) {
        // Update existing material
        await updateMaterial(initialData.id, materialData);
        toast.success("Material updated successfully");
      } else {
        // Create new material
        await createMaterial(materialData);
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
