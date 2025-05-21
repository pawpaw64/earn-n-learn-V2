
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRecentChats, getUserGroups } from '@/services/messages';
import { ChatType, GroupType } from '@/types/messages';
import { ChatSidebar } from '@/components/messages/ChatSidebar';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Messages() {
  const [activeChat, setActiveChat] = useState<{ 
    id: number; 
    type: 'direct' | 'group';
    name?: string;
    avatar?: string;
  } | null>(null);
  
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
    <div className="h-[calc(100vh-5rem)]">
      <div className="border rounded-lg shadow-sm h-full overflow-hidden flex flex-col">
        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="direct" className="py-3">Direct Messages</TabsTrigger>
            <TabsTrigger value="group" className="py-3">Group Chats</TabsTrigger>
          </TabsList>
          
          <div className="flex h-[calc(100vh-10.5rem)]">
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
        </Tabs>
      </div>
    </div>
  );
}
