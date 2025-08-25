
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { getFinancialData, getExpenseBreakdown } from '@/services/wallet';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Plus } from "lucide-react";
import { SSLCommerzTopUpDialog } from './SSLCommerzTopUpDialog';
import { WithdrawDialog } from './WithdrawDialog';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface WalletData {
  balance?: number;
  pendingEscrow?: number;
  monthlyEarnings?: number;
  monthlySpending?: number;
  savingsProgress?: number;
}

export function FinancialDashboard() {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState('monthly');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(true);
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    pendingEscrow: 0,
    monthlyEarnings: 0,
    monthlySpending: 0,
    savingsProgress: 0
  });

  // Fetch financial data
  const { data: financialData, isLoading: financialLoading } = useQuery({
    queryKey: ['financialData', timeframe],
    queryFn: () => getFinancialData(timeframe),
  });

  // Fetch expense breakdown
  const { data: expenseData, isLoading: expenseLoading } = useQuery({
    queryKey: ['expenseBreakdown', timeframe],
    queryFn: () => getExpenseBreakdown(timeframe),
  });

  const isLoading = financialLoading || expenseLoading;

  // Helper function to safely format numbers
  const formatCurrency = (value?: number) => {
    return value?.toFixed(2) ?? "0.00";
  };

  const fetchWalletData = async () => {
    setIsWalletLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setIsWalletLoading(false);
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
      setIsWalletLoading(false);
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

      const response = await axios.post('http://localhost:8080/api/wallet/topup', 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success && response.data.gatewayUrl) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = response.data.gatewayUrl;
      } else {
        throw new Error('Failed to initialize payment gateway');
      }
      
    } catch (error) {
      console.error('Top up error:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
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

  if (isLoading || isWalletLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Financial Dashboard</h2>
          <Skeleton className="w-[180px] h-10" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate summary metrics
  const totalIncome = financialData?.monthlyData?.reduce((sum, item) => sum + item.income, 0) || 0;
  const totalExpenses = financialData?.monthlyData?.reduce((sum, item) => sum + item.expenses, 0) || 0;
  const savingsRate = totalIncome > 0 ? Math.floor((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Financial Dashboard</h2>
        
        <Select 
          value={timeframe} 
          onValueChange={setTimeframe}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Wallet Overview Section */}
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
                ${formatCurrency(walletData.balance)}
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
              <span className="text-2xl font-bold">
                ${formatCurrency(walletData.monthlyEarnings)}
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
                ${formatCurrency(walletData.monthlySpending)}
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

      {/* How it works section */}
      <Card>
        <CardHeader>
          <CardTitle>How SSLCommerz Integration Works</CardTitle>
          <CardDescription>Payment processing through Bangladesh's leading payment gateway</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-medium text-center">Cards</h3>
              <p className="text-sm text-muted-foreground text-center">Visa, Mastercard, AMEX</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <Wallet className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <h3 className="font-medium text-center">Mobile Banking</h3>
              <p className="text-sm text-muted-foreground text-center">bKash, Nagad, Rocket</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <Plus className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-center">Internet Banking</h3>
              <p className="text-sm text-muted-foreground text-center">All major banks</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Click "Top Up" to add money to your wallet</li>
              <li>2. Choose your payment method on SSLCommerz secure page</li>
              <li>3. Complete payment and funds are instantly added</li>
              <li>4. Use your wallet balance for escrow payments and purchases</li>
            </ol>
          </div>
        </CardContent>
      </Card>
      
      {/* Financial Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Income</CardTitle>
            <CardDescription>
              {timeframe === 'monthly' ? 'Last 6 months' : 
               timeframe === 'quarterly' ? 'Last 4 quarters' : 'Last 3 years'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>
              {timeframe === 'monthly' ? 'Last 6 months' : 
               timeframe === 'quarterly' ? 'Last 4 quarters' : 'Last 3 years'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Savings Rate</CardTitle>
            <CardDescription>Income saved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsRate}%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs. Expenses</CardTitle>
            <CardDescription>
              {timeframe === 'monthly' ? 'Monthly comparison' : 
               timeframe === 'quarterly' ? 'Quarterly comparison' : 'Yearly comparison'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData?.monthlyData || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, undefined]}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#10B981" />
                  <Bar dataKey="expenses" name="Expenses" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {(expenseData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, undefined]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <SSLCommerzTopUpDialog 
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
