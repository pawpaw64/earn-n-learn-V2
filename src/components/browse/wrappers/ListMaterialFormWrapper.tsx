
import React from "react";
import ListMaterialForm from "@/components/forms/ListMaterialForm";

/**
 * Wrapper for ListMaterialForm to handle initialData prop
 */
export const ListMaterialFormWrapper: React.FC<{ initialData?: any }> = ({ initialData }) => {
  return <ListMaterialForm initialData={initialData} />;
};
