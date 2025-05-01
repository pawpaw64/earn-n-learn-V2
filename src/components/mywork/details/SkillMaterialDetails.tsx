
import React from "react";

/**
 * Renders skill or material details content
 */
export const SkillMaterialDetails: React.FC<{ 
  item: any, 
  type: 'skill' | 'material' 
}> = ({ item, type }) => {
  if (!item) return null;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Title</p>
          <p>{item.skill_name || item.title}</p>
        </div>
        <div>
          <p className="font-semibold">Price/Rate</p>
          <p>{item.pricing || item.price}</p>
        </div>
        <div>
          <p className="font-semibold">Availability</p>
          <p>{item.availability}</p>
        </div>
        {item.condition && (
          <div>
            <p className="font-semibold">Condition</p>
            <p>{item.condition}</p>
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold">Description</p>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
};
