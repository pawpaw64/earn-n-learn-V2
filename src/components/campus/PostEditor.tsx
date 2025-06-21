import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Paperclip, Vote } from 'lucide-react';
import { PollCreator } from './PollCreator';

interface PostEditorProps {
  onSubmit: (postData: any) => void;
  onCancel: () => void;
}

export function PostEditor({ onSubmit, onCancel }: PostEditorProps) {
  const [postType, setPostType] = useState<'question' | 'discussion' | 'announcement' | 'poll'>('discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'groups'>('public');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollData, setPollData] = useState<{ question: string; options: string[] } | null>(null);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const postData = {
      type: postType,
      title: title.trim(),
      content: content.trim(),
      tags,
      privacy,
      attachment,
      pollData: postType === 'poll' ? pollData : null
    };

    onSubmit(postData);
  };

  const handlePollCreation = (data: { question: string; options: string[] }) => {
    setPollData(data);
    setShowPollCreator(false);
    setTitle(data.question); // Use poll question as title
  };

  const isValid = title.trim() && (postType !== 'poll' || pollData);

  if (showPollCreator) {
    return (
      <PollCreator
        onCreatePoll={handlePollCreation}
        onCancel={() => setShowPollCreator(false)}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Select value={postType} onValueChange={(value: any) => {
            setPostType(value);
            if (value === 'poll') {
              setShowPollCreator(true);
            } else {
              setPollData(null);
            }
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Post Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discussion">Discussion</SelectItem>
              <SelectItem value="question">Question</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="poll">Poll</SelectItem>
            </SelectContent>
          </Select>

          <Select value={privacy} onValueChange={(value: any) => setPrivacy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="groups">Groups</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {postType === 'poll' && pollData ? (
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Poll Preview</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPollCreator(true)}
              >
                Edit Poll
              </Button>
            </div>
            <p className="font-medium mb-2">{pollData.question}</p>
            <ul className="space-y-1">
              {pollData.options.map((option, index) => (
                <li key={index} className="text-sm text-gray-600">• {option}</li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <Input
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add tags..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1"
            />
            <Button onClick={addTag} size="sm" disabled={!newTag.trim() || tags.length >= 5}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {postType !== 'poll' && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach File
            </Button>
            <span className="text-sm text-muted-foreground">
              {attachment ? attachment.name : 'No file selected'}
            </span>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid} className="flex-1">
            {postType === 'poll' ? (
              <>
                <Vote className="h-4 w-4 mr-2" />
                Create Poll
              </>
            ) : (
              'Create Post'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}