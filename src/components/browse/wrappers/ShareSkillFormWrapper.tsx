
import React from "react";
import ShareSkillForm from "@/components/forms/ShareSkillForm";

/**
 * Props interface for the ShareSkillForm component that matches the expected props
 */
interface ShareSkillFormWrapperProps {
  initialData?: any;
}

/**
 * Wrapper for ShareSkillForm to handle initialData prop
 * This component ensures proper typing and prop passing
 */
export const ShareSkillFormWrapper: React.FC<ShareSkillFormWrapperProps> = ({ initialData }) => {
  return <ShareSkillForm initialData={initialData} />;
};
