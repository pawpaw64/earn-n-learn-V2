import React from "react";
import { PostType } from "@/types/campus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Eye, Share2 } from "lucide-react";
import { PollVoting } from "./PollVoting";
import { votePoll } from "@/services/campus";
import { toast } from "sonner";

interface PostCardProps {
  post: PostType;
  onLike: () => void;
  onComment: () => void;
  onViewDetails: () => void;
  onPollVote?: (postId: number) => void;
}

export function PostCard({
  post,
  onLike,
  onComment,
  onViewDetails,
  onPollVote,
}: PostCardProps) {
  const handlePollVote = async (optionId: number) => {
    try {
      await votePoll(optionId);
      toast.success("Vote recorded successfully!");
      if (onPollVote) {
        onPollVote(post.id);
      }
    } catch (error: any) {
      console.error("Error voting on poll:", error);
      if (
        error.response?.data?.message === "User has already voted on this poll"
      ) {
        toast.error("You have already voted on this poll");
      } else {
        toast.error("Failed to record vote");
      }
    }
  };
  // Add gradient backgrounds for each post type
  const getPostTypeColor = (type: string) => {
    switch (type) {
      case "question":
        return "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-200 text-blue-800 hover:bg-blue-100 border-blue-200";
      case "discussion":
        return "bg-gradient-to-r from-green-100 via-green-50 to-green-200 text-green-800 hover:bg-green-100 border-green-200";
      case "announcement":
        return "bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-200 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
      case "poll":
        return "bg-gradient-to-r from-purple-100 via-purple-50 to-purple-200 text-purple-800 hover:bg-purple-100 border-purple-200";
      default:
        return "bg-gradient-to-r from-gray-100 via-gray-50 to-gray-200 text-gray-800 hover:bg-gray-100 border-gray-200";
    }
  };

  const getCardBorderColor = (type: string) => {
    switch (type) {
      case "question":
        return "border-2 border-blue-200 hover:border-blue-400";
      case "discussion":
        return "border-2 border-green-200 hover:border-green-400";
      case "announcement":
        return "border-2 border-yellow-200 hover:border-yellow-400";
      case "poll":
        return "border-2 border-purple-200 hover:border-purple-400";
      default:
        return "border-2 border-gray-200 hover:border-gray-400";
    }
  };

  const pollOptions =
    post.poll_options?.map((option) => ({
      id: option.id,
      text: option.option_text,
      votes: option.votes || 0,
    })) || [];

  return (
    <Card
      className={`w-full hover:shadow-md transition-shadow ${getCardBorderColor(
        post.type
      )}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src={post.author_avatar} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-800 text-white">
                {post.author_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-gray-800">
                {post.author_name}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <Badge className={`${getPostTypeColor(post.type)} rounded-lg`}>
            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <h3
          className="font-semibold text-lg mb-2 cursor-pointer hover:text-primary text-gray-800"
          onClick={onViewDetails}>
          {post.title}
        </h3>

        {post.type === "poll" && pollOptions.length > 0 ? (
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
          <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
        )}

        {post.attachment_url && (
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={post.attachment_url}
              alt="Post attachment"
              className="max-w-full h-auto"
            />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className={`flex items-center gap-2 rounded-full ${
                post.is_liked
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-gray-500 hover:bg-gray-100"
              }`}>
              <Heart
                className={`h-4 w-4 ${post.is_liked ? "fill-current" : ""}`}
              />
              <span className="text-sm">{post.likes_count}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
              className="flex items-center gap-2 rounded-full text-gray-500 hover:bg-gray-100">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{post.comments_count}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
