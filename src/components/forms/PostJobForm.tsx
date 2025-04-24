import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createJob } from "@/services/api";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  type: z.string(),
  payment: z.string().min(1, "Please specify compensation"),
  deadline: z.string(),
  contactInfo: z.string().email("Please enter a valid email address")
});

type PostJobFormValues = z.infer<typeof formSchema>;

export default function PostJobForm() {
  const form = useForm<PostJobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "On-campus",
      payment: "",
      deadline: "",
      contactInfo: ""
    }
  });

  async function onSubmit(values: PostJobFormValues) {
    try {
      // Map form values to API expected format
      const jobData = {
        title: values.title,
        type: values.type,
        description: values.description,
        payment: values.payment,
        poster: "Current User", // In a real app, get from auth
        posterEmail: values.contactInfo,
        posterAvatar: "https://i.pravatar.cc/150?img=1", // Placeholder
        location: values.type === "Remote" ? "Remote" : "On Campus",
        deadline: values.deadline,
        requirements: ""
      };
      
      await createJob(jobData);
      toast.success("Job posted successfully!");
      form.reset();
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job. Please try again.");
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
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">Post Job</Button>
      </form>
    </Form>
  );
}
