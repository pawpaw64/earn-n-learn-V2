
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Loader2, Plus } from "lucide-react";
import { getBkashAccounts, addBkashAccount } from "@/services/bkash";

interface BkashWithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, accountNumber: string) => void;
  maxAmount: number;
}

interface BkashAccount {
  id: number;
  account_number: string;
  account_holder_name?: string;
  is_verified: boolean;
  is_default: boolean;
}

export function BkashWithdrawDialog({ isOpen, onClose, onWithdraw, maxAmount }: BkashWithdrawDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("500");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [accounts, setAccounts] = useState<BkashAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountName, setNewAccountName] = useState("");

  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const accountsData = await getBkashAccounts();
      setAccounts(accountsData);
      
      // Set default account if available
      const defaultAccount = accountsData.find((acc: BkashAccount) => acc.is_default);
      if (defaultAccount) {
        setSelectedAccount(defaultAccount.account_number);
      }
    } catch (error) {
      console.error('Error fetching bKash accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load bKash accounts",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  const handleAddAccount = async () => {
    if (!newAccountNumber) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid bKash account number",
        variant: "destructive"
      });
      return;
    }

    // Validate Bangladesh phone number format
    const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
    if (!phoneRegex.test(newAccountNumber)) {
      toast({
        title: "Invalid Format",
        description: "Please enter a valid Bangladesh mobile number (e.g., 01XXXXXXXXX)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await addBkashAccount({
        accountNumber: newAccountNumber,
        accountHolderName: newAccountName,
        isDefault: accounts.length === 0
      });

      toast({
        title: "Success",
        description: "bKash account added successfully",
      });

      // Reset form and refresh accounts
      setNewAccountNumber("");
      setNewAccountName("");
      setShowAddAccount(false);
      await fetchAccounts();
      
    } catch (error: any) {
      console.error('Add account error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add bKash account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amountValue = parseFloat(amount);
    
    if (!amountValue || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (amountValue > maxAmount) {
      toast({
        title: "Insufficient Balance",
        description: `Amount cannot exceed ৳${maxAmount.toFixed(2)}`,
        variant: "destructive"
      });
      return;
    }

    if (!selectedAccount) {
      toast({
        title: "No Account Selected",
        description: "Please select a bKash account for withdrawal",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await onWithdraw(amountValue, selectedAccount);
      onClose();
    } catch (error) {
      console.error('Withdrawal error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-pink-500" />
            Withdraw to bKash
          </DialogTitle>
          <DialogDescription>
            Withdraw funds from your wallet to your bKash account.
            Available balance: ৳{maxAmount.toFixed(2)}
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
                placeholder="500.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account" className="text-right">
              bKash Account
            </Label>
            <div className="col-span-3">
              {isLoadingAccounts ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading accounts...</span>
                </div>
              ) : accounts.length > 0 ? (
                <div className="space-y-2">
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bKash account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.account_number}>
                          <div className="flex items-center justify-between w-full">
                            <span>{account.account_number}</span>
                            {account.is_default && (
                              <span className="text-xs text-muted-foreground ml-2">(Default)</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddAccount(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Account
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowAddAccount(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add bKash Account
                </Button>
              )}
            </div>
          </div>

          {showAddAccount && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Add New bKash Account</h4>
              <div className="space-y-2">
                <Label htmlFor="newAccountNumber">Account Number *</Label>
                <Input
                  id="newAccountNumber"
                  value={newAccountNumber}
                  onChange={(e) => setNewAccountNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newAccountName">Account Holder Name</Label>
                <Input
                  id="newAccountName"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="Enter account holder name"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAccount} disabled={isLoading} size="sm">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Account"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddAccount(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>• Minimum withdrawal: ৳50</p>
            <p>• Processing time: 1-2 business days</p>
            <p>• Transaction fee may apply</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleWithdraw}
            disabled={
              isLoading || 
              !amount || 
              parseFloat(amount) <= 0 || 
              parseFloat(amount) > maxAmount ||
              !selectedAccount
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Withdraw to bKash"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
