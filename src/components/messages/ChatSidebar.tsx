
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageCircle, Users, Plus } from 'lucide-react';
import { ChatType, GroupType } from '@/types/messages';
import { getRecentChats, getUserGroups, searchUsers } from '@/services/messages';
import { ChatItem } from './ChatItem';
import { GroupItem } from './GroupItem';
import { CreateGroupDialog } from './CreateGroupDialog';
import { NewChatDialog } from './NewChatDialog';

interface ChatSidebarProps {
  onSelectChat: (id: number, type: 'direct' | 'group') => void;
  activeChat?: { id: number; type: 'direct' | 'group' };
}

export function ChatSidebar({ onSelectChat, activeChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);
  
  // Fetch user's recent chats
  const { 
    data: chats = [],
    isLoading: isLoadingChats,
  } = useQuery({
    queryKey: ['recentChats'],
    queryFn: getRecentChats,
  });
  
  // Fetch user's groups
  const {
    data: groups = [],
    isLoading: isLoadingGroups,
  } = useQuery({
    queryKey: ['userGroups'],
    queryFn: getUserGroups,
  });
  
  return (
    <div className="w-full md:w-80 border-r flex flex-col h-full ">
      <div className="flex items-center justify-between p-4">
        {/* <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Inpu
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}
      </div>
      
      <Tabs defaultValue="chats" className="flex-1 flex flex-col min-h-0">
  <TabsList className="user-friendly-tabs cols-2 mx-4 mt-2 flex-shrink-0 p-1 bg-gray-50 rounded-xl border shadow-sm">
          <TabsTrigger value="chats" className="user-friendly-tab flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm">
            <MessageCircle className="h-4 w-4" />
            <span>Chats</span>
          </TabsTrigger>
          <TabsTrigger value="groups" className="user-friendly-tab flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm">
            <Users className="h-4 w-4" />
            <span>Groups</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="flex-1 flex flex-col min-h-0 mt-2 data-[state=inactive]:hidden">
          <div className="p-2 flex justify-end flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsStartingNewChat(true)}
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
          
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-2 space-y-1">
              {isLoadingChats ? (
                <div className="flex items-center justify-center p-4">
                  Loading chats...
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                chats
                  .filter((chat: ChatType) => 
                    searchQuery ? 
                      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) : 
                      true
                  )
                  .map((chat: ChatType) => (
                    <ChatItem 
                      key={chat.id}
                      chat={chat}
                      isActive={activeChat?.type === 'direct' && activeChat.id === chat.id}
                      onClick={() => onSelectChat(chat.id, 'direct')}
                    />
                  ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="groups" className="flex-1 flex flex-col min-h-0 mt-2 data-[state=inactive]:hidden">
          <div className="p-2 flex justify-end flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsCreatingGroup(true)}
            >
              <Plus className="h-4 w-4" />
              New Group
            </Button>
          </div>
          
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-2 space-y-1">
              {isLoadingGroups ? (
                <div className="flex items-center justify-center p-4">
                  Loading groups...
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No groups yet
                </div>
              ) : (
                groups
                  .filter((group: GroupType) => 
                    searchQuery ? 
                      group.name.toLowerCase().includes(searchQuery.toLowerCase()) : 
                      true
                  )
                  .map((group: GroupType) => (
                    <GroupItem 
                      key={group.id}
                      group={group}
                      isActive={activeChat?.type === 'group' && activeChat.id === group.id}
                      onClick={() => onSelectChat(group.id, 'group')}
                    />
                  ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <CreateGroupDialog
        open={isCreatingGroup}
        onOpenChange={setIsCreatingGroup}
      />
      
      <NewChatDialog
        open={isStartingNewChat}
        onOpenChange={setIsStartingNewChat}
        onSelectUser={(userId) => {
          onSelectChat(userId, 'direct');
          setIsStartingNewChat(false);
        }}
      />
    </div>
  );
}
