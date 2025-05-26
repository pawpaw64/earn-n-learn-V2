
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { DollarSign, CheckCircle, PlayCircle, MessageSquare } from "lucide-react";
import { EscrowProgress } from "./EscrowProgress";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

interface ProviderEscrowCardProps {
  transaction: any;
  onUpdate?: () => void;
}

export function ProviderEscrowCard({ transaction, onUpdate }: ProviderEscrowCardProps) {
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [progressNotes, setProgressNotes] = useState('');
  const [showProgressForm, setShowProgressForm] = useState(false);

  const handleAcceptEscrow = async () => {
    try {
      setIsAccepting(true);
      const token = localStorage.getItem('token');
      
      await axios.post(`http://localhost:8080/api/wallet/escrow/${transaction.id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Escrow Accepted",
        description: "You have accepted the escrow transaction. Work can now begin!"
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error accepting escrow:', error);
      toast({
        title: "Error",
        description: "Failed to accept escrow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleUpdateProgress = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:8080/api/wallet/escrow/${transaction.id}/progress`, {
        status: newStatus,
        notes: progressNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Progress Updated",
        description: `Status updated to ${newStatus.replace('_', ' ')}`
      });
      
      setProgressNotes('');
      setShowProgressForm(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-800 border-green-300';
      case 'disputed': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'funds_deposited': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending_acceptance': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-purple-900">{transaction.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium">Provider (You receive)</span>
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                {transaction.job_type}
              </Badge>
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(transaction.status)} font-medium`}>
            {transaction.status.replace('_', ' ').charAt(0).toUpperCase() + transaction.status.slice(1).replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium text-purple-900">{transaction.client_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-purple-900">${transaction.amount.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{format(new Date(transaction.created_at), 'MMM d, yyyy')}</span>
            </div>
            {transaction.accepted_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accepted:</span>
                <span>{format(new Date(transaction.accepted_at), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        
        <EscrowProgress 
          status={transaction.status} 
          acceptedByProvider={transaction.accepted_by_provider}
          acceptedAt={transaction.accepted_at}
        />
        
        {transaction.description && (
          <div className="pt-2 border-t border-purple-200">
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>
        )}
        
        {transaction.progress_notes && (
          <div className="pt-2 border-t border-purple-200">
            <p className="text-sm font-medium text-purple-900">Progress Notes:</p>
            <p className="text-sm text-muted-foreground">{transaction.progress_notes}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-purple-200">
          {transaction.status === 'pending_acceptance' && (
            <div className="space-y-3">
              <p className="text-sm text-purple-600">
                The client has created an escrow payment. Accept to begin work.
              </p>
              <Button 
                onClick={handleAcceptEscrow}
                disabled={isAccepting}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isAccepting ? "Accepting..." : "Accept Escrow"}
              </Button>
            </div>
          )}
          
          {transaction.status === 'funds_deposited' && (
            <div className="space-y-3">
              <p className="text-sm text-purple-600">
                Funds are secured. You can now start working on this task.
              </p>
              <Button 
                onClick={() => handleUpdateProgress('in_progress')}
                disabled={isUpdating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Work
              </Button>
            </div>
          )}
          
          {transaction.status === 'in_progress' && (
            <div className="space-y-3">
              <p className="text-sm text-purple-600">
                Work in progress. Mark as completed when finished.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowProgressForm(!showProgressForm)}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Progress Note
                </Button>
                <Button 
                  onClick={() => handleUpdateProgress('completed')}
                  disabled={isUpdating}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </div>
            </div>
          )}
          
          {showProgressForm && (
            <div className="space-y-3 mt-3 p-3 bg-purple-50 rounded-lg">
              <Textarea
                placeholder="Add progress notes..."
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowProgressForm(false);
                    setProgressNotes('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUpdateProgress('in_progress')}
                  disabled={isUpdating || !progressNotes.trim()}
                  className="flex-1"
                >
                  Update Progress
                </Button>
              </div>
            </div>
          )}
          
          {transaction.status === 'completed' && (
            <p className="text-sm text-purple-600">
              Work completed! Waiting for client to release payment.
            </p>
          )}
          
          {transaction.status === 'released' && (
            <p className="text-sm text-green-600">
              Payment has been released to your wallet!
            </p>
          )}
          
          {transaction.status === 'disputed' && (
            <p className="text-sm text-red-600">
              This transaction is under dispute review.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
