
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  job: {
    id: number;
    title: string;
    type: string;
    description: string;
    payment: string;
    poster: {
      name: string;
      email: string;
      rating: number;
      memberSince: string;
      completedProjects: number;
    };
    deadline: string;
    requiredSkills: string[];
    timeline: string;
    category: string;
  };
}

const JobDetailsModal = ({ isOpen, onClose, onApply, job }: JobDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{job.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 font-medium">
              {job.type}
            </Badge>
            <span className="text-emerald-600 font-medium">{job.payment}</span>
          </div>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Posted by {job.poster.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Description</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Importance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {job.requiredSkills.map((skill, index) => (
                  <TableRow key={index}>
                    <TableCell>{skill}</TableCell>
                    <TableCell>{index === 0 ? "Essential" : "Preferred"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Timeline</h3>
              <p className="text-gray-700">{job.timeline}</p>
              <p className="text-sm text-gray-500 mt-1">Deadline: {job.deadline}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Category</h3>
              <p className="text-gray-700">{job.category}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Client Profile</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(job.poster.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{job.poster.rating}</span>
            </div>
            <p className="text-sm text-gray-600">
              Member since: {job.poster.memberSince}
            </p>
            <p className="text-sm text-gray-600">
              Completed projects: {job.poster.completedProjects}
            </p>
            <p className="text-sm text-gray-600">
              Contact: {job.poster.email}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onApply} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Apply Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
