import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

export interface Step {
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
}

interface ProgressStepsProps {
  steps: Step[];
  className?: string;
}

export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2",
                  {
                    "border-green-500 bg-green-500 text-white": step.status === 'completed',
                    "border-blue-500 bg-blue-500 text-white": step.status === 'current',
                    "border-gray-300 bg-white text-gray-400": step.status === 'pending',
                  }
                )}
              >
                {step.status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    {
                      "text-green-600": step.status === 'completed',
                      "text-blue-600": step.status === 'current',
                      "text-gray-500": step.status === 'pending',
                    }
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4",
                  {
                    "bg-green-500": steps[index + 1].status === 'completed',
                    "bg-gray-300": steps[index + 1].status !== 'completed',
                  }
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}