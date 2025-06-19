// Enhanced PostCard.tsx with better color differentiation
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, Eye, Share2, MoreHorizontal } from 'lucide-react';
import { PostType } from '@/types/campus';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: PostType;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onView: (postId: number) => void;
  compact?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onView,
  compact = false
}) => {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
 
  const handleLike = async () => {
    try {
      await onLike(post.id);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  const getPostTypeTheme = () => {
    switch (post.type) {
      case 'question': 
        return {
          cardBorder: 'border-blue-200 hover:border-blue-300',
          cardBg: 'bg-blue-50/30 hover:bg-blue-50/50',
          badge: 'bg-blue-100 text-blue-800',
          accent: 'text-blue-600',
          icon: 'text-blue-500',
          separator: 'bg-blue-200'
        };
      case 'discussion': 
        return {
          cardBorder: 'border-green-200 hover:border-green-300',
          cardBg: 'bg-green-50/30 hover:bg-green-50/50',
          badge: 'bg-green-100 text-green-800',
          accent: 'text-green-600',
          icon: 'text-green-500',
          separator: 'bg-green-200'
        };
      case 'announcement': 
        return {
          cardBorder: 'border-amber-200 hover:border-amber-300',
          cardBg: 'bg-amber-50/30 hover:bg-amber-50/50',
          badge: 'bg-amber-100 text-amber-800',
          accent: 'text-amber-600',
          icon: 'text-amber-500',
          separator: 'bg-amber-200'
        };
      case 'poll': 
        return {
          cardBorder: 'border-purple-200 hover:border-purple-300',
          cardBg: 'bg-purple-50/30 hover:bg-purple-50/50',
          badge: 'bg-purple-100 text-purple-800',
          accent: 'text-purple-600',
          icon: 'text-purple-500',
          separator: 'bg-purple-200'
        };
      default: 
        return {
          cardBorder: 'border-gray-200 hover:border-gray-300',
          cardBg: 'bg-gray-50/30 hover:bg-gray-50/50',
          badge: 'bg-gray-100 text-gray-800',
          accent: 'text-gray-600',
          icon: 'text-gray-500',
          separator: 'bg-gray-200'
        };
    }
  };

  const theme = getPostTypeTheme();

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer ${theme.cardBorder} ${theme.cardBg}`}
      onClick={() => onView(post.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author_avatar} />
              <AvatarFallback className={theme.cardBg}>
                {post.author_name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author_name}</span>
                <Badge variant="secondary" className={theme.badge}>
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
          <Button variant="ghost" size="sm" className={theme.icon}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className={`font-semibold text-lg mb-2 ${theme.accent}`}>
              {post.title}
            </h3>
            <p className="text-muted-foreground">
              {compact ? truncateContent(post.content, 200) : post.content}
            </p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`text-xs ${theme.badge.replace('bg-100', 'bg-50')}`}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {post.attachment_url && (
            <div className={`rounded-md border p-2 ${theme.cardBorder}`}>
              <p className={`text-sm ${theme.icon}`}>📎 Attachment</p>
            </div>
          )}

          <Separator className={theme.separator} />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : theme.icon}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                {likesCount}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 ${theme.icon}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onComment(post.id);
                }}
              >
                <MessageSquare className="h-4 w-4" />
                {post.comments_count}
              </Button>

              <div className={`flex items-center gap-2 text-sm ${theme.icon}`}>
                <Eye className="h-4 w-4" />
                {post.views_count}
              </div>
            </div>

            <Button variant="ghost" size="sm" className={theme.icon}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};