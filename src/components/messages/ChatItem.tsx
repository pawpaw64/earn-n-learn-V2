
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ChatType } from '@/types/messages';

interface ChatItemProps {
  chat: ChatType;
  isActive: boolean;
  onClick: () => void;
}

export function ChatItem({ chat, isActive, onClick }: ChatItemProps) {
  const lastMessageTime = chat.last_message_time 
    ? formatDistanceToNow(new Date(chat.last_message_time), { addSuffix: true })
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
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={chat.avatar} />
        <AvatarFallback>
          {chat.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium truncate">{chat.name}</span>
          <span className="text-xs text-muted-foreground">{lastMessageTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm truncate text-muted-foreground">
            {chat.last_message || 'Start a conversation'}
          </p>
          {chat.unread_count > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 flex items-center justify-center">
              {chat.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
