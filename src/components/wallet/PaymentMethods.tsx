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

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">SSLCommerz Integration Active</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-muted-foreground">
            Payment processing is now handled through SSLCommerz, Bangladesh's leading payment gateway.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium">Cards</h3>
              <p className="text-sm text-muted-foreground">Visa, Mastercard, AMEX</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <Wallet className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <h3 className="font-medium">Mobile Banking</h3>
              <p className="text-sm text-muted-foreground">bKash, Nagad, Rocket</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <Plus className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium">Internet Banking</h3>
              <p className="text-sm text-muted-foreground">All major banks</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg mt-8">
            <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
            <ol className="text-sm text-blue-800 space-y-1 text-left">
              <li>1. Click "Top Up" to add money to your wallet</li>
              <li>2. Choose your payment method on SSLCommerz secure page</li>
              <li>3. Complete payment and funds are instantly added</li>
              <li>4. Use your wallet balance for escrow payments and purchases</li>
            </ol>
          </div>
        </div>
      </div>
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
