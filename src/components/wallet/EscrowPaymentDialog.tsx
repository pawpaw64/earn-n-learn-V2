import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, Smartphone, Building2 } from "lucide-react";

interface EscrowPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEscrow: (data: {
    providerId: number;
    jobId?: number;
    skillId?: number;
    materialId?: number;
    amount: number;
    description: string;
  }) => void;
  jobData?: {
    id: number;
    title: string;
    type: 'job' | 'skill' | 'material';
    providerId: number;
    providerName: string;
  };
}

export function EscrowPaymentDialog({ 
  isOpen, 
  onClose, 
  onCreateEscrow,
  jobData
}: EscrowPaymentDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !jobData) return;
    
    setIsLoading(true);
    
    const escrowData = {
      providerId: jobData.providerId,
      amount,
      description: description || `Escrow payment for ${jobData.title}`,
      ...(jobData.type === 'job' && { jobId: jobData.id }),
      ...(jobData.type === 'skill' && { skillId: jobData.id }),
      ...(jobData.type === 'material' && { materialId: jobData.id }),
    };
    
    onCreateEscrow(escrowData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            Create Escrow Payment
          </DialogTitle>
          <DialogDescription>
            Secure escrow payment through SSLCommerz. Funds will be held safely until work completion.
          </DialogDescription>
        </DialogHeader>

        {jobData && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Project Details</h4>
            <p className="text-sm"><strong>Title:</strong> {jobData.title}</p>
            <p className="text-sm"><strong>Provider:</strong> {jobData.providerName}</p>
            <p className="text-sm"><strong>Type:</strong> {jobData.type}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Escrow Amount (BDT)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Enter escrow amount"
                required
              />
              <p className="text-xs text-muted-foreground">
                This amount will be held in escrow until work completion
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional notes for this escrow payment..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Payment Methods</Label>
              <div className="grid gap-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Credit/Debit Cards</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, AMEX</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Available</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="font-medium">Mobile Banking</p>
                      <p className="text-sm text-muted-foreground">bKash, Nagad, Rocket</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Available</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Internet Banking</p>
                      <p className="text-sm text-muted-foreground">All major banks</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Available</Badge>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Escrow Protection</p>
                  <p className="text-xs text-blue-700">
                    Your payment is protected. Funds will only be released when you approve the completed work.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={amount <= 0 || isLoading || !jobData}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? "Processing..." : `Create Escrow ৳${amount.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}