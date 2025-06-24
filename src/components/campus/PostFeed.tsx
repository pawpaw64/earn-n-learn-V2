
import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { PostEditor } from './PostEditor';
import { SearchFilters } from './SearchFilters';
import { PostDetailModal } from './PostDetailModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostType } from '@/types/campus';
import { fetchPosts, createPost, togglePostLike } from '@/services/campus';
import { toast } from 'sonner';
import { Plus, RefreshCw } from 'lucide-react';

export const PostFeed = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [activeFilter, sortBy]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const filters = {
        type: activeFilter === 'all' ? undefined : activeFilter,
        sortBy
      };
      const fetchedPosts = await fetchPosts(filters);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (postData: any) => {
    try {
      setIsLoading(true);
      await createPost(postData);
      toast.success('Post created successfully!');
      setShowEditor(false);
      await loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await togglePostLike(postId);
      // Update the post in the list
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: !post.is_liked,
              likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleComment = (postId: number) => {
    setSelectedPostId(postId);
    setIsPostDetailOpen(true);
  };

  const handleView = (postId: number) => {
    setSelectedPostId(postId);
    setIsPostDetailOpen(true);
  };

  const handlePollVote = async (postId: number) => {
    // Reload posts to get updated poll data
    await loadPosts();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Campus Feed</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 " size="sm" onClick={loadPosts} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
         Refresh </Button>
          <Button
            variant="outline"
            className="bg-emerald-600 text-white"
            onClick={() => setShowEditor(!showEditor)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Post Editor */}
      {showEditor && (
        <PostEditor onSubmit={handleCreatePost} onCancel={() => setShowEditor(false)} />
      )}

      {/* Search and Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="question">Questions</TabsTrigger>
          <TabsTrigger value="discussion">Discussions</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
          <TabsTrigger value="poll">Polls</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found. Be the first to post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLike(post.id)}
                onComment={() => handleComment(post.id)}
                onViewDetails={() => handleView(post.id)}
                onPollVote={handlePollVote}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Post Detail Modal */}
      <PostDetailModal
        isOpen={isPostDetailOpen}
        onOpenChange={setIsPostDetailOpen}
        postId={selectedPostId}
        onLike={handleLike}
      />
    </div>
  );
};
