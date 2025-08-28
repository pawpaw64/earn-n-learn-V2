import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Building2 } from "lucide-react";

interface SSLCommerzTopUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: (amount: number) => void;
}

export function SSLCommerzTopUpDialog({ isOpen, onClose, onTopUp }: SSLCommerzTopUpDialogProps) {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    
    setIsLoading(true);
    onTopUp(amount);
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-500" />
            Top Up Wallet with SSLCommerz
          </DialogTitle>
          <DialogDescription>
            Secure payment processing through SSLCommerz. Choose your amount and proceed to payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (BDT)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Quick Amounts</Label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className={amount === quickAmount ? "bg-emerald-50 border-emerald-500" : ""}
                  >
                    ৳{quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Available Payment Methods</Label>
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
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={amount <= 0 || isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? "Processing..." : `Pay ৳${amount.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}