
import React from "react";
import JobCard from "@/components/JobCard";
import SkillCard from "@/components/SkillCard";
import MaterialCard from "@/components/MaterialCard";
import { Job, Skill, Material } from "@/hooks/useBrowseData";

interface ListingsSectionProps {
  jobs: Job[];
  skills: Skill[];
  materials: Material[];
  onApplyJob: (id: number) => void;
  onViewJobDetails: (id: number) => void;
  onContactSkill: (id: number) => void;
  onViewSkillDetails: (id: number) => void;
  onContactMaterial: (id: number) => void;
  onViewMaterialDetails: (id: number) => void;
}

const ListingsSection = ({
  jobs,
  skills,
  materials,
  onApplyJob,
  onViewJobDetails,
  onContactSkill,
  onViewSkillDetails,
  onContactMaterial,
  onViewMaterialDetails,
}: ListingsSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <JobCard 
              key={job.id}
              title={job.title}
              type={job.type}
              description={job.description}
              payment={job.payment}
              onApply={() => onApplyJob(job.id)}
              onViewDetails={() => onViewJobDetails(job.id)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <SkillCard
              key={skill.id}
              name={skill.name}
              skill={skill.skillName}
              pricing={skill.pricingType}
              onContact={() => onContactSkill(skill.id)}
              onViewDetails={() => onViewSkillDetails(skill.id)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map(material => (
            <MaterialCard
              key={material.id}
              name={material.owner.name}
              material={material.materialName}
              condition={material.condition}
              price={material.price}
              availability={material.availability}
              onContact={() => onContactMaterial(material.id)}
              onViewDetails={() => onViewMaterialDetails(material.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingsSection;
