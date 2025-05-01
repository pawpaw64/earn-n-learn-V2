
import React, { useState } from "react";
import JobCard from "@/components/JobCard";
import SkillCard from "@/components/SkillCard";
import MaterialCard from "@/components/MaterialCard";
import { JobType, SkillType, MaterialType } from "@/types/marketplace";
import JobDetailsModal from "@/components/modals/JobDetailsModal";
import SkillDetailsModal from "@/components/modals/SkillDetailsModal";
import MaterialDetailsModal from "@/components/modals/MaterialDetailsModal";
import JobApplicationModal from "@/components/modals/JobApplicationModal";
import ContactModal from "@/components/modals/ContactModal";

interface ListingsSectionProps {
  jobs: JobType[];
  skills: SkillType[];
  materials: MaterialType[];
  filteredJobs: JobType[];
  filteredSkills: SkillType[];
  filteredMaterials: MaterialType[];
}

const ListingsSection: React.FC<ListingsSectionProps> = ({
  jobs,
  skills,
  materials,
  filteredJobs,
  filteredSkills,
  filteredMaterials,
}) => {
  // State for Details Modals
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(null);
  
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [skillDetailsOpen, setSkillDetailsOpen] = useState(false);
  const [materialDetailsOpen, setMaterialDetailsOpen] = useState(false);
  
  // State for Application/Contact Modals
  const [jobApplicationOpen, setJobApplicationOpen] = useState(false);
  const [skillContactOpen, setSkillContactOpen] = useState(false);
  const [materialContactOpen, setMaterialContactOpen] = useState(false);

  // Job handlers
  const handleViewJobDetails = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId) || null;
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const handleApplyJob = (jobId: number) => {
    setJobDetailsOpen(false);
    // If coming from details modal, we already have the job selected
    // Otherwise, find the job
    if (!selectedJob || selectedJob.id !== jobId) {
      const job = jobs.find(j => j.id === jobId) || null;
      setSelectedJob(job);
    }
    setJobApplicationOpen(true);
  };

  // Skill handlers
  const handleViewSkillDetails = (skillId: number) => {
    const skill = skills.find(s => s.id === skillId) || null;
    setSelectedSkill(skill);
    setSkillDetailsOpen(true);
  };

  const handleContactSkill = (skillId: number) => {
    setSkillDetailsOpen(false);
    // If coming from details modal, we already have the skill selected
    // Otherwise, find the skill
    if (!selectedSkill || selectedSkill.id !== skillId) {
      const skill = skills.find(s => s.id === skillId) || null;
      setSelectedSkill(skill);
    }
    setSkillContactOpen(true);
  };

  // Material handlers
  const handleViewMaterialDetails = (materialId: number) => {
    const material = materials.find(m => m.id === materialId) || null;
    setSelectedMaterial(material);
    setMaterialDetailsOpen(true);
  };

  const handleContactMaterial = (materialId: number) => {
    setMaterialDetailsOpen(false);
    // If coming from details modal, we already have the material selected
    // Otherwise, find the material
    if (!selectedMaterial || selectedMaterial.id !== materialId) {
      const material = materials.find(m => m.id === materialId) || null;
      setSelectedMaterial(material);
    }
    setMaterialContactOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id}
              title={job.title}
              type={job.type}
              description={job.description}
              payment={job.payment}
              onApply={() => handleApplyJob(job.id)}
              onViewDetails={() => handleViewJobDetails(job.id)}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => (
            <SkillCard 
              key={skill.id}
              name={skill.name || ''}
              skill={skill.skill || skill.skill_name || ''}
              description={skill.description || ''}
              pricing={skill.pricing}
              experienceLevel={skill.experienceLevel || 'Beginner'}
              onContact={() => handleContactSkill(skill.id)}
              onViewDetails={() => handleViewSkillDetails(skill.id)}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Materials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(material => (
            <MaterialCard 
              key={material.id}
              name={material.name || ''}
              material={material.material || material.title || ''}
              condition={material.condition || material.conditions || 'Unknown'}
              price={material.price}
              availability={material.availability}
              description={material.description || ''}
              onContact={() => handleContactMaterial(material.id)}
              onViewDetails={() => handleViewMaterialDetails(material.id)}
            />
          ))}
        </div>
      </div>

      {/* Details Modals */}
      <JobDetailsModal 
        job={selectedJob} 
        isOpen={jobDetailsOpen} 
        onOpenChange={setJobDetailsOpen} 
        onApply={handleApplyJob} 
      />
      
      <SkillDetailsModal 
        skill={selectedSkill} 
        isOpen={skillDetailsOpen} 
        onOpenChange={setSkillDetailsOpen} 
        onContact={handleContactSkill} 
      />
      
      <MaterialDetailsModal 
        material={selectedMaterial} 
        isOpen={materialDetailsOpen} 
        onOpenChange={setMaterialDetailsOpen} 
        onContact={handleContactMaterial} 
      />

      {/* Application/Contact Modals */}
      <JobApplicationModal 
        job={selectedJob} 
        isOpen={jobApplicationOpen} 
        onOpenChange={setJobApplicationOpen} 
      />
      
      {selectedSkill && (
        <ContactModal 
          recipientName={selectedSkill.name || ''}
          itemName={selectedSkill.skill || selectedSkill.skill_name || ''}
          itemId={selectedSkill.id}
          itemType="skill"
          isOpen={skillContactOpen} 
          onOpenChange={setSkillContactOpen} 
        />
      )}
      
      {selectedMaterial && (
        <ContactModal 
          recipientName={selectedMaterial.name || ''}
          itemName={selectedMaterial.material || selectedMaterial.title || ''}
          itemId={selectedMaterial.id}
          itemType="material"
          isOpen={materialContactOpen} 
          onOpenChange={setMaterialContactOpen} 
        />
      )}
    </>
  );
};

export default ListingsSection;
