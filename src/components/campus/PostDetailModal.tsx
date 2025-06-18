
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, Eye, Share2, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { PostType, CommentType } from '@/types/campus';
import { fetchPostById, fetchComments, createComment, togglePostLike } from '@/services/campus';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface PostDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number | null;
  onLike: (postId: number) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onOpenChange,
  postId,
  onLike
}) => {
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (isOpen && postId) {
      loadPostAndComments();
    }
  }, [isOpen, postId]);

  const loadPostAndComments = async () => {
    if (!postId) return;
    
    try {
      setIsLoading(true);
      const [postData, commentsData] = await Promise.all([
        fetchPostById(postId),
        fetchComments(postId)
      ]);
      
      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading post details:', error);
      toast.error('Failed to load post details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!postId || !newComment.trim()) return;
    
    try {
      setIsSubmittingComment(true);
      await createComment({
        post_id: postId,
        content: newComment,
        parent_id: null
      });
      
      setNewComment('');
      await loadPostAndComments();
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    try {
      await onLike(post.id);
      // Reload post to get updated like count
      const updatedPost = await fetchPostById(post.id);
      setPost(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'discussion': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-yellow-100 text-yellow-800';
      case 'poll': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!post && !isLoading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : post ? (
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author_avatar} />
                    <AvatarFallback>{post.author_name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{post.author_name}</span>
                      <Badge variant="secondary" className={getPostTypeColor(post.type)}>
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </Badge>
                      {post.type === 'question' && post.is_solved && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Solved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              <DialogTitle className="text-xl font-bold mt-4">{post.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {post.attachment_url && (
                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">📎 Attachment</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 ${post.is_liked ? 'text-red-500' : ''}`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
                  {post.likes_count}
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  {post.comments_count}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {post.views_count}
                </div>

                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author_avatar} />
                        <AvatarFallback>{comment.author_name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.author_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <Heart className={`h-3 w-3 mr-1 ${comment.is_liked ? 'fill-current text-red-500' : ''}`} />
                            {comment.likes_count}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
