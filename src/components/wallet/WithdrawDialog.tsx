
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet } from "lucide-react";

interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  maxAmount: number;
}

export function WithdrawDialog({ isOpen, onClose, onWithdraw, maxAmount }: WithdrawDialogProps) {
  const [amount, setAmount] = useState<string>("50");
  const [withdrawMethod, setWithdrawMethod] = useState<string>("bank");
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
      if (!isNaN(amountValue) && amountValue > 0 && amountValue <= maxAmount) {
        onWithdraw(amountValue);
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
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Withdraw your funds to your preferred payment method.
              Available balance: ${maxAmount.toFixed(2)}
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
              <Label htmlFor="withdrawMethod" className="text-right">
                Method
              </Label>
              <Select 
                value={withdrawMethod}
                onValueChange={setWithdrawMethod}
              >
                <SelectTrigger id="withdrawMethod" className="col-span-3">
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="mobile">Other Mobile Wallet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Show bKash number field if bKash is selected */}
            {withdrawMethod === 'bkash' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bkashNumber" className="text-right">
                  bKash Number
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="bkashNumber"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                  />
                  <Wallet className="h-5 w-5 text-pink-500 flex-shrink-0" />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              variant="default"
              disabled={
                isLoading || 
                !amount || 
                parseFloat(amount) <= 0 || 
                parseFloat(amount) > maxAmount ||
                (withdrawMethod === 'bkash' && !bkashNumber)
              }
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
