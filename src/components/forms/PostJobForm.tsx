
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createJob, updateJob } from "@/services/api";
import { useEditableItem } from "@/components/browse/EditableItemContext";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  type: z.string(),
  payment: z.string().min(1, "Please specify compensation"),
  deadline: z.string().optional(),
  requirements: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional()
});

type PostJobFormValues = z.infer<typeof formSchema>;

interface PostJobFormProps {
  initialData?: any;
}

export default function PostJobForm({ initialData }: PostJobFormProps) {
  const { editItem, editType, clearEditItem } = useEditableItem();
  const isEditing = Boolean(initialData || (editType === 'job' && editItem));
  const itemToEdit = initialData || (editType === 'job' ? editItem : null);
  
  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "On-campus",
      payment: "",
      deadline: "",
      requirements: "",
      location: "",
      status: "Active"
    }
  });

  // If we have initial data, populate the form
  useEffect(() => {
    if (itemToEdit) {
      form.reset({
        title: itemToEdit.title || "",
        description: itemToEdit.description || "",
        type: itemToEdit.type || "On-campus",
        payment: itemToEdit.payment || "",
        deadline: itemToEdit.deadline || "",
        requirements: itemToEdit.requirements || "",
        location: itemToEdit.location || "",
        status: itemToEdit.status || "Active"
      });
    }
  }, [itemToEdit, form]);

  async function onSubmit(values: PostJobFormValues) {
    try {
      if (isEditing && itemToEdit?.id) {
        await updateJob(itemToEdit.id, values);
        toast.success("Job updated successfully!");
      } else {
        await createJob({
          title: values.title,
          description: values.description,
          type: values.type,
          payment: values.payment,
          deadline: values.deadline,
          requirements: values.requirements || "",
          location: values.location || values.type === "Remote" ? "Remote" : "On Campus",
          status: "Active",
          poster: localStorage.getItem('userName') || "",
          posterEmail: localStorage.getItem('userEmail') || ""
        });
        toast.success("Job posted successfully!");
      }
      
      form.reset();
      if (clearEditItem) clearEditItem();
    } catch (error) {
      console.error("Error with job:", error);
      toast.error(isEditing ? "Failed to update job. Please try again." : "Failed to post job. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Research Assistant, Web Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the job, requirements, and expectations..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-campus">On-campus</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment/Compensation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $15/hr, $50 flat rate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Deadline</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Library, Online, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any specific requirements or qualifications..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
        >
          {isEditing ? "Update Job" : "Post Job"}
        </Button>
        
        {isEditing && (
          <Button 
            type="button" 
            variant="outline"
            className="w-full"
            onClick={clearEditItem}
          >
            Cancel Editing
          </Button>
        )}
      </form>
    </Form>
  );
}
