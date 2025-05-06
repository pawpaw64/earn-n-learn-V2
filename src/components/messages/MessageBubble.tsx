
import React from 'react';
import { MessageType } from '@/types/messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: MessageType;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const timestamp = message.created_at 
    ? format(new Date(message.created_at), 'h:mm a')
    : '';
  
  if (isOwnMessage) {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="flex flex-col items-end">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-br-none max-w-md break-words">
            {message.content}
          </div>
          <span className="text-xs text-muted-foreground mt-1">
            {timestamp}
            {message.is_read && " • Read"}
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-end gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender_avatar} />
        <AvatarFallback>{message.sender_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col">
        <div className="bg-muted p-3 rounded-lg rounded-bl-none max-w-md break-words">
          <div className="text-xs font-medium text-muted-foreground mb-1">
            {message.sender_name}
          </div>
          {message.content}
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {timestamp}
        </span>
      </div>
    </div>
  );
}
