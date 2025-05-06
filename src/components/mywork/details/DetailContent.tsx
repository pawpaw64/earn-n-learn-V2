
import React from "react";
import { ApplicationDetails } from "./ApplicationDetails";
import { JobDetails } from "./JobDetails";
import { SkillMaterialDetails } from "./SkillMaterialDetails";
import { WorkDetails } from "./WorkDetails";
import { InvoiceDetails } from "./InvoiceDetails";
import { ContactDetails } from "./ContactDetails";

interface DetailContentProps {
  detailsItem: any;
  detailsType: string;
}

/**
 * Renders the appropriate details content based on the item type
 */
export const DetailContent: React.FC<DetailContentProps> = ({ detailsItem, detailsType }) => {
  if (!detailsItem) return null;
  
  switch (detailsType) {
    case 'application':
      return <ApplicationDetails item={detailsItem} />;
    case 'job':
      return <JobDetails item={detailsItem} />;
    case 'skill':
      return <SkillMaterialDetails item={detailsItem} type="skill" />;
    case 'material':
      return <SkillMaterialDetails item={detailsItem} type="material" />;
    case 'work':
      return <WorkDetails item={detailsItem} />;
    case 'invoice':
      return <InvoiceDetails item={detailsItem} />;
    case 'contact':
      return <ContactDetails item={detailsItem} />;
    default:
      return <p>No details available</p>;
  }
};
