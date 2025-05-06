
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WalletOverview } from "@/components/wallet/WalletOverview";
import { PaymentMethods } from "@/components/wallet/PaymentMethods";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { FinancialDashboard } from "@/components/wallet/FinancialDashboard";
import { SavingsGoals } from "@/components/wallet/SavingsGoals";
import { EscrowTransactions } from "@/components/wallet/EscrowTransactions";
import { Shield, CreditCard, History, DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Wallet</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-3 md:grid-cols-6 gap-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payment Methods</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Transactions</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Savings</span>
          </TabsTrigger>
          <TabsTrigger value="escrow" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Escrow</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <WalletOverview />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentMethods />
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionHistory />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialDashboard />
        </TabsContent>
        
        <TabsContent value="savings">
          <SavingsGoals />
        </TabsContent>
        
        <TabsContent value="escrow">
          <EscrowTransactions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
