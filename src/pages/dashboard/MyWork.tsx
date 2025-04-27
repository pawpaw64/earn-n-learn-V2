
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Trash2
} from "lucide-react";
import { 
  fetchMyApplications, 
  fetchMyWorks, 
  fetchMyPosts, 
  fetchMyInvoices,
  updateJob,
  updateSkill,
  updateMaterial,
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export default function MyWork() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [detailsItem, setDetailsItem] = useState<any>(null);
  const [detailsType, setDetailsType] = useState<string>("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const navigate = useNavigate();

  const { 
    data: applications,
    refetch: refetchApplications 
  } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications
  });

  const { 
    data: works,
    refetch: refetchWorks 
  } = useQuery({
    queryKey: ['myWorks'],
    queryFn: fetchMyWorks
  });

  const { 
    data: posts,
    refetch: refetchPosts 
  } = useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts
  });

  const { 
    data: invoices,
    refetch: refetchInvoices 
  } = useQuery({
    queryKey: ['myInvoices'],
    queryFn: fetchMyInvoices
  });

  const handleViewDetails = (item: any, type: string) => {
    setDetailsItem(item);
    setDetailsType(type);
    setIsDetailsOpen(true);
  };

  const handleEdit = (item: any, type: string) => {
    // For simplicity, we'll navigate to the posting section with the item data
    localStorage.setItem("editItem", JSON.stringify(item));
    localStorage.setItem("editType", type);
    navigate("/dashboard/browse?tab=post&type=" + type);
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
      
      toast.success(`${type} deleted successfully`);
      
      // Refetch the appropriate data
      if (['job', 'skill', 'material'].includes(type)) {
        refetchPosts();
      } else if (type === 'application') {
        refetchApplications();
      } else if (type === 'work') {
        refetchWorks();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  // Render details content based on item type
  const renderDetailsContent = () => {
    if (!detailsItem) return null;
    
    switch (detailsType) {
      case 'application':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
              <p>{detailsItem.description}</p>
            </div>
          </>
        );
      case 'job':
      case 'skill':
      case 'material':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
              <p>{detailsItem.description}</p>
            </div>
          </>
        );
      case 'work':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
              <p>{detailsItem.description}</p>
            </div>
          </>
        );
      case 'invoice':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
          </>
        );
      default:
        return <p>No details available</p>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Work</h1>
      
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="mb-4 grid grid-cols-4 gap-4">
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
                  <p className="text-sm text-muted-foreground">{app.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Applied: {app.dateApplied}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(app, 'application')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="myworks">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Works</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
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
                  <p className="text-sm text-muted-foreground">{work.description}</p>
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
          </div>
        </TabsContent>

        <TabsContent value="myposts">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Posts</h2>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          
          {/* Jobs Section */}
          {posts?.jobs && posts.jobs.length > 0 && (
            <>
              <h3 className="text-md font-semibold mt-4 mb-2">Jobs</h3>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {posts.jobs.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <Badge variant="outline">{post.type}</Badge>
                        </div>
                        <Badge variant={post.status === "Active" ? "secondary" : "outline"}>
                          {post.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{post.description}</p>
                      <p className="mt-2 font-medium text-emerald-600">{post.payment}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Posted: {post.created_at || post.postedDate}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(post, 'job')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(post, 'job')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(post.id, 'job')}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {/* Skills Section */}
          {posts?.skills && posts.skills.length > 0 && (
            <>
              <h3 className="text-md font-semibold mt-4 mb-2">Skills</h3>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {posts.skills.map((skill) => (
                  <Card key={skill.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{skill.skill_name}</h3>
                        </div>
                        <Badge variant="outline">Skill</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                      <p className="mt-2 font-medium text-emerald-600">{skill.pricing}</p>
                      <p className="text-sm">Availability: {skill.availability}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Posted: {skill.created_at}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(skill, 'skill')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(skill, 'skill')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(skill.id, 'skill')}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {/* Materials Section */}
          {posts?.materials && posts.materials.length > 0 && (
            <>
              <h3 className="text-md font-semibold mt-4 mb-2">Materials</h3>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {posts.materials.map((material) => (
                  <Card key={material.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{material.title}</h3>
                        </div>
                        <Badge variant="outline">Material</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{material.description}</p>
                      <p className="mt-2 font-medium text-emerald-600">Price: {material.price}</p>
                      <p className="text-sm">Condition: {material.condition}</p>
                      <p className="text-sm">Availability: {material.availability}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Posted: {material.created_at}</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(material, 'material')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(material, 'material')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(material.id, 'material')}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {(!posts?.jobs?.length && !posts?.skills?.length && !posts?.materials?.length) && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You haven't posted anything yet</p>
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
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {detailsItem?.title || "Details"}
            </DialogTitle>
            <DialogDescription>
              View detailed information
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
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
