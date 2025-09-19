import React, { useState, useEffect } from "react";
import { JobType, SkillType, MaterialType } from "@/types/marketplace";
import JobDetailsModal from "@/components/modals/JobDetailsModal";
import SkillDetailsModal from "@/components/modals/SkillDetailsModal";
import MaterialDetailsModal from "@/components/modals/MaterialDetailsModal";
import JobApplicationModal from "@/components/modals/JobApplicationModal";
import ContactModal from "@/components/modals/ContactModal";
import { fetchMyApplications } from "@/services/applications";
import { ContactType } from "@/types/marketplace";
import { fetchUserSkillContacts, fetchUserMaterialContacts } from "@/services/contacts";
import { useNavigate } from "react-router-dom";
import EnhancedJobCard from "@/components/cards/EnhancedJobCard";
import EnhancedSkillCard from "@/components/cards/EnhancedSkillCard";
import EnhancedMaterialCard from "@/components/cards/EnhancedMaterialCard";
interface EnhancedListingsSectionProps {
  jobs: JobType[];
  skills: SkillType[];
  materials: MaterialType[];
  filteredJobs: JobType[];
  filteredSkills: SkillType[];
  filteredMaterials: MaterialType[];
}

const EnhancedListingsSection: React.FC<EnhancedListingsSectionProps> = ({
  jobs = [],
  skills = [],
  materials = [],
  filteredJobs = [],
  filteredSkills = [],
  filteredMaterials = [],
}) => {
  const navigate = useNavigate();
  
  // Modal states
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(null);
  
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [skillDetailsOpen, setSkillDetailsOpen] = useState(false);
  const [materialDetailsOpen, setMaterialDetailsOpen] = useState(false);
  
  const [jobApplicationOpen, setJobApplicationOpen] = useState(false);
  const [skillContactOpen, setSkillContactOpen] = useState(false);
  const [materialContactOpen, setMaterialContactOpen] = useState(false);

  // Application/Contact tracking states
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [requestedSkills, setRequestedSkills] = useState<Set<number>>(new Set());
  const [requestedMaterials, setRequestedMaterials] = useState<Set<number>>(new Set());

  // Load applied/requested states on component mount
  useEffect(() => {
    const loadApplicationStates = async () => {
      try {
        // Load job applications
        const myApplications = await fetchMyApplications();
        const jobIds = myApplications
          .map((app: any) => Number(app.job_id))
          .filter((id: number) => !isNaN(id) && id > 0);
        setAppliedJobs(new Set(jobIds));

        // Load skill contacts - using fetchUserSkillContacts instead for sent contacts
        const skillContacts = await fetchUserSkillContacts();
        const skillIds = skillContacts
          .map((contact: ContactType) => contact.skill_id)
          .filter((id): id is number => typeof id === 'number' && id > 0);
        setRequestedSkills(new Set(skillIds));

        // Load material contacts - using fetchUserMaterialContacts instead for sent contacts
        const materialContacts = await fetchUserMaterialContacts();
        const materialIds = materialContacts
          .map((contact: ContactType) => contact.material_id)
          .filter((id): id is number => typeof id === 'number' && id > 0);
        setRequestedMaterials(new Set(materialIds));
      } catch (error) {
        console.error("Error loading application states:", error);
      }
    };

    loadApplicationStates();
  }, []);

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

  // Poster profile handler
  const handleViewPoster = (posterId: number) => {
    if (posterId && posterId > 0) {
      navigate(`/dashboard/profile/${posterId}`);
    }
  };

  // Ensure we have arrays to work with
  const safeFilteredJobs = Array.isArray(filteredJobs) ? filteredJobs : [];
  const safeFilteredSkills = Array.isArray(filteredSkills) ? filteredSkills : [];
  const safeFilteredMaterials = Array.isArray(filteredMaterials) ? filteredMaterials : [];

  return (
    <>
      <div className="space-y-8">
        {/* Jobs Section */}
        <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 rounded-xl p-6 border border-yellow-200/20">
          <h2 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
            💼 Job Opportunities
          </h2>
          {safeFilteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeFilteredJobs.map(job => (
                <EnhancedJobCard
                  key={job.id}
                  job={job}
                  isApplied={appliedJobs.has(job.id)}
                  onApply={handleApplyJob}
                  onViewDetails={handleViewJobDetails}
                  onViewPoster={handleViewPoster}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No job opportunities found matching your criteria.</p>
            </div>
          )}
        </div>
        
        {/* Skills Section */}
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-6 border border-blue-200/20">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-2">
            🎓 Skills & Tutoring
          </h2>
          {safeFilteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeFilteredSkills.map(skill => (
                <EnhancedSkillCard
                  key={skill.id}
                  skill={skill}
                  isRequested={requestedSkills.has(skill.id)}
                  onContact={handleContactSkill}
                  onViewDetails={handleViewSkillDetails}
                  onViewPoster={handleViewPoster}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No skills found matching your criteria.</p>
            </div>
          )}
        </div>
        
        {/* Materials Section */}
        <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-6 border border-purple-200/20">
          <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-2">
            📚 Study Materials
          </h2>
          {safeFilteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safeFilteredMaterials.map(material => (
                <EnhancedMaterialCard
                  key={material.id}
                  material={material}
                  isRequested={requestedMaterials.has(material.id)}
                  onContact={handleContactMaterial}
                  onViewDetails={handleViewMaterialDetails}
                  onViewPoster={handleViewPoster}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No materials found matching your criteria.</p>
            </div>
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
        onOpenChange={(open) => {
          setJobApplicationOpen(open);
          if (!open && selectedJob) {
            // Update applied state when modal closes successfully
            setAppliedJobs(prev => new Set([...prev, selectedJob.id]));
          }
        }}
      />
      
      {selectedSkill && (
        <ContactModal 
          recipientName={selectedSkill.name || ''}
          itemName={selectedSkill.skill || selectedSkill.skill_name || ''}
          itemId={selectedSkill.id}
          itemType="skill"
          isOpen={skillContactOpen} 
          onOpenChange={(open) => {
            setSkillContactOpen(open);
            if (!open && selectedSkill) {
              // Update requested state when modal closes successfully
              setRequestedSkills(prev => new Set([...prev, selectedSkill.id]));
            }
          }}
        />
      )}
      
      {selectedMaterial && (
        <ContactModal 
          recipientName={selectedMaterial.name || ''}
          itemName={selectedMaterial.material || selectedMaterial.title || ''}
          itemId={selectedMaterial.id}
          itemType="material"
          isOpen={materialContactOpen} 
          onOpenChange={(open) => {
            setMaterialContactOpen(open);
            if (!open && selectedMaterial) {
              // Update requested state when modal closes successfully
              setRequestedMaterials(prev => new Set([...prev, selectedMaterial.id]));
            }
          }}
        />
      )}
    </>
  );
};

export default EnhancedListingsSection;