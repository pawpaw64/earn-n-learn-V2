
import React from "react";
import { SkillPostCard } from "@/components/SkillPostCard";

interface SkillPost {
  id: number;
  skill_name?: string;
  [key: string]: any;
}

interface SkillPostsSectionProps {
  skills: SkillPost[];
  onViewDetails: (item: any, type: string) => void;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: number, type: string) => void;
}

/**
 * Section component for displaying skill posts
 * Shows all skill posts or empty state message
 */
export function SkillPostsSection({ skills, onViewDetails, onEdit, onDelete }: SkillPostsSectionProps) {
  return (
    <div>
      <h3 className="text-md font-semibold mb-4">Skills</h3>
      {skills.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {skills.map((skill) => (
            <SkillPostCard
              key={skill.id}
              skill={skill}
              onView={() => onViewDetails(skill, 'skill')}
              onEdit={() => onEdit(skill, 'skill')}
              onDelete={() => onDelete(skill.id, 'skill')}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No skills posted yet
        </div>
      )}
    </div>
  );
}
