import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export function PaymentSuccessNotification() {
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const amount = urlParams.get('amount');

    if (paymentStatus) {
      switch (paymentStatus) {
        case 'success':
          toast({
            title: "Payment Successful!",
            description: amount 
              ? `৳${parseFloat(amount).toFixed(2)} has been added to your wallet.`
              : "Your payment has been processed successfully.",
            duration: 5000,
          });
          break;
        
        case 'failed':
          toast({
            title: "Payment Failed",
            description: "Your payment could not be processed. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
          break;
        
        case 'cancelled':
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            variant: "destructive",
            duration: 5000,
          });
          break;
        
        case 'error':
          toast({
            title: "Payment Error",
            description: "An error occurred during payment processing.",
            variant: "destructive",
            duration: 5000,
          });
          break;
      }

      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [toast]);

  return null;
}