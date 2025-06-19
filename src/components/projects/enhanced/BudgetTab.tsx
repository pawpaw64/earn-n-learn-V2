
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: number;
  budget?: string;
  payment?: string;
}

interface BudgetTabProps {
  project: Project;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({ project }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Budget Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <h4 className="font-medium">Total Budget</h4>
              <p className="text-lg font-semibold">{project.budget || project.payment || 'Not specified'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
