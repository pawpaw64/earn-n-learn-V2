
import React from "react";
import ListMaterialForm from "@/components/forms/ListMaterialForm";

/**
 * Props interface for the ListMaterialForm component
 */
interface ListMaterialFormProps {
  initialData?: any;
}

/**
 * Wrapper for ListMaterialForm to handle initialData prop
 */
export const ListMaterialFormWrapper: React.FC<ListMaterialFormProps> = ({ initialData }) => {
  return <ListMaterialForm initialData={initialData} />;
};
