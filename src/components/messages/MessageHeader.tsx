
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, MoreVertical, UserPlus, LogOut } from 'lucide-react';
import { GroupMemberType } from '@/types/messages';
import { GroupDetailsDialog } from './GroupDetailsDialog';

interface MessageHeaderProps {
  name: string;
  avatar?: string;
  type: 'direct' | 'group';
  memberCount?: number;
  members?: GroupMemberType[];
}

export function MessageHeader({ name, avatar, type, memberCount, members }: MessageHeaderProps) {
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);
  
  return (
    <div className="border-b p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {type === 'direct' ? (
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="bg-muted">
            <AvatarFallback>
              <Users className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        )}
        
        <div>
          <h3 className="font-medium text-lg leading-tight">{name}</h3>
          {type === 'group' && memberCount !== undefined && (
            <p className="text-sm text-muted-foreground">
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </p>
          )}
          {type === 'direct' && (
            <p className="text-xs text-muted-foreground">Online</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {type === 'group' && (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsGroupDetailsOpen(true)}
          >
            Details
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {type === 'group' && (
              <>
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Group
                </DropdownMenuItem>
              </>
            )}
            {type === 'direct' && (
              <DropdownMenuItem>
                Clear Conversation
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {type === 'group' && (
        <GroupDetailsDialog
          open={isGroupDetailsOpen}
          onOpenChange={setIsGroupDetailsOpen}
          groupName={name}
          members={members || []}
        />
      )}
    </div>
  );
}
