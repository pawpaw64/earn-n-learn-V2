
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface EscrowTransaction {
  id: string;
  job_title: string;
  provider_name: string;
  client_name: string;
  amount: number;
  status: 'funded' | 'in_progress' | 'completed' | 'released' | 'disputed' | 'refunded';
  funded_date: Date;
  completed_date?: Date;
  released_date?: Date;
}

export function EscrowTransactions() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
  const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<EscrowTransaction | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  
  // Load mock data - in a real app, this would be from an API
  useEffect(() => {
    // Simulating API call
    const mockData: EscrowTransaction[] = [
      {
        id: "escrow1",
        job_title: "Website Development",
        provider_name: "John Developer",
        client_name: "Alice Client",
        amount: 500,
        status: "in_progress",
        funded_date: new Date(2023, 5, 1)
      },
      {
        id: "escrow2",
        job_title: "Logo Design",
        provider_name: "Mark Designer",
        client_name: "Bob Client",
        amount: 150,
        status: "completed",
        funded_date: new Date(2023, 4, 15),
        completed_date: new Date(2023, 5, 5)
      },
      {
        id: "escrow3",
        job_title: "Content Writing",
        provider_name: "Sarah Writer",
        client_name: "Charlie Client",
        amount: 300,
        status: "released",
        funded_date: new Date(2023, 4, 10),
        completed_date: new Date(2023, 4, 25),
        released_date: new Date(2023, 4, 27)
      },
      {
        id: "escrow4",
        job_title: "Mobile App Redesign",
        provider_name: "David UX",
        client_name: "Edward Client",
        amount: 800,
        status: "funded",
        funded_date: new Date(2023, 5, 10)
      },
      {
        id: "escrow5",
        job_title: "SEO Optimization",
        provider_name: "Emma SEO",
        client_name: "Frank Client",
        amount: 350,
        status: "disputed",
        funded_date: new Date(2023, 4, 20)
      }
    ];
    
    setTransactions(mockData);
  }, []);

  const handleReleasePayment = (id: string) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? {
              ...tx,
              status: 'released',
              released_date: new Date()
            }
          : tx
      )
    );
    
    setIsReleaseDialogOpen(false);
    setCurrentTransaction(null);
    
    toast({
      title: "Payment Released",
      description: "The payment has been released to the service provider."
    });
  };

  const handleDispute = (id: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for the dispute.",
        variant: "destructive"
      });
      return;
    }
    
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? {
              ...tx,
              status: 'disputed'
            }
          : tx
      )
    );
    
    setIsDisputeDialogOpen(false);
    setCurrentTransaction(null);
    setDisputeReason('');
    
    toast({
      title: "Dispute Filed",
      description: "Your dispute has been filed and will be reviewed by our team."
    });
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{transaction.job_title}</CardTitle>
                  <CardDescription>
                    Provider: {transaction.provider_name}
                    <br />
                    Client: {transaction.client_name}
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
                  <span className="text-muted-foreground">Funded Date:</span>
                  <span>{format(transaction.funded_date, 'MMM d, yyyy')}</span>
                </div>
                {transaction.completed_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Completed Date:</span>
                    <span>{format(transaction.completed_date, 'MMM d, yyyy')}</span>
                  </div>
                )}
                {transaction.released_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Released Date:</span>
                    <span>{format(transaction.released_date, 'MMM d, yyyy')}</span>
                  </div>
                )}
                
                {transaction.status === 'completed' && (
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
              Are you sure you want to release the payment for {currentTransaction?.job_title}?
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
                <span>{currentTransaction?.provider_name}</span>
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
              Please provide a reason for disputing the payment for {currentTransaction?.job_title}.
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
