
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { fetchUserApplications, fetchUserWorks, fetchUserPosts, fetchUserInvoices } from '@/services';

interface Application {
  id: number;
  jobTitle: string;
  status: string;
  appliedDate: string;
}

interface Work {
  id: number;
  title: string;
  status: string;
  deadline: string;
}

interface Post {
  id: number;
  title: string;
  type: string;
  status: string;
}

interface Invoice {
  id: number;
  amount: number;
  status: string;
  date: string;
}

export default function MyWork() {
  const [activeTab, setActiveTab] = useState("applications");
  
  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: fetchUserApplications
  });

  const { data: works = [] } = useQuery<Work[]>({
    queryKey: ['works'],
    queryFn: fetchUserWorks
  });

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchUserPosts
  });

  const { data: invoices = [] } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: fetchUserInvoices
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Work</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="works">Works</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{application.jobTitle}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Applied: {application.appliedDate}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="works" className="space-y-4">
          {works.map((work) => (
            <Card key={work.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{work.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    work.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    work.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {work.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Deadline: {work.deadline}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="posts" className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-500">{post.type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    post.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">${invoice.amount}</h3>
                    <p className="text-sm text-gray-500">{invoice.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
