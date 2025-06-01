
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Loader2 } from "lucide-react";
import { createBkashPayment, executeBkashPayment } from "@/services/bkash";

interface BkashTopUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export function BkashTopUpDialog({ isOpen, onClose, onSuccess }: BkashTopUpDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("100");
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      // Create payment
      const createResponse = await createBkashPayment(amountValue);
      
      if (!createResponse.success) {
        throw new Error(createResponse.error || 'Failed to create payment');
      }

      const paymentID = createResponse.paymentID;

      // Initialize bKash checkout
      if (typeof window !== 'undefined' && (window as any).bKash) {
        const bKash = (window as any).bKash;
        
        bKash.init({
          paymentMode: 'checkout',
          paymentRequest: {
            amount: amountValue.toString(),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: createResponse.merchantInvoiceNumber
          },
          
          createRequest: function(request: any) {
            // We already created the payment, so just proceed
            if (createResponse.paymentID) {
              bKash.create().onSuccess({
                paymentID: createResponse.paymentID,
                ...createResponse
              });
            } else {
              bKash.create().onError();
            }
          },
          
          executeRequestOnAuthorization: async function() {
            try {
              const executeResponse = await executeBkashPayment(paymentID);
              
              if (executeResponse.success) {
                toast({
                  title: "Payment Successful",
                  description: `৳${amountValue} has been added to your wallet`,
                });
                
                onSuccess(amountValue);
                onClose();
              } else {
                bKash.execute().onError();
                throw new Error(executeResponse.error || 'Payment execution failed');
              }
            } catch (error: any) {
              console.error('bKash execution error:', error);
              bKash.execute().onError();
              toast({
                title: "Payment Failed",
                description: error.message || "Payment execution failed",
                variant: "destructive"
              });
            }
          },
          
          onClose: function() {
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user",
              variant: "destructive"
            });
          }
        });

        // Trigger the bKash popup
        bKash.create().click();
        
      } else {
        throw new Error('bKash script not loaded');
      }

    } catch (error: any) {
      console.error('bKash payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate bKash payment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-pink-500" />
            bKash Top Up
          </DialogTitle>
          <DialogDescription>
            Add funds to your wallet using bKash. You'll be redirected to bKash for secure payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <div className="col-span-3 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                ৳
              </span>
              <Input
                id="amount"
                className="pl-7"
                value={amount}
                onChange={handleAmountChange}
                placeholder="100.00"
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>• Minimum amount: ৳10</p>
            <p>• Maximum amount: ৳25,000</p>
            <p>• Small transaction fee may apply</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleBkashPayment}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Pay with bKash
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
