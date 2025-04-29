
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

export default function MyWork() {
  const navigate = useNavigate();
  const [detailsItem, setDetailsItem] = useState<any>(null);
  const [detailsType, setDetailsType] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [applicationsTab, setApplicationsTab] = useState("job");
  const [activeContactsTab, setActiveContactsTab] = useState("received");

  // Fetch all data
  const { 
    data: applications = [], 
    isLoading: isLoadingApps,
    refetch: refetchApplications
  } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications
  });

  const { 
    data: jobApplications = [], 
    isLoading: isLoadingJobApps,
    refetch: refetchJobApplications
  } = useQuery({
    queryKey: ['jobApplications'],
    queryFn: fetchJobApplications
  });

  const {
    data: skillContacts = [],
    isLoading: isLoadingSkillContacts,
    refetch: refetchSkillContacts
  } = useQuery({
    queryKey: ['skillContacts'],
    queryFn: fetchUserSkillContacts
  });

  const {
    data: materialContacts = [],
    isLoading: isLoadingMaterialContacts,
    refetch: refetchMaterialContacts
  } = useQuery({
    queryKey: ['materialContacts'],
    queryFn: fetchUserMaterialContacts
  });

  const {
    data: receivedSkillContacts = [],
    isLoading: isLoadingReceivedSkillContacts,
    refetch: refetchReceivedSkillContacts
  } = useQuery({
    queryKey: ['receivedSkillContacts'],
    queryFn: fetchSkillContacts
  });

  const {
    data: receivedMaterialContacts = [],
    isLoading: isLoadingReceivedMaterialContacts,
    refetch: refetchReceivedMaterialContacts
  } = useQuery({
    queryKey: ['receivedMaterialContacts'],
    queryFn: fetchMaterialContacts
  });

  const { 
    data: works = [], 
    isLoading: isLoadingWorks,
    refetch: refetchWorks
  } = useQuery({
    queryKey: ['myWorks'],
    queryFn: fetchMyWorks
  });

  const { 
    data: posts = { jobs: [], skills: [], materials: [] },
    isLoading: isLoadingPosts,
    isError: isPostsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts
  });

  const { 
    data: invoices = [], 
    isLoading: isLoadingInvoices,
    refetch: refetchInvoices
  } = useQuery({
    queryKey: ['myInvoices'],
    queryFn: fetchMyInvoices
  });

  const handleViewDetails = async (item: any, type: string) => {
    // For certain types, we need to fetch more details
    let detailItem = item;
    
    try {
      if (type === 'application' && item.id) {
        const details = await getApplicationDetails(item.id);
        if (details) {
          detailItem = { ...item, ...details };
        }
      }
      else if (type === 'work' && item.id) {
        const details = await getWorkDetails(item.id);
        if (details) {
          detailItem = { ...item, ...details };
        }
      }
      
      setDetailsItem(detailItem);
      setDetailsType(type);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      toast.error(`Failed to load details. Please try again.`);
    }
  };

  const handleEdit = (item: any, type: string) => {
    localStorage.setItem("editItem", JSON.stringify(item));
    localStorage.setItem("editType", type);
    navigate(`/dashboard/browse?tab=post&type=${type}`);
  };

  const handleDelete = async (id: number, type: string) => {
    try {
      if (type === 'job') {
        await deleteJob(id);
      } else if (type === 'skill') {
        await deleteSkill(id);
      } else if (type === 'material') {
        await deleteMaterial(id);
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      refetchPosts();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  const handleStatusChange = async (id: number, type: string, newStatus: string) => {
    try {
      if (type === 'job_application') {
        await updateApplicationStatus(id, newStatus);
        refetchApplications();
        refetchJobApplications();
      } 
      else if (type === 'skill_contact') {
        await updateSkillContactStatus(id, newStatus);
        refetchSkillContacts();
        refetchReceivedSkillContacts();
      }
      else if (type === 'material_contact') {
        await updateMaterialContactStatus(id, newStatus);
        refetchMaterialContacts();
        refetchReceivedMaterialContacts();
      }
      else if (type === 'work') {
        await updateWorkStatus(id, newStatus);
        refetchWorks();
      }
      
      toast.success(`Status updated to ${newStatus}`);
      
      // Close the details dialog if open
      if (isDetailsOpen && detailsItem?.id === id) {
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error(`Error updating ${type} status:`, error);
      toast.error('Failed to update status');
    }
  };

  const handleCreateWork = async (id: number, type: string) => {
    try {
      if (type === 'job_application') {
        await createWorkFromApplication(id);
        refetchJobApplications();
      } 
      else if (type === 'skill_contact') {
        await createWorkFromSkillContact(id);
        refetchReceivedSkillContacts();
      }
      else if (type === 'material_contact') {
        await createWorkFromMaterialContact(id);
        refetchReceivedMaterialContacts();
      }
      
      toast.success('Work assignment created successfully');
      refetchWorks();
      
      // Close the details dialog if open
      if (isDetailsOpen) {
        setIsDetailsOpen(false);
      }
    } catch (error) {
      console.error(`Error creating work from ${type}:`, error);
      toast.error('Failed to create work assignment');
    }
  };

  const renderDetailsContent = () => {
    if (!detailsItem) return null;
    
    switch (detailsType) {
      case 'application':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Job Title</p>
                <p>{detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Poster</p>
                <p>{detailsItem.poster_name || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p>{detailsItem.type}</p>
              </div>
              <div>
                <p className="font-semibold">Date Applied</p>
                <p>{new Date(detailsItem.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={
                  detailsItem.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                  detailsItem.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {detailsItem.status}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">Payment</p>
                <p>{detailsItem.payment || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Cover Letter</p>
              <p className="text-muted-foreground whitespace-pre-line">{detailsItem.cover_letter}</p>
            </div>
            {detailsItem.description && (
              <div>
                <p className="font-semibold">Job Description</p>
                <p className="text-muted-foreground">{detailsItem.description}</p>
              </div>
            )}
          </div>
        );
      case 'job':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Title</p>
                <p>{detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p>{detailsItem.type}</p>
              </div>
              <div>
                <p className="font-semibold">Payment</p>
                <p>{detailsItem.payment}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge>{detailsItem.status}</Badge>
              </div>
              {detailsItem.deadline && (
                <div>
                  <p className="font-semibold">Deadline</p>
                  <p>{new Date(detailsItem.deadline).toLocaleDateString()}</p>
                </div>
              )}
              {detailsItem.location && (
                <div>
                  <p className="font-semibold">Location</p>
                  <p>{detailsItem.location}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">{detailsItem.description}</p>
            </div>
            {detailsItem.requirements && (
              <div>
                <p className="font-semibold">Requirements</p>
                <p className="text-muted-foreground">{detailsItem.requirements}</p>
              </div>
            )}
            {detailsItem.applicationsCount !== undefined && (
              <div>
                <p className="font-semibold">Applications</p>
                <p>{detailsItem.applicationsCount} applicant(s)</p>
              </div>
            )}
          </div>
        );
      case 'skill':
      case 'material':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Title</p>
                <p>{detailsItem.skill_name || detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Price/Rate</p>
                <p>{detailsItem.pricing || detailsItem.price}</p>
              </div>
              <div>
                <p className="font-semibold">Availability</p>
                <p>{detailsItem.availability}</p>
              </div>
              {detailsItem.condition && (
                <div>
                  <p className="font-semibold">Condition</p>
                  <p>{detailsItem.condition}</p>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">{detailsItem.description}</p>
            </div>
          </div>
        );
      case 'work':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Title</p>
                <p>{detailsItem.job_title || detailsItem.skill_name || detailsItem.material_title || detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p>{detailsItem.job_type || detailsItem.type || (detailsItem.skill_name ? 'Skill Service' : 'Material')}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={
                  detailsItem.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  detailsItem.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  detailsItem.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {detailsItem.status}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">Start Date</p>
                <p>{new Date(detailsItem.start_date).toLocaleDateString()}</p>
              </div>
              {detailsItem.end_date && (
                <div>
                  <p className="font-semibold">End Date</p>
                  <p>{new Date(detailsItem.end_date).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="font-semibold">Payment/Price</p>
                <p>{detailsItem.job_payment || detailsItem.skill_pricing || detailsItem.material_price || detailsItem.payment}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">{detailsItem.job_description || detailsItem.skill_description || detailsItem.material_description || detailsItem.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Provider</p>
                <p>{detailsItem.provider_name}</p>
              </div>
              <div>
                <p className="font-semibold">Client</p>
                <p>{detailsItem.client_name}</p>
              </div>
            </div>
            {detailsItem.notes && (
              <div>
                <p className="font-semibold">Notes</p>
                <p className="text-muted-foreground">{detailsItem.notes}</p>
              </div>
            )}
          </div>
        );
      case 'invoice':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Invoice Number</p>
                <p>{detailsItem.invoiceNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Title</p>
                <p>{detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Client</p>
                <p>{detailsItem.client}</p>
              </div>
              <div>
                <p className="font-semibold">Amount</p>
                <p className="font-medium text-emerald-600">{detailsItem.amount}</p>
              </div>
              <div>
                <p className="font-semibold">Issue Date</p>
                <p>{detailsItem.date}</p>
              </div>
              <div>
                <p className="font-semibold">Due Date</p>
                <p>{detailsItem.dueDate}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={
                  detailsItem.status === 'Paid' ? 'bg-green-100 text-green-800' :
                  detailsItem.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {detailsItem.status}
                </Badge>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Item</p>
                <p>{detailsItem.skill_name || detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Price</p>
                <p>{detailsItem.pricing || detailsItem.price}</p>
              </div>
              <div>
                <p className="font-semibold">Contact</p>
                <p>{detailsItem.contact_name || detailsItem.provider_name || detailsItem.seller_name}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <Badge className={
                  detailsItem.status === 'Agreement Reached' ? 'bg-green-100 text-green-800' :
                  detailsItem.status === 'Declined' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {detailsItem.status}
                </Badge>
              </div>
              <div>
                <p className="font-semibold">Date</p>
                <p>{new Date(detailsItem.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Message</p>
              <p className="text-muted-foreground whitespace-pre-line">{detailsItem.message}</p>
            </div>
          </div>
        );
      default:
        return <p>No details available</p>;
    }
  };

  const renderActionButtons = () => {
    if (!detailsItem) return null;
    
    switch (detailsType) {
      case 'application':
        // Only show withdraw button if status is Applied or Reviewing
        if (['Applied', 'Reviewing'].includes(detailsItem.status)) {
          return (
            <Button 
              variant="outline" 
              className="gap-1 text-red-600"
              onClick={() => handleStatusChange(detailsItem.id, 'job_application', 'Withdrawn')}
            >
              <X className="h-4 w-4" /> Withdraw Application
            </Button>
          );
        }
        return null;
        
      case 'job':
        return (
          <Button 
            onClick={() => handleEdit(detailsItem, 'job')}
            className="gap-1"
          >
            <Edit className="h-4 w-4" /> Edit Job
          </Button>
        );
        
      case 'skill':
        return (
          <Button 
            onClick={() => handleEdit(detailsItem, 'skill')}
            className="gap-1"
          >
            <Edit className="h-4 w-4" /> Edit Skill
          </Button>
        );
        
      case 'material':
        return (
          <Button 
            onClick={() => handleEdit(detailsItem, 'material')}
            className="gap-1"
          >
            <Edit className="h-4 w-4" /> Edit Material
          </Button>
        );
        
      case 'work':
        // Only show status change buttons if the work is not completed or cancelled
        if (!['Completed', 'Cancelled'].includes(detailsItem.status)) {
          return (
            <div className="flex gap-2 flex-wrap">
              {detailsItem.status !== 'In Progress' && (
                <Button 
                  variant="outline" 
                  className="gap-1 text-blue-600"
                  onClick={() => handleStatusChange(detailsItem.id, 'work', 'In Progress')}
                >
                  <Clock className="h-4 w-4" /> Mark In Progress
                </Button>
              )}
              {detailsItem.status !== 'Paused' && (
                <Button 
                  variant="outline" 
                  className="gap-1 text-yellow-600"
                  onClick={() => handleStatusChange(detailsItem.id, 'work', 'Paused')}
                >
                  <Clock className="h-4 w-4" /> Pause Work
                </Button>
              )}
              <Button 
                variant="outline" 
                className="gap-1 text-green-600"
                onClick={() => handleStatusChange(detailsItem.id, 'work', 'Completed')}
              >
                <Check className="h-4 w-4" /> Mark Complete
              </Button>
              <Button 
                variant="outline" 
                className="gap-1 text-red-600"
                onClick={() => handleStatusChange(detailsItem.id, 'work', 'Cancelled')}
              >
                <X className="h-4 w-4" /> Cancel Work
              </Button>
            </div>
          );
        }
        return null;
        
      case 'contact':
        // Only show status change options for received contacts
        if (detailsItem.contact_name) {
          const contactType = detailsItem.skill_id ? 'skill_contact' : 'material_contact';
          // Only show options if not already in final states
          if (!['Agreement Reached', 'Declined', 'Completed'].includes(detailsItem.status)) {
            return (
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  className="gap-1 text-blue-600"
                  onClick={() => handleStatusChange(detailsItem.id, contactType, 'Responded')}
                >
                  <Clock className="h-4 w-4" /> Mark Responded
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1 text-blue-600"
                  onClick={() => handleStatusChange(detailsItem.id, contactType, 'In Discussion')}
                >
                  <Clock className="h-4 w-4" /> In Discussion
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1 text-green-600"
                  onClick={() => handleCreateWork(detailsItem.id, contactType)}
                >
                  <UserCheck className="h-4 w-4" /> Create Agreement
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-1 text-red-600"
                  onClick={() => handleStatusChange(detailsItem.id, contactType, 'Declined')}
                >
                  <X className="h-4 w-4" /> Decline
                </Button>
              </div>
            );
          } else if (detailsItem.status === 'Agreement Reached') {
            // If agreement reached but work not created yet
            return (
              <Button 
                className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleCreateWork(
                  detailsItem.id, 
                  detailsItem.skill_id ? 'skill_contact' : 'material_contact'
                )}
              >
                <UserCheck className="h-4 w-4" /> Create Work Assignment
              </Button>
            );
          }
        }
        return null;

      default:
        return null;
    }
  };

  // Render job applications card
  const renderJobApplicationCard = (app: any) => (
    <Card key={app.id} className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{app.title}</h3>
            <p className="text-sm text-muted-foreground">{app.poster_name || 'Unknown poster'}</p>
          </div>
          <Badge variant={
            app.status === 'Accepted' ? 'secondary' : 
            app.status === 'Rejected' ? 'destructive' : 
            'outline'
          }>
            {app.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {app.cover_letter?.substring(0, 100)}...
        </p>
        <div className="mt-2">
          <Badge variant="outline" className="mr-2">{app.type}</Badge>
          <Badge variant="outline">{app.payment || 'Unspecified'}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Applied: {new Date(app.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewDetails(app, 'application')}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {app.status === 'Applied' && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500"
              onClick={() => handleStatusChange(app.id, 'job_application', 'Withdrawn')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );

  // Render contact card
  const renderContactCard = (contact: any, type: 'skill' | 'material') => (
    <Card key={contact.id} className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">
              {type === 'skill' ? contact.skill_name : contact.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {type === 'skill' ? contact.provider_name : contact.seller_name}
            </p>
          </div>
          <Badge variant={
            contact.status === 'Agreement Reached' ? 'secondary' : 
            contact.status === 'Declined' ? 'destructive' : 
            'outline'
          }>
            {contact.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {contact.message?.substring(0, 100)}...
        </p>
        <p className="mt-2 font-medium text-emerald-600">
          {type === 'skill' ? contact.pricing : contact.price}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="text-sm text-muted-foreground">
          Contacted: {new Date(contact.created_at).toLocaleDateString()}
        </span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleViewDetails(contact, 'contact')}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  // Render received applications/contacts table
  const renderReceivedApplicationsTable = () => {
    if (isLoadingJobApps) {
      return renderLoadingSkeleton();
    }

    const handleAcceptApplication = async (appId: number) => {
      try {
        await updateApplicationStatus(appId, 'Accepted');
        await createWorkFromApplication(appId);
        toast.success("Application accepted and work created successfully!");
        refetchJobApplications();
        refetchWorks();
      } catch (error) {
        console.error("Error accepting application:", error);
        toast.error("Failed to accept application");
      }
    };

    const handleRejectApplication = async (appId: number) => {
      try {
        await updateApplicationStatus(appId, 'Rejected');
        toast.success("Application rejected successfully");
        refetchJobApplications();
      } catch (error) {
        console.error("Error rejecting application:", error);
        toast.error("Failed to reject application");
      }
    };

    if (jobApplications.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          No applications received for your jobs
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobApplications.map((app: any) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={app.applicant_avatar} />
                      <AvatarFallback>{app.applicant_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{app.applicant_name}</p>
                      <p className="text-xs text-muted-foreground">{app.applicant_email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{app.title}</p>
                  <p className="text-xs text-muted-foreground">{app.type}</p>
                </TableCell>
                <TableCell>
                  {new Date(app.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    app.status === 'Accepted' ? 'secondary' : 
                    app.status === 'Rejected' ? 'destructive' : 
                    'outline'
                  }>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(app, 'application')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {app.status === 'Applied' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleAcceptApplication(app.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleRejectApplication(app.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Render received contacts table
  const renderReceivedContactsTable = (type: 'skill' | 'material') => {
    const contacts = type === 'skill' ? receivedSkillContacts : receivedMaterialContacts;
    const isLoading = type === 'skill' ? isLoadingReceivedSkillContacts : isLoadingReceivedMaterialContacts;
    
    if (isLoading) {
      return renderLoadingSkeleton();
    }

    if (contacts.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          No {type} contacts received
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>{type === 'skill' ? 'Skill' : 'Material'}</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact: any) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.contact_avatar} />
                      <AvatarFallback>{contact.contact_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.contact_name}</p>
                      <p className="text-xs text-muted-foreground">{contact.contact_email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {type === 'skill' ? contact.skill_name : contact.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{type === 'skill' ? contact.pricing : contact.price}</p>
                </TableCell>
                <TableCell>
                  {new Date(contact.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    contact.status === 'Agreement Reached' ? 'secondary' : 
                    contact.status === 'Declined' ? 'destructive' : 
                    'outline'
                  }>
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(contact, 'contact')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {contact.status === 'Contact Initiated' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleStatusChange(
                            contact.id, 
                            type === 'skill' ? 'skill_contact' : 'material_contact', 
                            'Responded'
                          )}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleStatusChange(
                            contact.id, 
                            type === 'skill' ? 'skill_contact' : 'material_contact', 
                            'Declined'
                          )}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {contact.status === 'Responded' || contact.status === 'In Discussion' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600"
                        onClick={() => handleCreateWork(
                          contact.id, 
                          type === 'skill' ? 'skill_contact' : 'material_contact'
                        )}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

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
          <Tabs value={applicationsTab} onValueChange={setApplicationsTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="job">Job Applications</TabsTrigger>
              <TabsTrigger value="skill">Skill Inquiries</TabsTrigger>
              <TabsTrigger value="material">Material Inquiries</TabsTrigger>
              <TabsTrigger value="received">Received Applications</TabsTrigger>
            </TabsList>
            
            {/* Job Applications Subtab */}
            <TabsContent value="job">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Job Applications</h2>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
              </div>
              
              {isLoadingApps ? renderLoadingSkeleton() : (
                <div className="grid gap-4 md:grid-cols-2">
                  {applications?.map((app) => renderJobApplicationCard(app))}
                  {applications?.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                      No job applications found
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Skill Inquiries Subtab */}
            <TabsContent value="skill">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Skill Inquiries</h2>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
              </div>
              
              {isLoadingSkillContacts ? renderLoadingSkeleton() : (
                <div className="grid gap-4 md:grid-cols-2">
                  {skillContacts?.map((contact) => renderContactCard(contact, 'skill'))}
                  {skillContacts?.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                      No skill inquiries found
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Material Inquiries Subtab */}
            <TabsContent value="material">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Material Inquiries</h2>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
              </div>
              
              {isLoadingMaterialContacts ? renderLoadingSkeleton() : (
                <div className="grid gap-4 md:grid-cols-2">
                  {materialContacts?.map((contact) => renderContactCard(contact, 'material'))}
                  {materialContacts?.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                      No material inquiries found
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Received Applications Subtab */}
            <TabsContent value="received">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Received Applications</h2>
              </div>
              
              <Tabs value={activeContactsTab} onValueChange={setActiveContactsTab} className="mt-4">
                <TabsList className="mb-4">
                  <TabsTrigger value="received">Job Applications</TabsTrigger>
                  <TabsTrigger value="skills">Skill Inquiries</TabsTrigger>
                  <TabsTrigger value="materials">Material Inquiries</TabsTrigger>
                </TabsList>
                
                <TabsContent value="received">
                  {renderReceivedApplicationsTable()}
                </TabsContent>
                
                <TabsContent value="skills">
                  {renderReceivedContactsTable('skill')}
                </TabsContent>
                
                <TabsContent value="materials">
                  {renderReceivedContactsTable('material')}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* My Works Tab Content */}
        <TabsContent value="myworks">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Works</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          
          {isLoadingWorks ? renderLoadingSkeleton() : (
            <div className="grid gap-4 md:grid-cols-2">
              {works?.map((work) => (
                <Card key={work.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{work.title}</h3>
                        <p className="text-sm text-muted-foreground">{work.company}</p>
                      </div>
                      <Badge variant={work.status === "In Progress" ? "secondary" : "outline"}>
                        {work.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{work.description}</p>
                    {work.payment && (
                      <p className="mt-2 font-medium text-emerald-600">{work.payment}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      {work.startDate} - {work.endDate || "Ongoing"}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(work, 'work')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!['Completed', 'Cancelled'].includes(work.status) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleStatusChange(work.id, 'work', 'Completed')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleStatusChange(work.id, 'work', 'Cancelled')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
              {works?.length === 0 && (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No works found
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* My Posts Tab Content */}
        <TabsContent value="myposts">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Posts</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          
          {isLoadingPosts ? renderLoadingSkeleton() : isPostsError ? (
            <div className="text-center py-10 text-red-500">
              Failed to load posts. Please try again.
              <Button onClick={() => refetchPosts()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Jobs Section */}
              <div>
                <h3 className="text-md font-semibold mb-4">Jobs</h3>
                {posts.jobs.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {posts.jobs.map((job) => (
                      <JobPostCard
                        key={job.id}
                        job={job}
                        onView={() => handleViewDetails(job, 'job')}
                        onEdit={() => handleEdit(job, 'job')}
                        onDelete={() => handleDelete(job.id, 'job')}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No jobs posted yet
                  </div>
                )}
              </div>

              {/* Skills Section */}
              <div>
                <h3 className="text-md font-semibold mb-4">Skills</h3>
                {posts.skills.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {posts.skills.map((skill) => (
                      <SkillPostCard
                        key={skill.id}
                        skill={skill}
                        onView={() => handleViewDetails(skill, 'skill')}
                        onEdit={() => handleEdit(skill, 'skill')}
                        onDelete={() => handleDelete(skill.id, 'skill')}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No skills posted yet
                  </div>
                )}
              </div>

              {/* Materials Section */}
              <div>
                <h3 className="text-md font-semibold mb-4">Materials</h3>
                {posts.materials.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {posts.materials.map((material) => (
                      <MaterialPostCard
                        key={material.id}
                        material={material}
                        onView={() => handleViewDetails(material, 'material')}
                        onEdit={() => handleEdit(material, 'material')}
                        onDelete={() => handleDelete(material.id, 'material')}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No materials posted yet
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Invoices Tab Content */}
        <TabsContent value="invoices">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Invoices</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          
          {isLoadingInvoices ? renderLoadingSkeleton() : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.title}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === "Paid" ? "secondary" : "outline"}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(invoice, 'invoice')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {invoices?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {detailsItem?.title || detailsItem?.skill_name || detailsItem?.invoiceNumber || "Details"}
            </DialogTitle>
            <DialogDescription>
              View detailed information
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[70vh] overflow-y-auto">
            {renderDetailsContent()}
          </div>
          
          <DialogFooter className="flex items-center justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsOpen(false)}
            >
              Close
            </Button>
            
            {renderActionButtons()}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
