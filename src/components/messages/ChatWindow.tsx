
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDirectMessages, getGroupMessages, sendMessage, sendGroupMessage } from '@/services/messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatWindowProps {
  chatId: number;
  chatType: 'direct' | 'group';
  chatName?: string;
  chatAvatar?: string;
}

export function ChatWindow({ chatId, chatType, chatName, chatAvatar }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  // Fetch messages based on chat type
  const { data: messages = [], isLoading } = useQuery({
    queryKey: [chatType === 'direct' ? 'directMessages' : 'groupMessages', chatId],
    queryFn: () => chatType === 'direct' 
      ? getDirectMessages(chatId) 
      : getGroupMessages(chatId),
    enabled: chatId > 0,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || chatId === 0) return;

    try {
      setIsTyping(true);
      
      if (chatType === 'direct') {
        await sendMessage(chatId, newMessage.trim());
      } else {
        await sendGroupMessage(chatId, newMessage.trim());
      }
      
      setNewMessage('');
      
      // Refresh messages
      queryClient.invalidateQueries({ 
        queryKey: [chatType === 'direct' ? 'directMessages' : 'groupMessages', chatId] 
      });
      queryClient.invalidateQueries({ queryKey: ['recentChats'] });
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isMyMessage = (senderId: number) => {
    return senderId === currentUserId;
  };

  if (chatId === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No chat selected</h3>
          <p className="text-gray-500">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={chatAvatar} />
            <AvatarFallback>{chatName?.charAt(0) || 'C'}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{chatName || 'Unknown'}</h2>
            {chatType === 'group' && (
              <Badge variant="outline" className="text-xs">
                Group Chat
              </Badge>
            )}
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message: any, index: number) => {
              const isMine = isMyMessage(message.sender_id);
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={message.sender_avatar} />
                      <AvatarFallback>{message.sender_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] ${isMine ? 'order-first' : ''}`}>
                    {!isMine && (
                      <p className="text-xs text-gray-500 mb-1 px-1">
                        {message.sender_name}
                      </p>
                    )}
                    
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        isMine
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-white text-gray-900 border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isMine ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {isMine && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={message.sender_avatar} />
                      <AvatarFallback>{message.sender_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Button type="button" variant="outline" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isTyping}
          />
          
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
