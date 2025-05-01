
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { JobPostCard } from "@/components/JobPostCard";
import { SkillPostCard } from "@/components/SkillPostCard";
import { MaterialPostCard } from "@/components/MaterialPostCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { 
  Filter, 
  Calendar, 
  Briefcase, 
  FileText, 
  Edit,
  Eye,
  Trash2,
  Loader2,
  Check,
  X,
  Clock,
  UserCheck
} from "lucide-react";
import { 
  fetchMyApplications, 
  fetchMyWorks, 
  fetchMyPosts, 
  fetchMyInvoices,
  deleteJob,
  deleteSkill,
  deleteMaterial,
  fetchUserSkillContacts,
  fetchUserMaterialContacts,
  fetchJobApplications,
  updateApplicationStatus,
  updateWorkStatus,
  fetchSkillContacts,
  fetchMaterialContacts,
  updateSkillContactStatus,
  updateMaterialContactStatus,
  createWorkFromApplication,
  createWorkFromSkillContact,
  createWorkFromMaterialContact,
  getApplicationDetails,
  getWorkDetails
} from "@/services/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Import our new components
import { ApplicationsTab } from "@/components/mywork/ApplicationsTab";
import { MyWorksTab } from "@/components/mywork/MyWorksTab";
import { MyPostsTab } from "@/components/mywork/MyPostsTab";
import { InvoicesTab } from "@/components/mywork/InvoicesTab";
import { DetailsDialog } from "@/components/mywork/DetailsDialog";
import { useWorkDetails } from "@/hooks/useWorkDetails";

export default function MyWork() {
  const navigate = useNavigate();
  const [detailsItem, setDetailsItem] = useState<any>(null);
  const [detailsType, setDetailsType] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { 
    handleViewDetails,
    handleEdit,
    handleDelete,
    handleStatusChange,
    handleCreateWork,
    renderDetailsContent,
    renderActionButtons
  } = useWorkDetails({
    setDetailsItem,
    setDetailsType,
    setIsDetailsOpen,
    navigate,
    isDetailsOpen,
    detailsItem,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Work</h1>
      
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-6 grid grid-cols-4 gap-4">
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="myworks" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            My Works
          </TabsTrigger>
          <TabsTrigger value="myposts" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            My Posts
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        {/* Applications Tab Content */}
        <TabsContent value="applications">
          <ApplicationsTab 
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        {/* My Works Tab Content */}
        <TabsContent value="myworks">
          <MyWorksTab 
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        {/* My Posts Tab Content */}
        <TabsContent value="myposts">
          <MyPostsTab 
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        {/* Invoices Tab Content */}
        <TabsContent value="invoices">
          <InvoicesTab onViewDetails={handleViewDetails} />
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <DetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        detailsItem={detailsItem}
        detailsType={detailsType}
        renderDetailsContent={renderDetailsContent}
        renderActionButtons={renderActionButtons}
      />
    </div>
  );
}
