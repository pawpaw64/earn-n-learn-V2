
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Reply, Pin } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  authorRole: 'provider' | 'client';
  content: string;
  timestamp: string;
  pinned?: boolean;
  replies?: Comment[];
  taskId?: number;
  taskName?: string;
}

interface ProjectCommentsProps {
  projectId: number;
  userRole: 'provider' | 'client';
}

export function ProjectComments({ projectId, userRole }: ProjectCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Client Name",
      authorRole: "client",
      content: "Great progress on the setup! The development environment looks good. Can we discuss the database structure in our next call?",
      timestamp: "2024-06-18T10:30:00Z",
      pinned: true,
      taskId: 1,
      taskName: "Setup project environment"
    },
    {
      id: 2,
      author: "John Provider",
      authorRole: "provider",
      content: "Thanks! I've completed the initial setup and started working on the database design. I'll have the schema ready by tomorrow for your review.",
      timestamp: "2024-06-18T11:15:00Z",
      replies: [
        {
          id: 3,
          author: "Client Name",
          authorRole: "client",
          content: "Perfect! Looking forward to seeing it. Make sure to include the user roles table we discussed.",
          timestamp: "2024-06-18T11:45:00Z"
        }
      ]
    },
    {
      id: 4,
      author: "John Provider",
      authorRole: "provider",
      content: "I've uploaded the database schema file to the resources section. Please review and let me know if any changes are needed.",
      timestamp: "2024-06-19T09:00:00Z",
      taskId: 2,
      taskName: "Database design"
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const addComment = () => {
    const comment: Comment = {
      id: Date.now(),
      author: userRole === 'client' ? 'Client Name' : 'John Provider',
      authorRole: userRole,
      content: newComment,
      timestamp: new Date().toISOString()
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const addReply = (commentId: number) => {
    const reply: Comment = {
      id: Date.now(),
      author: userRole === 'client' ? 'Client Name' : 'John Provider',
      authorRole: userRole,
      content: replyContent,
      timestamp: new Date().toISOString()
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));
    setReplyContent('');
    setReplyTo(null);
  };

  const togglePin = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, pinned: !comment.pinned }
        : comment
    ));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const pinnedComments = comments.filter(comment => comment.pinned);
  const regularComments = comments.filter(comment => !comment.pinned);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Project Communication</h3>
          <p className="text-sm text-muted-foreground">
            {comments.length} comments • {pinnedComments.length} pinned
          </p>
        </div>
      </div>

      {/* Add Comment */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
            />
            <Button onClick={addComment} size="sm" disabled={!newComment.trim()}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pinned Comments */}
      {pinnedComments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Pin className="h-4 w-4" />
            Pinned Comments
          </h4>
          {pinnedComments.map((comment) => (
            <Card key={comment.id} className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.author}</span>
                        <Badge variant={comment.authorRole === 'client' ? 'default' : 'secondary'}>
                          {comment.authorRole}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(comment.timestamp)}
                        </span>
                        {comment.taskName && (
                          <Badge variant="outline" className="text-xs">
                            {comment.taskName}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePin(comment.id)}
                  >
                    <Pin className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Regular Comments */}
      <div className="space-y-3">
        {regularComments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <Badge variant={comment.authorRole === 'client' ? 'default' : 'secondary'}>
                        {comment.authorRole}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.timestamp)}
                      </span>
                      {comment.taskName && (
                        <Badge variant="outline" className="text-xs">
                          {comment.taskName}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm mb-2">{comment.content}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setReplyTo(comment.id)}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePin(comment.id)}
                      >
                        <Pin className="h-3 w-3 mr-1" />
                        Pin
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-2 border-l-2 border-gray-100 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{reply.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{reply.author}</span>
                          <Badge variant={reply.authorRole === 'client' ? 'default' : 'secondary'} className="text-xs">
                            {reply.authorRole}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="ml-11 mt-3 space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => addReply(comment.id)} size="sm" disabled={!replyContent.trim()}>
                      Reply
                    </Button>
                    <Button onClick={() => setReplyTo(null)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
