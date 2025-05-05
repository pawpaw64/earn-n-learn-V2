
import React from "react";
import ShareSkillForm from "@/components/forms/ShareSkillForm";

/**
 * Props interface for the ShareSkillForm component
 */
interface ShareSkillFormProps {
  initialData?: any;
}

/**
 * Wrapper for ShareSkillForm to handle initialData prop
 */
export const ShareSkillFormWrapper: React.FC<ShareSkillFormProps> = ({ initialData }) => {
  return <ShareSkillForm initialData={initialData} />;
};
