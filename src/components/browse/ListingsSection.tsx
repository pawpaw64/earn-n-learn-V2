// Updated ListingsSection with colored sections
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
  jobs = [],
  skills = [],
  materials = [],
  filteredJobs = [],
  filteredSkills = [],
  filteredMaterials = [],
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

  // Section color classes
  const sectionClasses = {
    jobs: {
      bg: 'bg-yellow-50/60',
      border: 'border-yellow-200',
      
      text: 'text-yellow-800'
    },
    skills: {
      bg: 'bg-blue-50/90',
      border: 'border-blue-200',
      text: 'text-blue-800'
    },
    materials: {
      bg: 'bg-purple-50/90',
      border: 'border-purple-200',
      text: 'text-purple-800'
    }
  };

  // Job handlers
  const handleViewJobDetails = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId) || null;
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const handleApplyJob = (jobId: number) => {
    setJobDetailsOpen(false);
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
    if (!selectedMaterial || selectedMaterial.id !== materialId) {
      const material = materials.find(m => m.id === materialId) || null;
      setSelectedMaterial(material);
    }
    setMaterialContactOpen(true);
  };

  // Ensure we have arrays to work with
  const safeFilteredJobs = Array.isArray(filteredJobs) ? filteredJobs : [];
  const safeFilteredSkills = Array.isArray(filteredSkills) ? filteredSkills : [];
  const safeFilteredMaterials = Array.isArray(filteredMaterials) ? filteredMaterials : [];

  return (
    <>
    <div className="space-y-6 ">
        {/* Jobs Section */}
        <div className={`rounded-lg p-4 ${sectionClasses.jobs.bg} ${sectionClasses.jobs.border} border`}>
          <h2 className={`text-xl font-semibold mb-4 ${sectionClasses.jobs.text}`}>Jobs</h2>
          {safeFilteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeFilteredJobs.map(job => (
                <JobCard 
                  key={job.id}
                  title={job.title || 'Untitled'}
                  type={job.type || 'General'}
                  description={job.description || ''}
                  payment={job.payment || 'Not specified'}
                  onApply={() => handleApplyJob(job.id)}
                  onViewDetails={() => handleViewJobDetails(job.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">No jobs found matching your criteria.</p>
          )}
        </div>
        
        {/* Skills Section */}
        <div className={`rounded-lg p-4 ${sectionClasses.skills.bg} ${sectionClasses.skills.border} border`}>
          <h2 className={`text-xl font-semibold mb-4 ${sectionClasses.skills.text}`}>Skills</h2>
          {safeFilteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeFilteredSkills.map(skill => (
                <SkillCard 
                  key={skill.id}
                  name={skill.name || ''}
                  skill={skill.skill || skill.skill_name || ''}
                  description={skill.description || ''}
                  pricing={skill.pricing || 'Not specified'}
                  experienceLevel={skill.experienceLevel || 'Beginner'}
                  onContact={() => handleContactSkill(skill.id)}
                  onViewDetails={() => handleViewSkillDetails(skill.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">No skills found matching your criteria.</p>
          )}
        </div>
        
        {/* Materials Section */}
        <div className={`rounded-lg p-4 ${sectionClasses.materials.bg} ${sectionClasses.materials.border} border`}>
          <h2 className={`text-xl font-semibold mb-4 ${sectionClasses.materials.text}`}>Materials</h2>
          {safeFilteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeFilteredMaterials.map(material => (
                <MaterialCard 
                  key={material.id}
                  name={material.name || ''}
                  material={material.material || material.title || ''}
                  condition={material.condition || material.conditions || 'Unknown'}
                  price={material.price || 'Not specified'}
                  availability={material.availability || 'Unknown'}
                  description={material.description || ''}
                  imageUrl={material.imageUrl}
                  onContact={() => handleContactMaterial(material.id)}
                  onViewDetails={() => handleViewMaterialDetails(material.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">No materials found matching your criteria.</p>
          )}
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