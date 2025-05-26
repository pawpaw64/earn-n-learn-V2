
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import axios from 'axios';

interface EscrowTransaction {
  id: string;
  title: string;
  jobType: string;
  amount: number;
  status: 'funded' | 'in_progress' | 'completed' | 'released' | 'disputed' | 'refunded';
  clientName: string;
  clientEmail: string;
  providerName: string;
  providerEmail: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  isProvider: boolean;
}

export function EscrowTransactions() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<EscrowTransaction | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchEscrowTransactions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setIsLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8080/api/wallet/escrow', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error fetching escrow transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrowTransactions();
  }, []);

  const handleReleasePayment = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.post(`http://localhost:8080/api/wallet/escrow/${id}/release`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh transactions
      fetchEscrowTransactions();
      
      setIsReleaseDialogOpen(false);
      setCurrentTransaction(null);
      
      toast({
        title: "Payment Released",
        description: "The payment has been released to the service provider."
      });
    } catch (error) {
      console.error('Error releasing payment:', error);
      toast({
        title: "Error",
        description: "Failed to release payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDispute = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the dispute.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.post(`http://localhost:8080/api/wallet/escrow/${id}/dispute`, 
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh transactions
      fetchEscrowTransactions();
      
      setIsDisputeDialogOpen(false);
      setCurrentTransaction(null);
      setDisputeReason('');
      
      toast({
        title: "Dispute Filed",
        description: "Your dispute has been filed and will be reviewed by our team."
      });
    } catch (error) {
      console.error('Error filing dispute:', error);
      toast({
        title: "Error",
        description: "Failed to file dispute. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'funded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Funded</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">Completed</Badge>;
      case 'released':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Released</Badge>;
      case 'disputed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Disputed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Escrow Transactions</h2>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading escrow transactions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transactions.map((transaction) => (
            <Card key={transaction.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{transaction.title}</CardTitle>
                    <CardDescription>
                      {transaction.isProvider ? (
                        <>Client: {transaction.clientName}</>
                      ) : (
                        <>Provider: {transaction.providerName}</>
                      )}
                    </CardDescription>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold">${transaction.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{format(new Date(transaction.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  {transaction.description && (
                    <div className="mt-2">
                      <span className="text-muted-foreground text-sm">Description:</span>
                      <p className="text-sm">{transaction.description}</p>
                    </div>
                  )}
                  
                  {transaction.status === 'completed' && !transaction.isProvider && (
                    <div className="pt-2 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentTransaction(transaction);
                          setIsDisputeDialogOpen(true);
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Dispute
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCurrentTransaction(transaction);
                          setIsReleaseDialogOpen(true);
                        }}
                      >
                        Release Payment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {transactions.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No escrow transactions found</p>
            </div>
          )}
        </div>
      )}
      
      {/* Release Payment Dialog */}
      <Dialog 
        open={isReleaseDialogOpen} 
        onOpenChange={() => {
          setIsReleaseDialogOpen(false);
          setCurrentTransaction(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Release Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to release the payment for {currentTransaction?.title}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">${currentTransaction?.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Provider:</span>
                <span>{currentTransaction?.providerName}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsReleaseDialogOpen(false);
                setCurrentTransaction(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => currentTransaction && handleReleasePayment(currentTransaction.id)}
            >
              Release Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dispute Dialog */}
      <Dialog 
        open={isDisputeDialogOpen} 
        onOpenChange={(open) => {
          setIsDisputeDialogOpen(open);
          if (!open) {
            setCurrentTransaction(null);
            setDisputeReason('');
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>File a Dispute</DialogTitle>
            <DialogDescription>
              Please provide a reason for disputing the payment for {currentTransaction?.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">${currentTransaction?.amount.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disputeReason">Reason for Dispute</Label>
                <Textarea
                  id="disputeReason"
                  placeholder="Please explain why you're disputing this payment..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDisputeDialogOpen(false);
                setCurrentTransaction(null);
                setDisputeReason('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => currentTransaction && handleDispute(currentTransaction.id, disputeReason)}
              disabled={!disputeReason.trim()}
            >
              File Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
