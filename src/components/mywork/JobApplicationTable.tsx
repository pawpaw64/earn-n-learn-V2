
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Application {
  id: number;
  job_title?: string;
  title?: string;
  status: string;
  created_at: string;
  applicant_name?: string;
  poster_name?: string;
}

interface JobApplicationTableProps {
  applications: Application[];
  isLoading: boolean;
  onStatusUpdate: (id: number, type: string, status: string) => Promise<void>;
}

export const JobApplicationTable: React.FC<JobApplicationTableProps> = ({
  applications,
  isLoading,
  onStatusUpdate
}) => {
  if (isLoading) {
    return <div className="flex justify-center p-4">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">No applications found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Title</TableHead>
          <TableHead>Applicant/Poster</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell>{application.job_title || application.title}</TableCell>
            <TableCell>{application.applicant_name || application.poster_name}</TableCell>
            <TableCell>
              <Badge variant={application.status === 'Pending' ? 'secondary' : 'default'}>
                {application.status}
              </Badge>
            </TableCell>
            <TableCell>{application.created_at}</TableCell>
            <TableCell>
              <Select
                onValueChange={(value) => onStatusUpdate(application.id, 'job_application', value)}
                defaultValue={application.status}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
