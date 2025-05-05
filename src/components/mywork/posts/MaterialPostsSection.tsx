
import React from "react";
import { MaterialPostCard } from "@/components/MaterialPostCard";
import { MaterialType } from "@/types/marketplace";

interface MaterialPostsSectionProps {
  materials: MaterialType[];
  onViewDetails: (item: any, type: string) => void;
  onEdit: (item: any, type: string) => void;
  onDelete: (id: number, type: string) => void;
}

/**
 * Section component for displaying material posts
 * Shows all material posts or empty state message
 */
export function MaterialPostsSection({ materials, onViewDetails, onEdit, onDelete }: MaterialPostsSectionProps) {
  return (
    <div>
      <h3 className="text-md font-semibold mb-4">Materials</h3>
      {materials.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {materials.map((material) => (
            <MaterialPostCard
              key={material.id}
              material={material}
              onView={() => onViewDetails(material, 'material')}
              onEdit={() => onEdit(material, 'material')}
              onDelete={() => onDelete(material.id, 'material')}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No materials posted yet
        </div>
      )}
    </div>
  );
}
