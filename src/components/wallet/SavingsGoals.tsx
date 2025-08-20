import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Plus, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSavingsGoals,
  addSavingsGoal,
  updateSavingsGoal,
  editSavingsGoal,
  deleteSavingsGoal,
} from "@/services/wallet";
import { Skeleton } from "@/components/ui/skeleton";

interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  progress: number;
}

export function SavingsGoals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<SavingsGoal | null>(null);

  // Fetch savings goals
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["savingsGoals"],
    queryFn: getSavingsGoals,
  });

  // Mutations
  const createGoalMutation = useMutation({
    mutationFn: addSavingsGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      queryClient.invalidateQueries({ queryKey: ["walletDetails"] });
      setIsCreateGoalOpen(false);
      toast({
        title: "Goal Created",
        description: "Your savings goal has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create savings goal",
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ goalId, amount }: { goalId: number; amount: number }) =>
      updateSavingsGoal(goalId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      queryClient.invalidateQueries({ queryKey: ["walletDetails"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Funds Added",
        description: "Amount has been added to your savings goal.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add funds",
        variant: "destructive",
      });
    },
  });

  const editGoalMutation = useMutation({
    mutationFn: ({ goalId, data }: { goalId: number; data: any }) =>
      editSavingsGoal(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      setIsEditGoalOpen(false);
      setCurrentGoal(null);
      toast({
        title: "Goal Updated",
        description: "Your savings goal has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update savings goal",
        variant: "destructive",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: deleteSavingsGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      toast({
        title: "Goal Deleted",
        description: "Your savings goal has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete savings goal",
        variant: "destructive",
      });
    },
  });

  const handleCreateGoal = (goalData: any) => {
    createGoalMutation.mutate(goalData);
  };

  const handleUpdateGoal = (goalData: any) => {
    editGoalMutation.mutate({ goalId: goalData.id, data: goalData });
  };

  const handleDeleteGoal = (id: number) => {
    deleteGoalMutation.mutate(id);
  };

  const handleAddToGoal = (goalId: number, amount: number) => {
    updateGoalMutation.mutate({ goalId, amount });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Savings Goals</h2>
          <Skeleton className="w-24 h-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Savings Goals</h2>

        <Button
          onClick={() => setIsCreateGoalOpen(true)}
          className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const remainingAmount = goal.targetAmount - goal.currentAmount;

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{goal.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setCurrentGoal(goal);
                          setIsEditGoalOpen(true);
                        }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteGoal(goal.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Target: ${goal.targetAmount.toFixed(2)}
                    {goal.deadline &&
                      ` • Due: ${format(
                        new Date(goal.deadline),
                        "MMM d, yyyy"
                      )}`}{" "}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>${goal.currentAmount.toFixed(2)}</span>
                    <span>{goal.progress}%</span>
                    <span>${goal.targetAmount.toFixed(2)}</span>
                  </div>

                  <div className="text-sm text-muted-foreground pt-2">
                    {remainingAmount > 0 ? (
                      <p>${remainingAmount.toFixed(2)} more needed</p>
                    ) : (
                      <p className="text-emerald-600 font-medium">
                        Goal reached! 🎉
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <AddToGoalDialog
                    goal={goal}
                    onAddToGoal={(amount) => handleAddToGoal(goal.id, amount)}
                    isLoading={updateGoalMutation.isPending}
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No savings goals found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsCreateGoalOpen(true)}>
            Create Your First Goal
          </Button>
        </div>
      )}

      <GoalFormDialog
        isOpen={isCreateGoalOpen}
        onClose={() => setIsCreateGoalOpen(false)}
        onSave={handleCreateGoal}
        title="Create New Savings Goal"
        isLoading={createGoalMutation.isPending}
      />

      {currentGoal && (
        <GoalFormDialog
          isOpen={isEditGoalOpen}
          onClose={() => {
            setIsEditGoalOpen(false);
            setCurrentGoal(null);
          }}
          onSave={handleUpdateGoal}
          title="Edit Savings Goal"
          goal={currentGoal}
          isEditing={true}
          isLoading={editGoalMutation.isPending}
        />
      )}
    </div>
  );
}

interface GoalFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: any) => void;
  title: string;
  goal?: SavingsGoal;
  isEditing?: boolean;
  isLoading?: boolean;
}

function GoalFormDialog({
  isOpen,
  onClose,
  onSave,
  title,
  goal,
  isEditing = false,
  isLoading = false,
}: GoalFormDialogProps) {
  const [formData, setFormData] = useState({
    id: goal?.id || 0,
    name: goal?.name || "",
    targetAmount: goal?.targetAmount || 0,
    currentAmount: goal?.currentAmount || 0,
    deadline: goal?.deadline ? new Date(goal.deadline) : new Date()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('Amount') ? parseFloat(value) || 0 : value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        deadline: date,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     onSave({
      ...formData,
      deadline: formData.deadline.toISOString().split('T')[0]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Set a savings goal to help you reach your financial targets.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., New Laptop"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="targetAmount">Target Amount ($)</Label>
              <Input
                id="targetAmount"
                name="targetAmount"
                type="number"
                placeholder="1000"
                value={formData.targetAmount || ""}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
              />
            </div>

            {isEditing && (
              <div className="grid gap-2">
                <Label htmlFor="currentAmount">Current Amount ($)</Label>
                <Input
                  id="currentAmount"
                  name="currentAmount"
                  type="number"
                  placeholder="0"
                  value={formData.currentAmount || ""}
                  onChange={handleChange}
                  required
                  min={0}
                  step="0.01"
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? (
                      format(formData.deadline, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AddToGoalDialogProps {
  goal: SavingsGoal;
  onAddToGoal: (amount: number) => void;
    isLoading?: boolean;

}

function AddToGoalDialog({ goal, onAddToGoal, isLoading = false }: AddToGoalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const remainingAmount = goal.targetAmount - goal.currentAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountValue = parseFloat(amount);
    if (!isNaN(amountValue) && amountValue > 0) {
      onAddToGoal(amountValue);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsOpen(true)}
        disabled={remainingAmount <= 0}>
        {remainingAmount > 0 ? "Add Funds" : "Completed"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ad to {goal.name}</DialogTitle>
            <DialogDescription>
              ${goal.currentAmount.toFixed(2)} of $
              {goal.targetAmount.toFixed(2)} saved
              {remainingAmount > 0 &&
                ` (${remainingAmount.toFixed(2)} more needed)`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount to Add ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    className="pl-7"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    placeholder="10.00"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAmount("10")}>
                  $10
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAmount("25")}>
                  $25
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAmount("50")}>
                  $50
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(remainingAmount.toFixed(2))}>
                  ${remainingAmount.toFixed(2)}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading || !amount || parseFloat(amount) <= 0}>
                {isLoading ? "Processing..." : "Add to Goal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}