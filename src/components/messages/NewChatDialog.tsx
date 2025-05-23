
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { searchUsers } from '@/services/messages';

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: number) => void;
}

export function NewChatDialog({ open, onOpenChange, onSelectUser }: NewChatDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Search for users when query changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      
      try {
        setIsSearching(true);
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    const delaySearch = setTimeout(fetchUsers, 500);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          
          <ScrollArea className="h-64 border rounded-md">
            {isSearching ? (
              <div className="flex items-center justify-center p-4">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                {searchQuery.length < 2 
                  ? 'Type at least 2 characters to search'
                  : 'No users found with this name'}
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => onSelectUser(user.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
