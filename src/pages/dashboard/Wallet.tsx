
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { FinancialDashboard } from "@/components/wallet/FinancialDashboard";
import { SavingsGoals } from "@/components/wallet/SavingsGoals";
import { EscrowTransactions } from "@/components/wallet/EscrowTransactions";
import { PaymentSuccessNotification } from "@/components/wallet/PaymentSuccessNotification";
import { History, DollarSign, TrendingUp, Calendar } from "lucide-react";
import "../../styles/dashboard-global.css";

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("financial");
  
  return (
    <div className="dashboard-page-wrapper">
      <div className="dashboard-content-area space-y-6">
        <PaymentSuccessNotification />
        
        <h1 className="dashboard-header text-3xl font-bold">Wallet - Powered by SSLCommerz</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="dashboard-tabs w-full ">
          <TabsList className="dashboard-tabs-list mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <TabsTrigger value="financial" className="dashboard-tabs-trigger flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="dashboard-tabs-trigger flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="savings" className="dashboard-tabs-trigger flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Savings</span>
            </TabsTrigger>
            <TabsTrigger value="escrow" className="dashboard-tabs-trigger flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Escrow</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financial">
            <FinancialDashboard />
          </TabsContent>
          
          <TabsContent value="transactions">
            <TransactionHistory />
          </TabsContent>
          
          <TabsContent value="savings">
            <SavingsGoals />
          </TabsContent>
          
          <TabsContent value="escrow">
            <EscrowTransactions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
