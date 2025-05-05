
import React from "react";
import ListMaterialForm from "@/components/forms/ListMaterialForm";

/**
 * Props interface for the ListMaterialForm component that matches the expected props
 */
interface ListMaterialFormWrapperProps {
  initialData?: any;
}

/**
 * Wrapper for ListMaterialForm to handle initialData prop
 * This component ensures proper typing and prop passing
 */
export const ListMaterialFormWrapper: React.FC<ListMaterialFormWrapperProps> = ({ initialData }) => {
  return <ListMaterialForm initialData={initialData} />;
};
