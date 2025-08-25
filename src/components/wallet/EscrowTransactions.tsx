
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClientEscrowCard } from "./escrow/ClientEscrowCard";
import { ProviderEscrowCard } from "./escrow/ProviderEscrowCard";
import { ProgressSteps, Step } from "@/components/ui/progress-steps";
import { Users, Wallet2 } from "lucide-react";
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

  const getEscrowSteps = (status: string): Step[] => {
    const steps = [
      { title: "Escrow Deposited", description: "Funds secured" },
      { title: "Job In Progress", description: "Work started" },
      { title: "Job Completed", description: "Work finished" },
      { title: "Payment Released", description: "Funds transferred" }
    ];

    switch (status) {
      case 'funded':
        return steps.map((step, index) => ({
          ...step,
          status: (index === 0 ? 'current' : 'pending') as Step['status']
        }));
      case 'in_progress':
        return steps.map((step, index) => ({
          ...step,
          status: (index === 0 ? 'completed' : index === 1 ? 'current' : 'pending') as Step['status']
        }));
      case 'completed':
        return steps.map((step, index) => ({
          ...step,
          status: (index <= 1 ? 'completed' : index === 2 ? 'current' : 'pending') as Step['status']
        }));
      case 'released':
        return steps.map((step) => ({
          ...step,
          status: 'completed' as Step['status']
        }));
      case 'disputed':
        return [
          ...steps.slice(0, 2).map(step => ({ ...step, status: 'completed' as Step['status'] })),
          { title: "Dispute Resolution", description: "Under review", status: 'current' as Step['status'] },
          { title: "Resolution Complete", description: "Awaiting outcome", status: 'pending' as Step['status'] }
        ];
      default:
        return steps.map((step, index) => ({
          ...step,
          status: (index === 0 ? 'current' : 'pending') as Step['status']
        }));
    }
  };
  
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

  const clientTransactions = transactions.filter(tx => !tx.isProvider);
  const providerTransactions = transactions.filter(tx => tx.isProvider);

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
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Client ({clientTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="provider" className="flex items-center gap-2">
              <Wallet2 className="w-4 h-4" />
              Provider ({providerTransactions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{transaction.title}</h3>
                        <p className="text-muted-foreground">${transaction.amount.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {transaction.isProvider ? 'Provider' : 'Client'}
                        </p>
                        <p className="text-sm font-medium">
                          {transaction.isProvider ? transaction.clientName : transaction.providerName}
                        </p>
                      </div>
                    </div>
                    
                    <ProgressSteps steps={getEscrowSteps(transaction.status)} />
                    
                    {!transaction.isProvider && (
                      <div className="flex gap-2 pt-4">
                        {(transaction.status === 'completed' || transaction.status === 'in_progress') && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCurrentTransaction(transaction);
                                setIsDisputeDialogOpen(true);
                              }}
                            >
                              Dispute
                            </Button>
                            {transaction.status === 'completed' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setCurrentTransaction(transaction);
                                  setIsReleaseDialogOpen(true);
                                }}
                              >
                                Release Payment
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              
              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No escrow transactions found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="client" className="mt-6">
            <div className="space-y-6">
              {clientTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{transaction.title}</h3>
                        <p className="text-muted-foreground">${transaction.amount.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Provider</p>
                        <p className="text-sm font-medium">{transaction.providerName}</p>
                      </div>
                    </div>
                    
                    <ProgressSteps steps={getEscrowSteps(transaction.status)} />
                    
                    <div className="flex gap-2 pt-4">
                      {(transaction.status === 'completed' || transaction.status === 'in_progress') && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentTransaction(transaction);
                              setIsDisputeDialogOpen(true);
                            }}
                          >
                            Dispute
                          </Button>
                          {transaction.status === 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setCurrentTransaction(transaction);
                                setIsReleaseDialogOpen(true);
                              }}
                            >
                              Release Payment
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {clientTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No client transactions found</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="provider" className="mt-6">
            <div className="space-y-6">
              {providerTransactions.map((transaction) => (
                <Card key={transaction.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{transaction.title}</h3>
                        <p className="text-muted-foreground">${transaction.amount.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Client</p>
                        <p className="text-sm font-medium">{transaction.clientName}</p>
                      </div>
                    </div>
                    
                    <ProgressSteps steps={getEscrowSteps(transaction.status)} />
                    
                    {transaction.description && (
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              
              {providerTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No provider transactions found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
