
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDirectMessages, sendMessage, getGroupMessages, sendGroupMessage, getGroupMembers } from '@/services/messages';
import { useSocket } from '@/contexts/SocketContext';
import { MessageType, GroupMemberType } from '@/types/messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { MessageHeader } from './MessageHeader';
import { Send, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { getUserIdFromToken } from '@/services/auth';
interface ChatWindowProps {
  chatId: number;
  chatType: 'direct' | 'group';
  chatName?: string;
  chatAvatar?: string;
}
export function ChatWindow({ chatId, chatType, chatName, chatAvatar }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { socket, joinRoom, leaveRoom } = useSocket();
  const queryClient = useQueryClient();

  // Get current user ID with multiple fallback methods
  const getValidUserId = () => {
    // Try localStorage first
    let userId = localStorage.getItem('userId');
    console.log('localStorage userId:', userId);

    // If not in localStorage, try to get from token
    if (!userId) {
      const token = localStorage.getItem('token');
      console.log('token:', token);
      if (token) {
        const tokenUserId = getUserIdFromToken(token);
        console.log('userId from token:', tokenUserId);
        if (tokenUserId) {
          userId = tokenUserId.toString();
          // Store it back in localStorage for future use
          localStorage.setItem('userId', userId);
        }
      }
    }

    const numericUserId = Number(userId);
    console.log('Final userId:', numericUserId, 'isValid:', !isNaN(numericUserId) && numericUserId > 0);
    return !isNaN(numericUserId) && numericUserId > 0 ? numericUserId : null;
  };

  const userId = getValidUserId();
  console.log('ChatWindow - Current userId:', userId);

  // If no valid userId, show error
  if (!userId) {
    console.error('No valid user ID found. User may not be properly authenticated.');
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="font-medium text-lg text-red-600">Authentication Error</h3>
          <p className="text-muted-foreground mt-1">Please log in again to access messages</p>
          <Button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="mt-4"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Fetch messages based on chat type
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
  } = useQuery({
    queryKey: [chatType === 'direct' ? 'directMessages' : 'groupMessages', chatId],
    queryFn: () => chatType === 'direct' 
      ? getDirectMessages(chatId) 
      : getGroupMessages(chatId),
    enabled: Boolean(chatId),
  });

  // Fetch group members if this is a group chat
  const {
    data: groupMembers = [],
  } = useQuery({
    queryKey: ['groupMembers', chatId],
    queryFn: () => getGroupMembers(chatId),
    enabled: chatType === 'group' && Boolean(chatId),
  });

  // Calculate room id for socket
  const getRoomId = () => {
    if (chatType === 'direct') {
      return `dm_${Math.min(userId, chatId)}_${Math.max(userId, chatId)}`;
    }
    return `group_${chatId}`;
  };

  // Join the appropriate room when chat changes
  useEffect(() => {
    if (chatId && socket) {
      const roomId = getRoomId();
      joinRoom(roomId);

      // Set up socket listeners for this chat
      socket.on('receive_message', (data: MessageType) => {
        queryClient.setQueryData(
          [chatType === 'direct' ? 'directMessages' : 'groupMessages', chatId], 
          (oldMessages: MessageType[] = []) => [...oldMessages, data]
        );

        // Also update the recent chats/groups
        queryClient.invalidateQueries({ queryKey: ['recentChats'] });
        queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      });

      socket.on('user_typing', (data: { senderId: number, senderName: string }) => {
        if (data.senderId !== userId) {
          setIsTyping(true);
          setTypingUser(data.senderName);

          // Clear typing indicator after 3 seconds
          setTimeout(() => {
            setIsTyping(false);
            setTypingUser(null);
          }, 3000);
        }
      });

      // Clean up
      return () => {
        leaveRoom(roomId);
        socket.off('receive_message');
        socket.off('user_typing');
      };
    }
  }, [chatId, chatType, socket, joinRoom, leaveRoom, userId, queryClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (chatType === 'direct') {
        const sentMessage = await sendMessage(chatId, newMessage);

        // Emit socket event
        if (socket) {
          socket.emit('send_message', {
            ...sentMessage,
            senderId: userId,
            receiverId: chatId
          });
        }
      } else {
        const sentMessage = await sendGroupMessage(chatId, newMessage);

        // Emit socket event
        if (socket) {
          socket.emit('send_message', {
            ...sentMessage,
            senderId: userId,
            groupId: chatId
          });
        }
      }

      setNewMessage('');
      // Refresh messages
      queryClient.invalidateQueries({ 
        queryKey: [chatType === 'direct' ? 'directMessages' : 'groupMessages', chatId] 
      });

      // Also update the recent chats/groups
      queryClient.invalidateQueries({ queryKey: ['recentChats'] });
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (socket) {
      const userName = localStorage.getItem('userName') || 'User';

      if (chatType === 'direct') {
        socket.emit('typing', {
          senderId: userId,
          senderName: userName,
          receiverId: chatId
        });
      } else {
        socket.emit('typing', {
          senderId: userId,
          senderName: userName,
          groupId: chatId
        });
      }
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="font-medium text-lg">Select a conversation</h3>
          <p className="text-muted-foreground mt-1">Choose a chat or start a new conversation</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <MessageHeader 
        name={chatName || ''}
        avatar={chatAvatar}
        type={chatType}
        memberCount={chatType === 'group' ? groupMembers.length : undefined}
        members={chatType === 'group' ? groupMembers : undefined}
      />

      <ScrollArea className="flex-1 p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          <>
           {messages.map((message: MessageType, index: number) => {
              // Ensure proper comparison for isOwnMessage
              const isOwnMessage = Number(message.sender_id) === userId;
              console.log('Message', index, '- sender_id:', message.sender_id, 'userId:', userId, 'isOwnMessage:', isOwnMessage);

              return (
                <MessageBubble
                  key={message.id || index}
                  message={message}
                  isOwnMessage={isOwnMessage}
                />
              );
            })}
            {isTyping && (
              <div className="text-sm text-muted-foreground italic pl-12">
                {typingUser || 'Someone'} is typing...
              </div>
            )}
            <div ref={scrollRef} />
          </>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost"
            className="flex-shrink-0"
            title="Attach file (coming soon)"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onInput={handleTyping}
            className="flex-1"
          />

          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  
}