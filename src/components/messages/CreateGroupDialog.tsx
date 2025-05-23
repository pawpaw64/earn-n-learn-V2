
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createGroup } from '@/services/messages';
import { toast } from 'sonner';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({ open, onOpenChange }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createGroup(groupName, groupDescription);
      
      // Refresh groups data
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      
      toast.success('Group created successfully!');
      onOpenChange(false);
      
      // Reset form
      setGroupName('');
      setGroupDescription('');
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-description">Description (Optional)</Label>
            <Textarea
              id="group-description"
              placeholder="Enter group description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              disabled={isSubmitting}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleCreateGroup} disabled={isSubmitting || !groupName.trim()}>
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
