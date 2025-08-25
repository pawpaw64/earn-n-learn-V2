import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { ProgressSteps, Step } from "@/components/ui/progress-steps";

interface ProviderEscrowCardProps {
  transaction: any;
  progressSteps: Step[];
}

export function ProviderEscrowCard({ transaction, progressSteps }: ProviderEscrowCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-800 border-green-300';
      case 'disputed': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disputed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-amber-600" />;
      default: return <DollarSign className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-purple-900">{transaction.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium">Provider (You receive)</span>
              <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
                {transaction.jobType}
              </Badge>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(transaction.status)}
            <Badge className={`${getStatusColor(transaction.status)} font-medium`}>
              {transaction.status.replace('_', ' ').charAt(0).toUpperCase() + transaction.status.slice(1).replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium text-purple-900">{transaction.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-purple-900">${transaction.amount.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{format(new Date(transaction.createdAt), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="capitalize">{transaction.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="pt-2">
          <ProgressSteps steps={progressSteps} />
        </div>
        
        {transaction.description && (
          <div className="pt-2 border-t border-purple-200">
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-purple-200">
          <p className="text-xs text-purple-600">
            {transaction.status === 'funded' && "Waiting for work to begin"}
            {transaction.status === 'in_progress' && "Work in progress - payment secured"}
            {transaction.status === 'completed' && "Work completed - awaiting client approval"}
            {transaction.status === 'released' && "Payment released to your wallet"}
            {transaction.status === 'disputed' && "Payment disputed - under review"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}