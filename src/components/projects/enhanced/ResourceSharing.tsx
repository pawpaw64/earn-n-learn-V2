
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, FileText, Image, Video, Archive, Trash2, ExternalLink, Camera, File } from "lucide-react";
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
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewResource({
        ...newResource,
        name: file.name,
        type: file.type,
        size: file.size,
        category: file.type.startsWith('image/') ? 'image' : 
                 file.type.startsWith('video/') ? 'video' :
                 file.type.includes('pdf') || file.type.includes('doc') ? 'document' : 'other'
      });
    }
  };

  const handleUploadResource = async () => {
    if (uploadType === 'file' && !selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (uploadType === 'url' && (!newResource.name.trim() || !newResource.url.trim())) {
      toast.error("Resource name and URL are required");
      return;
    }

    try {
      if (uploadType === 'file' && selectedFile) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', newResource.name);
        formData.append('description', newResource.description);
        formData.append('category', newResource.category);
        
        // TODO: Replace with actual file upload API call
        // const response = await uploadProjectFile(projectId, formData);
        toast.success("File uploaded successfully");
      } else {
        // TODO: Replace with actual URL resource API call
        // await uploadProjectResource(projectId, newResource);
        toast.success("Resource shared successfully");
      }
      
      setNewResource({ name: "", type: "", url: "", description: "", category: "document", size: 0 });
      setSelectedFile(null);
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
              Share Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Upload Type Selection */}
              <div>
                <label className="text-sm font-medium">Share Type</label>
                <Select value={uploadType} onValueChange={(value: 'file' | 'url') => setUploadType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">Upload File/Photo</SelectItem>
                    <SelectItem value="url">Share URL/Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {uploadType === 'file' ? (
                <>
                  {/* File Upload Section */}
                  <div>
                    <label className="text-sm font-medium">Select File</label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="file"
                        onChange={handleFileSelect}
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement | null)?.click()}
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Browse
                      </Button>
                    </div>
                    {selectedFile && (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          {getResourceIcon(selectedFile.type)}
                          <span className="text-sm font-medium">{selectedFile.name}</span>
                          <Badge variant="outline">{formatFileSize(selectedFile.size)}</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      value={newResource.name}
                      onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                      placeholder="Resource display name"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* URL Sharing Section */}
                  <div>
                    <label className="text-sm font-medium">Resource Name</label>
                    <Input
                      value={newResource.name}
                      onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                      placeholder="Resource name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <Input
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="Describe this resource..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newResource.category} onValueChange={(value) => setNewResource({ ...newResource, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
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
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUploadResource}>
                  {uploadType === 'file' ? (
                    <>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload File
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Share Link
                    </>
                  )}
                </Button>
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
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-muted-foreground text-center">No resources shared yet.</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Upload files, photos, or share links with your team.
              </p>
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
