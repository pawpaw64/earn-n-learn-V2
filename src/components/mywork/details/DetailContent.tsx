
import React from "react";
import { ApplicationDetails } from "./ApplicationDetails";
import { MyApplicationDetails } from "./MyApplicationDetails";
import { JobDetails } from "./JobDetails";
import { SkillMaterialDetails } from "./SkillMaterialDetails";
import { ContactDetails } from "./ContactDetails";
import { ProjectDetails } from "./ProjectDetails";

interface DetailContentProps {
  detailsItem: any;
  detailsType: string;
}

export const DetailContent: React.FC<DetailContentProps> = ({ detailsItem, detailsType }) => {
  if (!detailsItem) return null;
  
  switch (detailsType) {
    case 'application':
      return <ApplicationDetails item={detailsItem} />;
    case 'my_application':
      return <MyApplicationDetails item={detailsItem} />;
    case 'job':
      return <JobDetails item={detailsItem} />;
    case 'skill':
      return <SkillMaterialDetails item={detailsItem} type="skill" />;
    case 'material':
      return <SkillMaterialDetails item={detailsItem} type="material" />;
    
    case 'contact':
      return <ContactDetails item={detailsItem} />;
    case 'project':
      return <ProjectDetails item={detailsItem} />;
    default:
      return <p>No details available</p>;
  }
};
