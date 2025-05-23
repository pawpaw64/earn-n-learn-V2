
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Shield, Clock, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface EscrowDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  application: any;
  onEscrowCreated: () => void;
}

export function EscrowDialog({
  isOpen,
  onOpenChange,
  application,
  onEscrowCreated
}: EscrowDialogProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!application) return null;

  const handleCreateEscrow = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/wallet/escrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          providerId: application.user_id,
          jobId: application.job_id || null,
          skillId: application.skill_id || null,
          materialId: application.material_id || null,
          amount: parseFloat(amount),
          description: description || `Escrow for ${application.title || application.skill_name || 'work'}`
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create escrow');
      }

      toast.success("Escrow payment created successfully!");
      onEscrowCreated();
      onOpenChange(false);
      setAmount("");
      setDescription("");
      
    } catch (error) {
      console.error("Error creating escrow:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create escrow payment");
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkType = () => {
    if (application.job_id) return "Job";
    if (application.skill_id || application.skill_name) return "Skill";
    if (application.material_id) return "Material";
    return "Work";
  };

  const getWorkTitle = () => {
    return application.title || application.skill_name || application.material_title || "Work Assignment";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Set Up Escrow Payment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Work Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{getWorkTitle()}</h3>
                <Badge variant="outline" className="mt-1">
                  {getWorkType()}
                </Badge>
              </div>
              <div className="text-right">
                {application.payment && (
                  <p className="text-lg font-semibold text-green-600">
                    {application.payment}
                  </p>
                )}
              </div>
            </div>
            
            {application.description && (
              <p className="text-sm text-gray-600 mb-3">
                {application.description}
              </p>
            )}
          </div>

          {/* Provider Details */}
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={application.applicant_avatar} />
              <AvatarFallback>
                {application.applicant_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{application.applicant_name}</p>
              <p className="text-sm text-gray-600">{application.applicant_email}</p>
            </div>
            <User className="h-4 w-4 text-gray-400 ml-auto" />
          </div>

          {/* Escrow Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Escrow Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount to hold in escrow"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <p className="text-xs text-gray-500">
              This amount will be held in escrow until work is completed
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any additional notes about this escrow payment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Escrow Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">How Escrow Works:</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Funds are held securely until work is completed</li>
                  <li>• Provider cannot access funds until you release them</li>
                  <li>• You can release funds when satisfied with the work</li>
                  <li>• Provides protection for both parties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateEscrow}
            disabled={isLoading || !amount}
          >
            {isLoading ? "Creating..." : "Create Escrow Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
