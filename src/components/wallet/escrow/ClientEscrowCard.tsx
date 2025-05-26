
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { EscrowProgress } from "./EscrowProgress";

interface ClientEscrowCardProps {
  transaction: any;
  onRelease: (id: string) => void;
  onDispute: (id: string) => void;
}

export function ClientEscrowCard({ transaction, onRelease, onDispute }: ClientEscrowCardProps) {
  const canRelease = ['completed'].includes(transaction.status);
  const canDispute = ['funds_deposited', 'in_progress', 'completed'].includes(transaction.status);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released': return 'bg-green-100 text-green-800 border-green-300';
      case 'disputed': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'funds_deposited': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending_acceptance': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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
                {transaction.job_type}
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
              <span className="font-medium text-blue-900">{transaction.provider_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-blue-900">${transaction.amount.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{format(new Date(transaction.created_at), 'MMM d, yyyy')}</span>
            </div>
            {transaction.accepted_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accepted:</span>
                <span>{format(new Date(transaction.accepted_at), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        
        <EscrowProgress 
          status={transaction.status} 
          acceptedByProvider={transaction.accepted_by_provider}
          acceptedAt={transaction.accepted_at}
        />
        
        {transaction.description && (
          <div className="pt-2 border-t border-blue-200">
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>
        )}
        
        {transaction.progress_notes && (
          <div className="pt-2 border-t border-blue-200">
            <p className="text-sm font-medium text-blue-900">Progress Notes:</p>
            <p className="text-sm text-muted-foreground">{transaction.progress_notes}</p>
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
