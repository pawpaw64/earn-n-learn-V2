
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRecentChats, getUserGroups } from '@/services/messages';
import { ChatType, GroupType } from '@/types/messages';
import { ChatSidebar } from '@/components/messages/ChatSidebar';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { useSearchParams } from 'react-router-dom';

export default function Messages() {
  const [activeChat, setActiveChat] = useState<{ 
    id: number; 
    type: 'direct' | 'group';
    name?: string;
    avatar?: string;
  } | null>(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  // Fetch user's recent chats
  const { data: chats = [] } = useQuery({
    queryKey: ['recentChats'],
    queryFn: getRecentChats,
  });
  
  // Fetch user's groups
  const { data: groups = [] } = useQuery({
    queryKey: ['userGroups'],
    queryFn: getUserGroups,
  });
  
  // Handle selecting a chat
  const handleSelectChat = (id: number, type: 'direct' | 'group') => {
    let name = '';
    let avatar = '';
    
    // Find chat/group details
    if (type === 'direct') {
      const chat = chats.find((c: ChatType) => c.id === id);
      if (chat) {
        name = chat.name;
        avatar = chat.avatar || '';
      }
    } else if (type === 'group') {
      const group = groups.find((g: GroupType) => g.id === id);
      if (group) {
        name = group.name;
      }
    }
    
    setActiveChat({ id, type, name, avatar });
  };
  
  // Handle opening specific chat from URL params or localStorage
  useEffect(() => {
    const userIdFromUrl = searchParams.get('userId');
    const openChatWith = localStorage.getItem('openChatWith');
    const openChatType = localStorage.getItem('openChatType') as 'direct' | 'group';
    
    const chatIdToOpen = userIdFromUrl || openChatWith;
    
    if (chatIdToOpen && (chats.length > 0 || groups.length > 0)) {
      const chatId = parseInt(chatIdToOpen);
      
      if (openChatType === 'group') {
        // Look for group
        const existingGroup = groups.find((group: GroupType) => group.id === chatId);
        if (existingGroup) {
          handleSelectChat(chatId, 'group');
        }
      } else {
        // Look for direct chat or create temporary
        const existingChat = chats.find((chat: ChatType) => chat.id === chatId);
        
        if (existingChat) {
          handleSelectChat(chatId, 'direct');
        } else {
          // Create a temporary chat entry for the user
          setActiveChat({ 
            id: chatId, 
            type: 'direct',
            name: 'New Chat',
            avatar: ''
          });
        }
      }
      
      // Clean up localStorage
      localStorage.removeItem('openChatWith');
      localStorage.removeItem('openChatType');
    }
  }, [chats, groups, searchParams]);
  
  // Set up interval to refresh chats
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['recentChats'] });
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      
      if (activeChat) {
        queryClient.invalidateQueries({ 
          queryKey: [
            activeChat.type === 'direct' ? 'directMessages' : 'groupMessages', 
            activeChat.id
          ] 
        });
      }
    }, 30000); // refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [queryClient, activeChat]);
  
  return (
      <div className="space-y-6 bg-green-50 p-6 rounded-lg shadow-md">

      <h1 className="text-3xl font-bold">Messages</h1>
      
      <div className="border rounded-lg shadow-sm bg-card h-[calc(100vh-12rem)] flex">
        <ChatSidebar 
          onSelectChat={handleSelectChat}
          activeChat={activeChat || undefined}
        />
        
        <ChatWindow 
          chatId={activeChat?.id || 0}
          chatType={activeChat?.type || 'direct'}
          chatName={activeChat?.name}
          chatAvatar={activeChat?.avatar}
        />
      </div>
    </div>
  );
}
