
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, FileText, Image, Video, Archive, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ProjectResource {
  id: number;
  project_id: number;
  name: string;
  type: string;
  url: string;
  description?: string;
  category: string;
  size: number;
  uploaded_by: number;
  uploaded_by_name: string;
  created_at: string;
}

interface ResourceSharingProps {
  projectId: number;
  userRole: 'provider' | 'client';
}

export function ResourceSharing({ projectId, userRole }: ResourceSharingProps) {
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    name: "",
    type: "",
    url: "",
    description: "",
    category: "document",
    size: 0
  });

  const loadResources = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const data = await getProjectResources(projectId);
      setResources([]);
    } catch (error) {
      console.error("Error loading resources:", error);
      toast.error("Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [projectId]);

  const handleUploadResource = async () => {
    if (!newResource.name.trim() || !newResource.url.trim()) {
      toast.error("Resource name and URL are required");
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await uploadProjectResource(projectId, newResource);
      toast.success("Resource uploaded successfully");
      setNewResource({ name: "", type: "", url: "", description: "", category: "document", size: 0 });
      setIsUploadDialogOpen(false);
      loadResources();
    } catch (error) {
      console.error("Error uploading resource:", error);
      toast.error("Failed to upload resource");
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
    try {
      // TODO: Replace with actual API call
      // await deleteProjectResource(resourceId);
      toast.success("Resource deleted successfully");
      loadResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
  };

  const getResourceIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (type.includes('pdf') || type.includes('doc')) return <FileText className="h-4 w-4" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return <div className="p-4">Loading resources...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shared Resources</h3>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Resource name"
                value={newResource.name}
                onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              />
              <Input
                placeholder="File URL or path"
                value={newResource.url}
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
              />
              <Input
                placeholder="File type (e.g., application/pdf)"
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newResource.description}
                onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              />
              <Select value={newResource.category} onValueChange={(value) => setNewResource({ ...newResource, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="File size (bytes)"
                value={newResource.size}
                onChange={(e) => setNewResource({ ...newResource, size: parseInt(e.target.value) || 0 })}
              />
              <div className="flex gap-2">
                <Button onClick={handleUploadResource}>Upload</Button>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {resources.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No resources shared yet. Upload your first resource to get started.</p>
            </CardContent>
          </Card>
        ) : (
          resources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{resource.name}</h4>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <Badge variant="outline">{resource.category}</Badge>
                        <span>{formatFileSize(resource.size)}</span>
                        <span>By {resource.uploaded_by_name}</span>
                        <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteResource(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
