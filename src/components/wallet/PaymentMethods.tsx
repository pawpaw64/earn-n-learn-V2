
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export function PaymentMethods() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true
    },
    {
      id: "pm_2",
      type: "mastercard",
      last4: "5678",
      expiryMonth: "09",
      expiryYear: "2024",
      isDefault: false
    }
  ]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated successfully."
    });
  };

  const handleDeleteCard = (id: string) => {
    // Don't allow deleting the default card
    const methodToDelete = paymentMethods.find(m => m.id === id);
    if (methodToDelete?.isDefault) {
      toast({
        title: "Cannot Delete Default Card",
        description: "Please set another card as default before deleting this one.",
        variant: "destructive"
      });
      return;
    }
    
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    toast({
      title: "Card Removed",
      description: "Your payment method has been removed successfully."
    });
  };

  const handleAddCard = (cardDetails: {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
  }) => {
    // In a real app, this would call a secure API to create a payment method
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: cardDetails.cardNumber.startsWith("4") ? "visa" : "mastercard",
      last4: cardDetails.cardNumber.slice(-4),
      expiryMonth: cardDetails.expiryMonth,
      expiryYear: cardDetails.expiryYear,
      isDefault: paymentMethods.length === 0 // Make it default if it's the first one
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setIsAddCardOpen(false);
    
    toast({
      title: "Card Added",
      description: "Your payment method has been added successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Payment Methods</h2>
        <Button 
          onClick={() => setIsAddCardOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <Card key={method.id} className={`${method.isDefault ? 'border-emerald-500' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                  </CardTitle>
                  <CardDescription>
                    **** **** **** {method.last4}
                  </CardDescription>
                </div>
                {method.isDefault && (
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    Default
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Expires: {method.expiryMonth}/{method.expiryYear}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!method.isDefault && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Set Default
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDeleteCard(method.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {paymentMethods.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No payment methods added yet.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsAddCardOpen(true)}
          >
            Add Your First Card
          </Button>
        </div>
      )}
      
      <AddCardDialog 
        isOpen={isAddCardOpen} 
        onClose={() => setIsAddCardOpen(false)} 
        onAdd={handleAddCard} 
      />
    </div>
  );
}

interface AddCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cardDetails: {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
  }) => void;
}

function AddCardDialog({ isOpen, onClose, onAdd }: AddCardDialogProps) {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onAdd(cardDetails);
      setCardDetails({
        cardNumber: "",
        cardholderName: "",
        expiryMonth: "",
        expiryYear: "",
        cvc: ""
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Enter your card details to add a new payment method.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                required
                maxLength={16}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                placeholder="John Doe"
                value={cardDetails.cardholderName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Input
                  id="expiryMonth"
                  name="expiryMonth"
                  placeholder="MM"
                  value={cardDetails.expiryMonth}
                  onChange={handleChange}
                  required
                  maxLength={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Input
                  id="expiryYear"
                  name="expiryYear"
                  placeholder="YY"
                  value={cardDetails.expiryYear}
                  onChange={handleChange}
                  required
                  maxLength={4}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  name="cvc"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={handleChange}
                  required
                  maxLength={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
