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
      <div className="flex items-end justify-end gap-2 mb-3 pr-2">
        <div className="flex flex-col items-end">
          <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-br-md max-w-md break-words shadow-sm">
            {message.content}
            {message.has_attachment && message.attachment_url && (
              <div className="mt-2">
                <img 
                  src={message.attachment_url} 
                  alt="Attachment" 
                  className="max-w-full rounded-md"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {message.is_read && (
              <span className="text-xs text-muted-foreground">Read</span>
            )}
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-3 pl-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender_avatar} />
        <AvatarFallback>{message.sender_name?.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col">
        <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-bl-md max-w-md break-words shadow-sm">
          {message.sender_name && (
            <div className="text-xs font-semibold text-white/80 mb-1">
              {message.sender_name}
            </div>
          )}
          {message.content}
          {message.has_attachment && message.attachment_url && (
            <div className="mt-2">
              <img 
                src={message.attachment_url} 
                alt="Attachment" 
                className="max-w-full rounded-md"
              />
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground mt-1">{timestamp}</span>
      </div>
    </div>
  );
}
