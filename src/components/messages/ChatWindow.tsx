
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDirectMessages, getGroupMessages, sendMessage, sendGroupMessage } from '@/services/messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, MoreVertical, Info, LogOut, FileImage, FileVideo, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ChatWindowProps {
  chatId: number;
  chatType: 'direct' | 'group';
  chatName?: string;
  chatAvatar?: string;
  onLeaveChat?: () => void;
}

export function ChatWindow({ chatId, chatType, chatName, chatAvatar, onLeaveChat }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      // Check file type
      const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument'];
      const isAllowedType = allowedTypes.some(type => file.type.startsWith(type));
      
      if (!isAllowedType) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image, video, PDF, or document file',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId.toString());
    formData.append('chatType', chatType);

    const response = await fetch('http://localhost:8080/api/messages/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.fileUrl;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || chatId === 0) return;

    try {
      setIsTyping(true);
      
      let attachmentUrl = null;
      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
      }
      
      if (chatType === 'direct') {
        await sendMessage(chatId, newMessage.trim() || 'File attachment', !!selectedFile, attachmentUrl);
      } else {
        await sendGroupMessage(chatId, newMessage.trim() || 'File attachment', !!selectedFile, attachmentUrl);
      }
      
      setNewMessage('');
      setSelectedFile(null);
      setFilePreview(null);
      
      // Refresh messages
      queryClient.invalidateQueries({ 
        queryKey: [chatType === 'direct' ? 'directMessages' : 'groupMessages', chatId] 
      });
      queryClient.invalidateQueries({ queryKey: ['recentChats'] });
      queryClient.invalidateQueries({ queryKey: ['userGroups'] });
      
      toast({
        title: 'Message sent',
        description: selectedFile ? 'Message with attachment sent successfully' : 'Message sent successfully',
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleLeaveChat = async () => {
    if (chatType === 'group' && onLeaveChat) {
      try {
        const response = await fetch(`http://localhost:8080/api/messages/groups/${chatId}/leave`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          onLeaveChat();
          toast({
            title: 'Left group',
            description: 'You have left the group successfully',
          });
        }
      } catch (error) {
        console.error('Error leaving group:', error);
        toast({
          title: 'Error',
          description: 'Failed to leave group',
          variant: 'destructive',
        });
      }
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-4 w-4" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
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
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white flex-shrink-0">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowDetails(true)}>
              <Info className="h-4 w-4 mr-2" />
              Details
            </DropdownMenuItem>
            {chatType === 'group' && (
              <DropdownMenuItem onClick={handleLeaveChat} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Leave Group
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area - Scrollable */}
      <ScrollArea className="flex-1 bg-gray-50">
        <div className="p-4 space-y-4">
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
                        {message.has_attachment && message.attachment_url && (
                          <div className="mt-2">
                            {message.attachment_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img 
                                src={message.attachment_url} 
                                alt="Attachment" 
                                className="max-w-full max-h-64 rounded-md cursor-pointer"
                                onClick={() => window.open(message.attachment_url, '_blank')}
                              />
                            ) : message.attachment_url.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video 
                                src={message.attachment_url} 
                                controls
                                className="max-w-full max-h-64 rounded-md"
                              />
                            ) : (
                              <a 
                                href={message.attachment_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 underline"
                              >
                                <File className="h-4 w-4" />
                                View Attachment
                              </a>
                            )}
                          </div>
                        )}
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
      </ScrollArea>

      {/* File Preview */}
      {selectedFile && (
        <div className="border-t p-2 bg-white flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 flex-1">
            {getFileIcon(selectedFile.type)}
            <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
            {filePreview && (
              <img src={filePreview} alt="Preview" className="h-8 w-8 rounded object-cover" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedFile(null);
              setFilePreview(null);
            }}
          >
            Remove
          </Button>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t p-4 bg-white flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
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
            disabled={(!newMessage.trim() && !selectedFile) || isTyping}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={chatAvatar} />
                <AvatarFallback>{chatName?.charAt(0) || 'C'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{chatName}</h3>
                <p className="text-sm text-gray-500">
                  {chatType === 'group' ? 'Group Chat' : 'Direct Message'}
                </p>
              </div>
            </div>
            {chatType === 'group' && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Members: Loading...</p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setShowDetails(false);
                    handleLeaveChat();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Group
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
