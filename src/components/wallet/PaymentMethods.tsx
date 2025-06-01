import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Trash2, Plus, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from 'axios';

interface PaymentMethod {
  id: string;
  type: string;
  provider: string;
  last4: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
}

export function PaymentMethods() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
   
  ]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isAddBkashOpen, setIsAddBkashOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setIsLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8080/api/wallet/payment-methods', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.length > 0) {
        setPaymentMethods(response.data);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Keep fallback data on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.put(`http://localhost:8080/api/wallet/payment-methods/${id}/default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
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
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: "Error",
        description: "Failed to update default payment method.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCard = async (id: string) => {
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
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.delete(`http://localhost:8080/api/wallet/payment-methods/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setPaymentMethods(methods => methods.filter(method => method.id !== id));
      
      toast({
        title: "Payment Method Removed",
        description: "Your payment method has been removed successfully."
      });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment method.",
        variant: "destructive"
      });
    }
  };

  const handleAddCard = async (cardDetails: {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // In a real app, this would call a secure API to create a payment method
      // Simplified here for demonstration
      const last4 = cardDetails.cardNumber.slice(-4);
      const type = cardDetails.cardNumber.startsWith('4') ? 'visa' : 'mastercard';
      const isDefault = paymentMethods.length === 0;
      
      // Call API to add payment method
      const response = await axios.post('http://localhost:8080/api/wallet/payment-methods', 
        {
          type,
          last4,
          expiryMonth: cardDetails.expiryMonth,
          expiryYear: cardDetails.expiryYear,
          provider: 'card',
          isDefault
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add to local state
      const newMethod: PaymentMethod = {
        id: response.data.id || `pm_${Date.now()}`,
        type,
        provider: 'card',
        last4,
        expiryMonth: cardDetails.expiryMonth,
        expiryYear: cardDetails.expiryYear,
        isDefault
      };
      
      setPaymentMethods([...paymentMethods, newMethod]);
      setIsAddCardOpen(false);
      
      toast({
        title: "Card Added",
        description: "Your payment method has been added successfully."
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method.",
        variant: "destructive"
      });
    }
  };

  const handleAddBkash = async (details: {
    phoneNumber: string;
    isDefault: boolean;
  }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Call API to add bKash payment method
      const response = await axios.post('http://localhost:8080/api/wallet/payment-methods', 
        {
          type: 'bkash',
          last4: details.phoneNumber.slice(-4),
          provider: 'bkash',
          isDefault: details.isDefault
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add to local state
      const newMethod: PaymentMethod = {
        id: response.data.id || `pm_${Date.now()}`,
        type: 'bkash',
        provider: 'bkash',
        last4: details.phoneNumber.slice(-4),
        isDefault: details.isDefault
      };
      
      if (details.isDefault) {
        setPaymentMethods(methods => methods.map(m => ({
          ...m,
          isDefault: false
        })));
      }
      
      setPaymentMethods(prev => [...prev, newMethod]);
      setIsAddBkashOpen(false);
      
      toast({
        title: "bKash Added",
        description: "Your bKash account has been added successfully."
      });
    } catch (error) {
      console.error('Error adding bKash account:', error);
      toast({
        title: "Error",
        description: "Failed to add bKash account.",
        variant: "destructive"
      });
    }
  };

  const getProviderIcon = (provider: string, type: string) => {
    switch (provider) {
      case 'bkash':
        return <Wallet className="h-4 w-4 text-pink-500" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Payment Methods</h2>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAddCardOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Add Card</span>
          </Button>
          
          <Button 
            onClick={() => setIsAddBkashOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Wallet className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">Add bKash</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <Card key={method.id} className={`${method.isDefault ? 'border-emerald-500' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    {getProviderIcon(method.provider, method.type)}
                    {method.provider === 'bkash' 
                      ? 'bKash' 
                      : method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                  </CardTitle>
                  <CardDescription>
                    {method.provider === 'bkash' 
                      ? `**** **** ${method.last4}` 
                      : `**** **** **** ${method.last4}`}
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
              {method.provider === 'card' && method.expiryMonth && method.expiryYear && (
                <p className="text-sm text-muted-foreground">
                  Expires: {method.expiryMonth}/{method.expiryYear}
                </p>
              )}
              {method.provider === 'bkash' && (
                <p className="text-sm text-muted-foreground">
                  Mobile Wallet
                </p>
              )}
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
      
      {paymentMethods.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No payment methods added yet.</p>
          <div className="flex justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsAddCardOpen(true)}
              className="flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Add Card
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsAddBkashOpen(true)}
              className="flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-pink-500" />
              Add bKash
            </Button>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading payment methods...</p>
        </div>
      )}
      
      <AddCardDialog 
        isOpen={isAddCardOpen} 
        onClose={() => setIsAddCardOpen(false)} 
        onAdd={handleAddCard} 
      />

      <AddBkashDialog
        isOpen={isAddBkashOpen}
        onClose={() => setIsAddBkashOpen(false)}
        onAdd={handleAddBkash}
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

interface AddBkashDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (details: {
    phoneNumber: string;
    isDefault: boolean;
  }) => void;
}

function AddBkashDialog({ isOpen, onClose, onAdd }: AddBkashDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onAdd({ phoneNumber, isDefault });
      setPhoneNumber("");
      setIsDefault(false);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-pink-500" />
            Add bKash Account
          </DialogTitle>
          <DialogDescription>
            Enter your bKash mobile number to add it as a payment method.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">bKash Mobile Number</Label>
              <Input
                id="phoneNumber"
                placeholder="01XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroup value={isDefault ? "yes" : "no"} onValueChange={(val) => setIsDefault(val === "yes")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="default-yes" />
                  <Label htmlFor="default-yes">Set as default payment method</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="default-no" />
                  <Label htmlFor="default-no">Keep current default</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading || !phoneNumber}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isLoading ? "Adding..." : "Add bKash"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
