import React from "react";
import ListMaterialForm from "@/components/forms/ListMaterialForm";
import { MaterialType } from "@/types/marketplace";

interface ListMaterialFormWrapperProps {
  initialData?: MaterialType;
}

export const ListMaterialFormWrapper: React.FC<ListMaterialFormWrapperProps> = ({ 
  initialData 
}) => {
  return <ListMaterialForm initialData={initialData} />;
};