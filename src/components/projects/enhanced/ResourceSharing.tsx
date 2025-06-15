
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Link, Download, Share, Plus } from "lucide-react";

interface Resource {
  id: number;
  name: string;
  type: 'file' | 'link' | 'document';
  url: string;
  description: string;
  uploadedBy: string;
  uploadedAt: string;
  size?: string;
  category: string;
}

interface ResourceSharingProps {
  projectId: number;
  userRole: 'provider' | 'client';
}

export function ResourceSharing({ projectId, userRole }: ResourceSharingProps) {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      name: "Project Requirements.pdf",
      type: 'file',
      url: "/mock-file.pdf",
      description: "Detailed project requirements and specifications",
      uploadedBy: 'Client Name',
      uploadedAt: '2024-06-15',
      size: '2.4 MB',
      category: 'requirements'
    },
    {
      id: 2,
      name: "Design Mockups",
      type: 'link',
      url: "https://figma.com/mock-design",
      description: "UI/UX design mockups and prototypes",
      uploadedBy: 'Client Name',
      uploadedAt: '2024-06-16',
      category: 'design'
    },
    {
      id: 3,
      name: "Database Schema.sql",
      type: 'file',
      url: "/mock-schema.sql",
      description: "Initial database schema and structure",
      uploadedBy: 'John Provider',
      uploadedAt: '2024-06-18',
      size: '15 KB',
      category: 'development'
    },
    {
      id: 4,
      name: "API Documentation",
      type: 'document',
      url: "/api-docs",
      description: "REST API endpoints and documentation",
      uploadedBy: 'John Provider',
      uploadedAt: '2024-06-19',
      category: 'documentation'
    }
  ]);

  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'file' as const,
    url: '',
    description: '',
    category: 'general'
  });

  const categories = [
    'requirements',
    'design',
    'development',
    'documentation',
    'testing',
    'general'
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'file': return <File className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'document': return <File className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'requirements': 'bg-blue-100 text-blue-800',
      'design': 'bg-purple-100 text-purple-800',
      'development': 'bg-green-100 text-green-800',
      'documentation': 'bg-yellow-100 text-yellow-800',
      'testing': 'bg-red-100 text-red-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
  };

  const handleAddResource = () => {
    const resource: Resource = {
      id: Date.now(),
      ...newResource,
      uploadedBy: userRole === 'client' ? 'Client Name' : 'John Provider',
      uploadedAt: new Date().toISOString().split('T')[0],
      ...(newResource.type === 'file' && { size: '1.2 MB' })
    };
    setResources([...resources, resource]);
    setNewResource({
      name: '',
      type: 'file',
      url: '',
      description: '',
      category: 'general'
    });
    setShowAddResource(false);
  };

  const groupedResources = resources.reduce((groups, resource) => {
    const category = resource.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(resource);
    return groups;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Resource Sharing</h3>
          <p className="text-sm text-muted-foreground">
            {resources.length} resources shared
          </p>
        </div>
        <Button onClick={() => setShowAddResource(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {showAddResource && (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Share New Resource</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newResource.name}
                  onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                  placeholder="Resource name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({...newResource, type: e.target.value as any})}
                  className="w-full p-2 border rounded"
                >
                  <option value="file">File Upload</option>
                  <option value="link">External Link</option>
                  <option value="document">Document</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">
                {newResource.type === 'file' ? 'File' : 'URL'}
              </label>
              {newResource.type === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <Input type="file" className="hidden" />
                </div>
              ) : (
                <Input
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  placeholder="https://..."
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newResource.category}
                  onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newResource.description}
                onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                placeholder="Resource description"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddResource} size="sm">Share Resource</Button>
              <Button onClick={() => setShowAddResource(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {Object.entries(groupedResources).map(([category, categoryResources]) => (
          <div key={category}>
            <h4 className="font-medium mb-2 capitalize">{category}</h4>
            <div className="space-y-2">
              {categoryResources.map((resource) => (
                <Card key={resource.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getResourceIcon(resource.type)}
                          <h5 className="font-medium">{resource.name}</h5>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(resource.category)}`}>
                            {resource.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Shared by {resource.uploadedBy}</span>
                          <span>{resource.uploadedAt}</span>
                          {resource.size && <span>{resource.size}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
