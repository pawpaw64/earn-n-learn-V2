
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BkashService from "@/services/bkash";

interface BkashTopUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BkashTopUpDialog({ isOpen, onClose, onSuccess }: BkashTopUpDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("50");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'input' | 'processing' | 'success' | 'error'>('input');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleBkashPayment = async () => {
    const amountValue = parseFloat(amount);
    if (!amountValue || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setPaymentStep('processing');
    setErrorMessage('');

    try {
      // Step 1: Initiate bKash payment
      const paymentResponse = await BkashService.initiateBkashPayment(amountValue, 'wallet_topup');
      
      if (!paymentResponse.success || !paymentResponse.bkashURL) {
        throw new Error('Failed to initiate bKash payment');
      }

      // Step 2: Open bKash checkout
      await BkashService.openBkashCheckout(paymentResponse.bkashURL, paymentResponse.paymentID);
      
      // Step 3: Execute payment after user completes checkout
      const executeResponse = await BkashService.executeBkashPayment(paymentResponse.paymentID);
      
      if (executeResponse.success && executeResponse.transactionStatus === 'Completed') {
        setPaymentStep('success');
        toast({
          title: "Payment Successful",
          description: `Successfully added $${amountValue} to your wallet via bKash`,
        });
        
        // Call success callback after a short delay
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 2000);
      } else {
        throw new Error('Payment execution failed');
      }

    } catch (error: any) {
      console.error('bKash payment error:', error);
      setPaymentStep('error');
      setErrorMessage(error.message || 'bKash payment failed');
      
      toast({
        title: "Payment Failed",
        description: error.message || "bKash payment failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount("50");
    setPaymentStep('input');
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
            bKash Top Up
          </DialogTitle>
          <DialogDescription>
            Add funds to your wallet using bKash mobile wallet
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {paymentStep === 'input' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (BDT)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ৳
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
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You will be redirected to bKash checkout to complete the payment securely.
                </AlertDescription>
              </Alert>
            </>
          )}

          {paymentStep === 'processing' && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Processing your bKash payment. Please complete the payment in the bKash window.
              </AlertDescription>
            </Alert>
          )}

          {paymentStep === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payment completed successfully! Your wallet has been updated.
              </AlertDescription>
            </Alert>
          )}

          {paymentStep === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          {paymentStep === 'input' && (
            <Button 
              onClick={handleBkashPayment}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
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
                  Pay with bKash
                </>
              )}
            </Button>
          )}
          
          {(paymentStep === 'error' || paymentStep === 'success') && (
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
