import React from "react";
import ShareSkillForm from "@/components/forms/ShareSkillForm";
import { SkillType } from "@/types/marketplace";

interface ShareSkillFormWrapperProps {
  initialData?: SkillType;
  onSuccess?: () => void;
}

export const ShareSkillFormWrapper: React.FC<ShareSkillFormWrapperProps> = ({ 
  initialData,
  onSuccess 
}) => {
  return <ShareSkillForm initialData={initialData} onSuccess={onSuccess} />;
};