
import React from "react";
import ShareSkillForm from "@/components/forms/ShareSkillForm";

/**
 * Wrapper for ShareSkillForm to handle initialData prop
 */
export const ShareSkillFormWrapper: React.FC<{ initialData?: any }> = ({ initialData }) => {
  return <ShareSkillForm initialData={initialData} />;
};
