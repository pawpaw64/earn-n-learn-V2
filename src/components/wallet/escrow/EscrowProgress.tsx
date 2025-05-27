
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, AlertTriangle } from "lucide-react";

interface EscrowProgressProps {
  status: string;
  acceptedByProvider: boolean;
  acceptedAt?: string;
}

export function EscrowProgress({ status, acceptedByProvider, acceptedAt }: EscrowProgressProps) {
  const getProgressValue = () => {
    switch (status) {
      case 'pending_acceptance': return 25;
      case 'funds_deposited': return 50;
      case 'in_progress': return 75;
      case 'completed': return 90;
      case 'released': return 100;
      case 'disputed': return 75;
      default: return 0;
    }
  };

  const getStepStatus = (step: string) => {
    const stepOrder = ['pending_acceptance', 'funds_deposited', 'in_progress', 'completed', 'released'];
    const currentIndex = stepOrder.indexOf(status);
    const stepIndex = stepOrder.indexOf(step);
    
    if (status === 'disputed') {
      return stepIndex <= 2 ? 'completed' : 'pending';
    }
    
    return stepIndex <= currentIndex ? 'completed' : 'pending';
  };

  const steps = [
    {
      key: 'pending_acceptance',
      label: 'Awaiting Acceptance',
      description: 'Provider needs to accept escrow',
      icon: Clock
    },
    {
      key: 'funds_deposited',
      label: 'Funds Deposited',
      description: 'Escrow funds secured',
      icon: CheckCircle
    },
    {
      key: 'in_progress',
      label: 'Work in Progress',
      description: 'Provider working on task',
      icon: Clock
    },
    {
      key: 'completed',
      label: 'Work Completed',
      description: 'Awaiting client approval',
      icon: CheckCircle
    },
    {
      key: 'released',
      label: 'Payment Released',
      description: 'Funds transferred to provider',
      icon: CheckCircle
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Escrow Progress</h4>
        <Badge variant={status === 'disputed' ? 'destructive' : 'secondary'}>
          {status === 'disputed' ? 'Disputed' : `${getProgressValue()}% Complete`}
        </Badge>
      </div>
      
      <Progress value={getProgressValue()} className="h-2" />
      
      <div className="space-y-3">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.key);
          const isActive = step.key === status;
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`p-1 rounded-full ${
                stepStatus === 'completed' ? 'bg-green-100 text-green-600' :
                isActive ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                {stepStatus === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  stepStatus === 'completed' ? 'text-green-700' :
                  isActive ? 'text-blue-700' :
                  'text-gray-500'
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {isActive && (
                <Badge variant="outline" className="text-xs">
                  Current
                </Badge>
              )}
            </div>
          );
        })}
      </div>
      
      {status === 'disputed' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <p className="text-sm text-red-700">
            This transaction is under dispute review
          </p>
        </div>
      )}
    </div>
  );
}
