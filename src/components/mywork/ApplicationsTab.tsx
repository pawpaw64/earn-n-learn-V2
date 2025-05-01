
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Filter,
  Eye, 
  X, 
  Check,
  UserCheck,
  Clock
} from "lucide-react";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoadingSkeleton } from "./LoadingSkeleton";

import {
  fetchMyApplications,
  fetchUserSkillContacts,
  fetchUserMaterialContacts,
  fetchJobApplications,
  fetchSkillContacts,
  fetchMaterialContacts
} from "@/services/api";

interface ApplicationsTabProps {
  onViewDetails: (item: any, type: string) => void;
  onStatusChange: (id: number, type: string, status: string) => void;
}

export function ApplicationsTab({ onViewDetails, onStatusChange }: ApplicationsTabProps) {
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
            onClick={() => onViewDetails(app, 'application')}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {app.status === 'Applied' && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500"
              onClick={() => onStatusChange(app.id, 'job_application', 'Withdrawn')}
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
          onClick={() => onViewDetails(contact, 'contact')}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  // Render received applications table
  const renderReceivedApplicationsTable = () => {
    if (isLoadingJobApps) {
      return <LoadingSkeleton />;
    }

    const handleAcceptApplication = async (appId: number) => {
      try {
        await onStatusChange(appId, 'job_application', 'Accepted');
        refetchJobApplications();
      } catch (error) {
        console.error("Error accepting application:", error);
      }
    };

    const handleRejectApplication = async (appId: number) => {
      try {
        await onStatusChange(appId, 'job_application', 'Rejected');
        refetchJobApplications();
      } catch (error) {
        console.error("Error rejecting application:", error);
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
                      onClick={() => onViewDetails(app, 'application')}
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
      return <LoadingSkeleton />;
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
                      onClick={() => onViewDetails(contact, 'contact')}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {contact.status === 'Contact Initiated' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600"
                          onClick={() => onStatusChange(
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
                          onClick={() => onStatusChange(
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
                        onClick={() => onViewDetails(contact, 'contact')}
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

  return (
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
        
        {isLoadingApps ? <LoadingSkeleton /> : (
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
        
        {isLoadingSkillContacts ? <LoadingSkeleton /> : (
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
        
        {isLoadingMaterialContacts ? <LoadingSkeleton /> : (
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
  );
}
