
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Users } from 'lucide-react';
import { GroupType } from '@/types/messages';

interface GroupItemProps {
  group: GroupType;
  isActive: boolean;
  onClick: () => void;
}

export function GroupItem({ group, isActive, onClick }: GroupItemProps) {
  const lastMessageTime = group.last_message_time 
    ? formatDistanceToNow(new Date(group.last_message_time), { addSuffix: true })
    : '';
  
  return (
    <div 
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'hover:bg-muted/60'
      }`}
      onClick={onClick}
    >
      <Avatar className="h-10 w-10 flex-shrink-0 bg-muted">
        <AvatarFallback className="bg-primary/10">
          <Users className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium truncate flex items-center">
            {group.name}
            {group.is_admin && (
              <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">Admin</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">{lastMessageTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm truncate text-muted-foreground">
            {group.last_message || `${group.member_count} members`}
          </p>
        </div>
      </div>
    </div>
  );
}
