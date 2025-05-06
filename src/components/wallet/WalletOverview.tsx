
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { TopUpDialog } from './TopUpDialog';
import { WithdrawDialog } from './WithdrawDialog';

export function WalletOverview() {
  const { toast } = useToast();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [walletData, setWalletData] = useState({
    balance: 2580.42,
    pendingEscrow: 750.00,
    monthlyEarnings: 1200.00,
    monthlySpending: 450.50,
    savingsProgress: 65
  });

  // For demonstration purposes, this would be fetched from an API in a real application
  useEffect(() => {
    // Simulate API call
    const fetchWalletData = async () => {
      // In a real app, this would be an API call
      // const response = await fetch('/api/wallet');
      // const data = await response.json();
      // setWalletData(data);
    };

    fetchWalletData();
  }, []);

  const handleTopUp = (amount: number) => {
    // In a real app, this would call an API
    setWalletData(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
    
    toast({
      title: "Success",
      description: `Added $${amount.toFixed(2)} to your wallet.`,
    });
    
    setIsTopUpOpen(false);
  };

  const handleWithdraw = (amount: number) => {
    // In a real app, this would call an API
    if (amount <= walletData.balance) {
      setWalletData(prev => ({
        ...prev,
        balance: prev.balance - amount
      }));
      
      toast({
        title: "Success",
        description: `Withdrew $${amount.toFixed(2)} from your wallet.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Insufficient balance for withdrawal.",
        variant: "destructive"
      });
    }
    
    setIsWithdrawOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Available Balance</CardTitle>
            <CardDescription>Your current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <span className="text-3xl font-bold">${walletData.balance.toFixed(2)}</span>
            </div>
            
            {walletData.pendingEscrow > 0 && (
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span>Pending in escrow:</span>
                <Badge variant="outline" className="ml-2">
                  ${walletData.pendingEscrow.toFixed(2)}
                </Badge>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={() => setIsTopUpOpen(true)}
            >
              Top Up
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsWithdrawOpen(true)}
            >
              Withdraw
            </Button>
          </CardFooter>
        </Card>

        {/* Monthly Earnings Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Earnings</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">${walletData.monthlyEarnings.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Spending Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Spending</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">${walletData.monthlySpending.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goal Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Savings Goal Progress</CardTitle>
          <CardDescription>Laptop Fund</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={walletData.savingsProgress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>${walletData.savingsProgress * 10}</span>
            <span>${1000}</span>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TopUpDialog 
        isOpen={isTopUpOpen} 
        onClose={() => setIsTopUpOpen(false)} 
        onTopUp={handleTopUp} 
      />

      <WithdrawDialog 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        onWithdraw={handleWithdraw}
        maxAmount={walletData.balance}
      />
    </div>
  );
}
