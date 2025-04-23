
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
import { Filter, Calendar, Briefcase, FileText } from "lucide-react";
import { fetchMyApplications, fetchMyWorks, fetchMyPosts, fetchMyInvoices } from "@/services/api";

export default function MyWork() {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: applications } = useQuery({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications
  });

  const { data: works } = useQuery({
    queryKey: ['myWorks'],
    queryFn: fetchMyWorks
  });

  const { data: posts } = useQuery({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts
  });

  const { data: invoices } = useQuery({
    queryKey: ['myInvoices'],
    queryFn: fetchMyInvoices
  });

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
                  <Badge variant="outline">{app.type}</Badge>
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
                  <Badge variant="outline">{work.type}</Badge>
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
          <div className="grid gap-4 md:grid-cols-2">
            {posts?.map((post) => (
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
                <CardFooter>
                  <span className="text-sm text-muted-foreground">Posted: {post.postedDate}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
