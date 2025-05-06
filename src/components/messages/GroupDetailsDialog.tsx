
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { UserPlus, X } from 'lucide-react';
import { GroupMemberType } from '@/types/messages';

interface GroupDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  members: GroupMemberType[];
}

export function GroupDetailsDialog({ open, onOpenChange, groupName, members }: GroupDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <h3 className="text-lg font-medium">{groupName}</h3>
            <p className="text-sm text-muted-foreground">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Members</h4>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Add
              </Button>
            </div>
            
            <ScrollArea className="h-64 border rounded-md">
              <div className="p-2 space-y-1">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{member.name}</span>
                          {member.is_admin && (
                            <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Joined {format(new Date(member.joined_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
