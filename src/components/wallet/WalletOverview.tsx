import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { TopUpDialog } from './TopUpDialog';
import { WithdrawDialog } from './WithdrawDialog';
import axios from 'axios';

interface WalletData {
  balance?: number;
  pendingEscrow?: number;
  monthlyEarnings?: number;
  monthlySpending?: number;
  savingsProgress?: number;
}

export function WalletOverview() {
  const { toast } = useToast();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    pendingEscrow: 0,
    monthlyEarnings: 0,
    monthlySpending: 0,
    savingsProgress: 0
  });

  // Helper function to safely format numbers
  const formatCurrency = (value?: number) => {
    return value?.toFixed(2) ?? "0.00";
  };

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setIsLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8080/api/wallet/details', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure all numeric fields have default values
      setWalletData({
        balance: response.data.balance ?? 0,
        pendingEscrow: response.data.pendingEscrow ?? 0,
        monthlyEarnings: response.data.monthlyEarnings ?? 0,
        monthlySpending: response.data.monthlySpending ?? 0,
        savingsProgress: response.data.savingsProgress ?? 0
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTopUp = async (amount: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.post('http://localhost:8080/api/wallet/topup', 
        { amount, paymentMethod: 'card' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchWalletData();
      
      toast({
        title: "Success",
        description: `Added $${amount.toFixed(2)} to your wallet.`,
      });
      
    } catch (error) {
      console.error('Top up error:', error);
      toast({
        title: "Error",
        description: "Failed to top up your wallet. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsTopUpOpen(false);
  };

  const handleWithdraw = async (amount: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.post('http://localhost:8080/api/wallet/withdraw', 
        { amount, withdrawMethod: 'bank' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchWalletData();
      
      toast({
        title: "Success",
        description: `Withdrew $${amount.toFixed(2)} from your wallet.`,
      });
      
    } catch (error: any) {
      console.error('Withdraw error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to withdraw from your wallet.",
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
              <span className="text-3xl font-bold">
                ${isLoading ? "..." : formatCurrency(walletData.balance)}
              </span>
            </div>
            
            {walletData.pendingEscrow && walletData.pendingEscrow > 0 && (
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span>Pending in escrow:</span>
                <Badge variant="outline" className="ml-2">
                  ${formatCurrency(walletData.pendingEscrow)}
                </Badge>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              variant="default" 
              className="flex-1"
              onClick={() => setIsTopUpOpen(true)}
              disabled={isLoading}
            >
              Top Up
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsWithdrawOpen(true)}
              disabled={isLoading}
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
              <span className="text-2xl font-bold">
                ${isLoading ? "..." : formatCurrency(walletData.monthlyEarnings)}
              </span>
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
              <span className="text-2xl font-bold">
                ${isLoading ? "..." : formatCurrency(walletData.monthlySpending)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goal Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Savings Goal Progress</CardTitle>
          <CardDescription>Overall progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={walletData.savingsProgress ?? 0} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>{walletData.savingsProgress ?? 0}% completed</span>
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
        maxAmount={walletData.balance ?? 0}
      />
    </div>
  );
}