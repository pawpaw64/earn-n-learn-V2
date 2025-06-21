
import React from 'react';
import { PostType } from '@/types/campus';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Eye, Share2 } from 'lucide-react';
import { PollVoting } from './PollVoting';
import { votePoll } from '@/services/campus';
import { toast } from 'sonner';

interface PostCardProps {
  post: PostType;
  onLike: () => void;
  onComment: () => void;
  onViewDetails: () => void;
  onPollVote?: (postId: number) => void;
}

export function PostCard({ post, onLike, onComment, onViewDetails, onPollVote }: PostCardProps) {
  const handlePollVote = async (optionId: number) => {
    try {
      await votePoll(optionId);
      toast.success('Vote recorded successfully!');
      if (onPollVote) {
        onPollVote(post.id);
      }
    } catch (error: any) {
      console.error('Error voting on poll:', error);
      if (error.response?.data?.message === 'User has already voted on this poll') {
        toast.error('You have already voted on this poll');
      } else {
        toast.error('Failed to record vote');
      }
    }
  };

  // Convert poll_options from backend to the format expected by PollVoting component
  const pollOptions = post.poll_options?.map(option => ({
    id: option.id,
    text: option.option_text,
    votes: option.votes || 0
  })) || [];

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author_avatar} />
              <AvatarFallback>{post.author_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{post.author_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge variant={post.type === 'question' ? 'default' : 'secondary'}>
            {post.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <h3 className="font-semibold text-lg mb-2 cursor-pointer hover:text-primary" 
            onClick={onViewDetails}>
          {post.title}
        </h3>
        
        {post.type === 'poll' && pollOptions.length > 0 ? (
          <div className="mb-4">
            <PollVoting
              question={post.title}
              options={pollOptions}
              totalVotes={post.total_votes || 0}
              hasUserVoted={post.user_voted || false}
              userVote={post.user_vote}
              onVote={handlePollVote}
            />
          </div>
        ) : (
          <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
        )}

        {post.attachment_url && (
          <div className="mb-4">
            <img 
              src={post.attachment_url} 
              alt="Post attachment" 
              className="max-w-full rounded-lg"
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`flex items-center gap-2 ${post.is_liked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
              {post.likes_count}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onComment} className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {post.comments_count}
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {post.views_count}
            </Button>
          </div>

          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
