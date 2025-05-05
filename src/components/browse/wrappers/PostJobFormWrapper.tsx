
import React from "react";
import PostJobForm from "@/components/forms/PostJobForm";

/**
 * Props interface for the PostJobForm component
 */
interface PostJobFormProps {
  initialData?: any;
}

/**
 * Wrapper for PostJobForm to handle initialData prop
 */
export const PostJobFormWrapper: React.FC<PostJobFormProps> = ({ initialData }) => {
  return <PostJobForm initialData={initialData} />;
};
