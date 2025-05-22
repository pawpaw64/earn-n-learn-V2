
import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, PaperclipIcon, Users, User, MessageSquare, Plus } from 'lucide-react';
import { getConversations, getMessages, sendMessage } from '@/services/messages';
import { useSocket } from '@/contexts/SocketContext';
import { toast } from 'sonner';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('direct');
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { 
    joinRoom, 
    leaveRoom, 
    sendMessage: emitMessage, 
    listenForMessages, 
    stopListeningForMessages 
  } = useSocket();

  // Fetch conversations
  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations 
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    staleTime: 30000 // 30 seconds
  });

  // Fetch messages for selected conversation
  const { 
    data: messages = [], 
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['messages', selectedConversation],
    queryFn: () => selectedConversation ? getMessages(selectedConversation) : [],
    staleTime: 5000, // 5 seconds
    enabled: !!selectedConversation,
  });

  // Filter conversations based on search query
  const filteredConversations = searchQuery 
    ? conversations.filter((convo: any) => {
        const participants = convo.participants ? JSON.parse(convo.participants) : [];
        const participantNames = participants.map((p: any) => p.name.toLowerCase()).join(' ');
        const title = convo.title ? convo.title.toLowerCase() : '';
        const lastMessage = convo.last_message ? convo.last_message.toLowerCase() : '';
        
        return title.includes(searchQuery.toLowerCase()) || 
               participantNames.includes(searchQuery.toLowerCase()) ||
               lastMessage.includes(searchQuery.toLowerCase());
      })
    : conversations;

  // Check if there's a conversation to open from localStorage (from contact buttons)
  useEffect(() => {
    const openChatWith = localStorage.getItem('openChatWith');
    const openChatType = localStorage.getItem('openChatType');
    
    if (openChatWith) {
      // Find the conversation with this user or create a new one
      const recipientId = parseInt(openChatWith);
      
      if (!isNaN(recipientId)) {
        import('@/services/messages').then(({ createDirectConversation }) => {
          createDirectConversation(recipientId)
            .then(result => {
              if (result && result.conversationId) {
                // Select this conversation
                setSelectedConversation(result.conversationId);
                // Refresh conversation list
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
              }
            })
            .catch(error => {
              console.error('Error creating direct conversation:', error);
              toast.error('Failed to open conversation');
            })
            .finally(() => {
              // Clear localStorage
              localStorage.removeItem('openChatWith');
              localStorage.removeItem('openChatType');
            });
        });
      }
    }
  }, [queryClient]);

  // Socket connection for real-time messaging
  useEffect(() => {
    if (selectedConversation) {
      // Join room on conversation selection
      joinRoom(selectedConversation);
      
      // Listen for incoming messages
      listenForMessages((data) => {
        console.log('Received new message:', data);
        queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      });
      
      return () => {
        // Leave room on unmount or conversation change
        leaveRoom(selectedConversation);
        stopListeningForMessages();
      };
    }
  }, [selectedConversation, joinRoom, leaveRoom, listenForMessages, stopListeningForMessages, queryClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format timestamp to a readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Today, show only time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // This week, show day name
    const dayDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString();
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    try {
      // Send message to server via API
      const result = await sendMessage(selectedConversation, messageInput);
      setMessageInput('');
      
      // Emit message via socket for real-time updates
      emitMessage({
        conversationId: selectedConversation,
        content: messageInput,
        messageId: result.messageId,
        sender_id: parseInt(localStorage.getItem('userId') || '0')
      });
      
      // Refetch messages
      refetchMessages();
      
      // Update conversation list to show latest message
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  // Handle key press (send on Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get current user ID
  const currentUserId = parseInt(localStorage.getItem('userId') || '0');

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Left Panel - Conversation List */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 px-4 py-2">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <User size={16} />
              <span>Direct</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users size={16} />
              <span>Groups</span>
            </TabsTrigger>
            <TabsTrigger value="work" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Work</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Conversations list */}
          <TabsContent value="direct" className="flex-1 overflow-y-auto p-0 m-0">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 p-4">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500 text-center">No conversations yet</p>
                <Button variant="outline" className="mt-4 gap-2">
                  <Plus size={16} /> New Message
                </Button>
              </div>
            ) : (
              filteredConversations.map((convo: any) => {
                // Parse participants JSON
                let participants = [];
                try {
                  participants = convo.participants ? JSON.parse(convo.participants) : [];
                } catch (e) {
                  console.error('Error parsing participants:', e);
                }
                
                const firstParticipant = participants[0] || {};
                
                return (
                  <div 
                    key={convo.id}
                    onClick={() => setSelectedConversation(convo.id)}
                    className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b relative ${
                      selectedConversation === convo.id ? 'bg-green-50' : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={firstParticipant.avatar} alt={firstParticipant.name} />
                      <AvatarFallback>{firstParticipant.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">
                          {convo.is_group ? convo.title : firstParticipant.name}
                        </h3>
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(convo.updated_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 truncate">{convo.last_message}</p>
                    </div>
                    
                    {convo.unread_count > 0 && (
                      <Badge variant="default" className="bg-emerald-500 absolute top-3 right-3 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                        {convo.unread_count}
                      </Badge>
                    )}
                  </div>
                );
              })
            )}
          </TabsContent>
          
          <TabsContent value="groups" className="flex-1 overflow-y-auto p-0 m-0">
            <div className="flex flex-col items-center justify-center h-64 p-4">
              <Users className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-center">Group chats coming soon</p>
              <Button variant="outline" className="mt-4 gap-2">
                <Plus size={16} /> Create Group
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="work" className="flex-1 overflow-y-auto p-0 m-0">
            <div className="flex flex-col items-center justify-center h-64 p-4">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-center">Work-related conversations will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Right Panel - Chat Window */}
      <div className="w-2/3 flex flex-col">
        {!selectedConversation ? (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50">
            <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Select a conversation</h3>
            <p className="text-gray-500 text-center max-w-md">
              Choose a conversation from the left or start a new one to begin messaging
            </p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="p-4 border-b bg-white flex items-center justify-between">
              {isLoadingMessages ? (
                <div className="h-6 w-48 bg-gray-100 rounded animate-pulse"></div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {messages[0]?.sender_id !== currentUserId 
                          ? messages[0]?.sender_name 
                          : messages.find(m => m.sender_id !== currentUserId)?.sender_name || 'User'}
                      </h3>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Users className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {isLoadingMessages ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="bg-gray-100 h-20 w-2/3 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="flex items-start gap-2 justify-end">
                    <div className="bg-gray-100 h-12 w-2/3 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="bg-gray-100 h-16 w-2/3 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500 text-center">No messages yet. Send the first message!</p>
                </div>
              ) : (
                <>
                  {messages.map((message: any) => (
                    <div 
                      key={message.id}
                      className={`flex items-start gap-2 ${
                        message.sender_id === currentUserId ? 'justify-end' : ''
                      }`}
                    >
                      {message.sender_id !== currentUserId && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender_avatar} alt={message.sender_name} />
                          <AvatarFallback>{message.sender_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div 
                        className={`p-3 rounded-lg max-w-[70%] ${
                          message.is_system_message 
                            ? 'bg-gray-200 text-gray-700 text-sm italic mx-auto'
                            : message.sender_id === currentUserId
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white border'
                        }`}
                      >
                        {message.content}
                        <div className={`text-xs mt-1 ${
                          message.sender_id === currentUserId ? 'text-emerald-100' : 'text-gray-400'
                        }`}>
                          {new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {message.sender_id === currentUserId && message.is_read && (
                            <span className="ml-2">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </>
              )}
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" type="button">
                  <PaperclipIcon className="h-5 w-5 text-gray-500" />
                </Button>
                <Textarea
                  placeholder="Type a message..."
                  className="resize-none h-12 py-3"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button 
                  size="icon" 
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
