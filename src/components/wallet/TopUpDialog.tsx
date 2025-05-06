
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";

interface TopUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: (amount: number) => void;
}

export function TopUpDialog({ isOpen, onClose, onTopUp }: TopUpDialogProps) {
  const [amount, setAmount] = useState<string>("50");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [bkashNumber, setBkashNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const amountValue = parseFloat(amount);
      if (!isNaN(amountValue) && amountValue > 0) {
        onTopUp(amountValue);
      }
      setIsLoading(false);
      
      // Reset form
      setAmount("50");
      setBkashNumber("");
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Top Up Your Wallet</DialogTitle>
            <DialogDescription>
              Add funds to your wallet using your preferred payment method.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  className="pl-7"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="50.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Method</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="col-span-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bkash" id="bkash" />
                  <Label htmlFor="bkash" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-pink-500" />
                    bKash
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mobile" id="mobile" />
                  <Label htmlFor="mobile">Other Mobile Wallet</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Show bKash number field if bKash is selected */}
            {paymentMethod === 'bkash' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bkashNumber" className="text-right">
                  bKash Number
                </Label>
                <Input
                  id="bkashNumber"
                  className="col-span-3"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={
                isLoading || 
                !amount || 
                parseFloat(amount) <= 0 ||
                (paymentMethod === 'bkash' && !bkashNumber)
              }
            >
              {isLoading ? "Processing..." : "Top Up"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
