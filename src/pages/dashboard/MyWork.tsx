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
  Loader2
} from "lucide-react";
import { 
  fetchMyApplications, 
  fetchMyWorks, 
  fetchMyPosts, 
  fetchMyInvoices,
  deleteJob,
  deleteSkill,
  deleteMaterial 
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
interface Application {
  id: number;
  title: string;
  company: string;
  type: string;
  status: string;
  description: string;
  dateApplied: string;
}

interface Work {
  id: number;
  title: string;
  company: string;
  type: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string | null;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  title: string;
  client: string;
  amount: string;
  date: string;
  status: string;
}

export default function MyWork() {
  const navigate = useNavigate();
  const [detailsItem, setDetailsItem] = useState<any>(null);
  const [detailsType, setDetailsType] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch all data
  const { data: applications, isLoading: isLoadingApps } = useQuery<Application[]>({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications
  });

  const { data: works, isLoading: isLoadingWorks } = useQuery<Work[]>({
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

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery<Invoice[]>({
    queryKey: ['myInvoices'],
    queryFn: fetchMyInvoices
  });

  const handleViewDetails = (item: any, type: string) => {
    setDetailsItem(item);
    setDetailsType(type);
    setIsDetailsOpen(true);
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
                <p className="font-semibold">Company</p>
                <p>{detailsItem.company}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p>{detailsItem.type}</p>
              </div>
              <div>
                <p className="font-semibold">Date Applied</p>
                <p>{detailsItem.dateApplied}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p>{detailsItem.status}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">{detailsItem.description}</p>
            </div>
          </div>
        );
      case 'job':
      case 'skill':
      case 'material':
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
                <p className="font-semibold">Payment/Price</p>
                <p>{detailsItem.payment || detailsItem.price}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p>{detailsItem.status}</p>
              </div>
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
                <p>{detailsItem.title}</p>
              </div>
              <div>
                <p className="font-semibold">Company</p>
                <p>{detailsItem.company}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p>{detailsItem.type}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p>{detailsItem.status}</p>
              </div>
              <div>
                <p className="font-semibold">Start Date</p>
                <p>{detailsItem.startDate}</p>
              </div>
              <div>
                <p className="font-semibold">End Date</p>
                <p>{detailsItem.endDate || "Ongoing"}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p className="text-muted-foreground">{detailsItem.description}</p>
            </div>
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
                <p>{detailsItem.amount}</p>
              </div>
              <div>
                <p className="font-semibold">Date</p>
                <p>{detailsItem.date}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p>{detailsItem.status}</p>
              </div>
            </div>
          </div>
        );
      default:
        return <p>No details available</p>;
    }
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

        <TabsContent value="applications">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Applications</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          
          {isLoadingApps ? renderLoadingSkeleton() : (
            <div className="grid gap-4 md:grid-cols-2">
              {applications?.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{app.title}</h3>
                        <p className="text-sm text-muted-foreground">{app.company}</p>
                      </div>
                      <Badge variant={app.status === "Applied" ? "secondary" : "outline"}>
                        {app.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Applied: {app.dateApplied}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(app, 'application')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              {applications?.length === 0 && (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No applications found
                </div>
              )}
            </div>
          )}
        </TabsContent>

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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(work, 'work')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
              {detailsItem?.title || "Details"}
            </DialogTitle>
            <DialogDescription>
              View detailed information
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-[70vh] overflow-y-auto">
            {renderDetailsContent()}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}