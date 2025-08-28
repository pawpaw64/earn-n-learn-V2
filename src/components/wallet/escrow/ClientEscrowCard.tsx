import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { ProgressSteps, Step } from "@/components/ui/progress-steps";

interface ClientEscrowCardProps {
  transaction: any;
  progressSteps: Step[];
  onRelease: (id: string) => void;
  onDispute: (id: string) => void;
}

export function ClientEscrowCard({ transaction, progressSteps, onRelease, onDispute }: ClientEscrowCardProps) {
  const canRelease = ['funded', 'in_progress', 'completed'].includes(transaction.status);
  const canDispute = ['funded', 'in_progress', 'completed'].includes(transaction.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-800 border-green-300';
      case 'disputed': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-blue-900">{transaction.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">Client (You pay)</span>
              <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                {transaction.jobType}
              </Badge>
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(transaction.status)} font-medium`}>
            {transaction.status.replace('_', ' ').charAt(0).toUpperCase() + transaction.status.slice(1).replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-medium text-blue-900">{transaction.providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-blue-900">${transaction.amount.toFixed(2)}</span>
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
          <div className="pt-2 border-t border-blue-200">
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>
        )}
        
        {(canRelease || canDispute) && (
          <div className="flex justify-end gap-2 pt-2 border-t border-blue-200">
            {canDispute && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDispute(transaction.id)}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Dispute
              </Button>
            )}
            {canRelease && (
              <Button
                size="sm"
                onClick={() => onRelease(transaction.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Release Payment
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}