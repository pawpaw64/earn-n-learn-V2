
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BkashService from "@/services/bkash";

interface BkashWithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  maxAmount: number;
}

export function BkashWithdrawDialog({ isOpen, onClose, onSuccess, maxAmount }: BkashWithdrawDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("50");
  const [bkashNumber, setBkashNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'input' | 'processing' | 'success' | 'error'>('input');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleBkashNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setBkashNumber(value);
  };

  const validateForm = () => {
    const amountValue = parseFloat(amount);
    
    if (!amountValue || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return false;
    }

    if (amountValue > maxAmount) {
      toast({
        title: "Insufficient Balance",
        description: `Amount cannot exceed your available balance of $${maxAmount.toFixed(2)}`,
        variant: "destructive"
      });
      return false;
    }

    if (!bkashNumber || !/^01[3-9]\d{8}$/.test(bkashNumber)) {
      toast({
        title: "Invalid bKash Number",
        description: "Please enter a valid bKash mobile number (01XXXXXXXXX)",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleBkashWithdrawal = async () => {
    if (!validateForm()) return;

    const amountValue = parseFloat(amount);
    setIsLoading(true);
    setWithdrawStep('processing');
    setErrorMessage('');

    try {
      const response = await BkashService.processBkashWithdrawal(amountValue, bkashNumber);
      
      if (response.success) {
        setWithdrawStep('success');
        toast({
          title: "Withdrawal Successful",
          description: `Successfully withdrew $${amountValue} to bKash number ${bkashNumber}`,
        });
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      } else {
        throw new Error('Withdrawal processing failed');
      }

    } catch (error: any) {
      console.error('bKash withdrawal error:', error);
      setWithdrawStep('error');
      setErrorMessage(error.response?.data?.message || error.message || 'Withdrawal failed');
      
      toast({
        title: "Withdrawal Failed",
        description: error.response?.data?.message || "bKash withdrawal failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("50");
    setBkashNumber("");
    setWithdrawStep('input');
    setErrorMessage('');
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-pink-500" />
            bKash Withdrawal
          </DialogTitle>
          <DialogDescription>
            Withdraw funds from your wallet to your bKash account
            <br />
            Available balance: ${maxAmount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {withdrawStep === 'input' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    className="pl-7"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="50.00"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bkashNumber">bKash Mobile Number</Label>
                <Input
                  id="bkashNumber"
                  value={bkashNumber}
                  onChange={handleBkashNumberChange}
                  placeholder="01XXXXXXXXX"
                  disabled={isLoading}
                  maxLength={11}
                />
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Withdrawal will be processed instantly to the provided bKash number.
                </AlertDescription>
              </Alert>
            </>
          )}

          {withdrawStep === 'processing' && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Processing your bKash withdrawal request...
              </AlertDescription>
            </Alert>
          )}

          {withdrawStep === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Withdrawal completed successfully! Funds have been sent to your bKash account.
              </AlertDescription>
            </Alert>
          )}

          {withdrawStep === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          {withdrawStep === 'input' && (
            <Button 
              onClick={handleBkashWithdrawal}
              disabled={isLoading || !amount || !bkashNumber || parseFloat(amount) <= 0}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Withdraw to bKash
                </>
              )}
            </Button>
          )}
          
          {(withdrawStep === 'error' || withdrawStep === 'success') && (
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
