
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Import our components
import { ApplicationsTab } from "@/components/mywork/ApplicationsTab";
import { InvoicesTab } from "@/components/mywork/InvoicesTab";
import { DetailsDialog } from "@/components/mywork/DetailsDialog";
import { ProjectsTab } from "@/components/projects/ProjectsTab";
import { useWorkDetails } from "@/hooks/useWorkDetails";

export default function MyWork() {
  const navigate = useNavigate();
  const [detailsItem, setDetailsItem] = useState<any>(null);
  const [detailsType, setDetailsType] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const { 
    handleViewDetails,
    handleStatusChange,
    handleEdit,
    handleDelete,
  } = useWorkDetails({
    setDetailsItem,
    setDetailsType,
    setIsDetailsOpen,
    navigate,
    isDetailsOpen,
    detailsItem,
  });

  // Wrapper to align status change to return Promise<boolean>
  const handleStatusChangeWrapper = async (id: number, type: string, status: string): Promise<boolean> => {
    await handleStatusChange(id, type, status);
    return true;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Work</h1>
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-6 w-full flex gap-2">
          <TabsTrigger 
            value="applications" 
            className="flex-1 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="M20 8H4"/>
              <path d="M8 16h.01"/>
              <path d="M16 16h.01"/>
              <path d="M12 16h.01"/>
            </svg>
            Applications
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="flex-1 flex items-center justify-center gap-2  text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            My Works
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="flex-1 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            Invoices
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab Content */}
        <TabsContent value="projects">
          <ProjectsTab   
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChangeWrapper} 
          />
        </TabsContent>

        {/* Applications Tab Content */}
        <TabsContent value="applications">
          <ApplicationsTab 
            onViewDetails={handleViewDetails}
            onStatusChange={handleStatusChangeWrapper}
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
        onStatusChange={handleStatusChangeWrapper}
      />
    </div>
  );
}
