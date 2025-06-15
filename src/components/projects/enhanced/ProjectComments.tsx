
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProjectComment {
  id: number;
  project_id: number;
  user_id: number;
  message: string;
  type: 'general' | 'milestone' | 'task';
  user_name: string;
  user_avatar?: string;
  created_at: string;
  updated_at: string;
}

interface ProjectCommentsProps {
  projectId: number;
  userRole: 'provider' | 'client';
}

export function ProjectComments({ projectId, userRole }: ProjectCommentsProps) {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editMessage, setEditMessage] = useState("");

  const loadComments = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const data = await getProjectComments(projectId);
      setComments([]);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await createProjectComment(projectId, { message: newMessage, type: 'general' });
      toast.success("Message sent successfully");
      setNewMessage("");
      loadComments();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await updateProjectComment(commentId, { message: editMessage });
      toast.success("Message updated successfully");
      setEditingComment(null);
      setEditMessage("");
      loadComments();
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      // TODO: Replace with actual API call
      // await deleteProjectComment(commentId);
      toast.success("Message deleted successfully");
      loadComments();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  if (isLoading) {
    return <div className="p-4">Loading messages...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Project Communication</h3>

      {/* Messages List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user_avatar} />
                    <AvatarFallback>
                      {comment.user_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.user_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      {comment.user_id === currentUserId && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditMessage(comment.message);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          placeholder="Edit your message..."
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingComment(null);
                              setEditMessage("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm">{comment.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Message Input */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex justify-end">
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
