
import React from "react";
import { PostJobForm } from "@/components/forms/PostJobForm";

/**
 * Wrapper for PostJobForm to handle initialData prop
 */
export const PostJobFormWrapper: React.FC<{ initialData?: any }> = ({ initialData }) => {
  return <PostJobForm />;
};
