
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createSkill } from "@/services/api/api";

const formSchema = z.object({
  skillName: z.string().min(3, "Skill name must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  pricingType: z.enum(["paid", "free", "trade"]),
  price: z.string().optional(),
  availability: z.string().min(1, "Please specify your availability"),
  contactInfo: z.string().email("Please enter a valid email address"),
  skillTrade: z.boolean().default(false),
  tradeSkill: z.string().optional()
});

type ShareSkillFormValues = z.infer<typeof formSchema>;

export default function ShareSkillForm() {
  const form = useForm<ShareSkillFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillName: "",
      description: "",
      pricingType: "paid",
      price: "",
      availability: "",
      contactInfo: "",
      skillTrade: false,
      tradeSkill: ""
    }
  });

  const watchPricingType = form.watch("pricingType");
  const watchSkillTrade = form.watch("skillTrade");

  async function onSubmit(values: ShareSkillFormValues) {
    try {
      // Prepare data for API
      const skillData = {
        skill_name: values.skillName,
        description: values.description,
        pricing: watchPricingType === 'paid' ? values.price : 
                watchPricingType === 'free' ? 'Free' : 
                'Skill Trade: ' + (values.tradeSkill || 'Open to offers'),
        availability: values.availability
      };
      
      // Call API to create skill
      await createSkill(skillData);
      
      toast.success("Skill shared successfully!");
      form.reset();
    } catch (error) {
      console.error("Error sharing skill:", error);
      toast.error("Failed to share skill. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="skillName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Python Tutoring, Logo Design" {...field} />
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
                  placeholder="Describe your skill, experience level, and what you can offer..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricingType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Pricing Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="paid" />
                    <label htmlFor="paid" className="text-sm font-medium">
                      Paid
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="free" />
                    <label htmlFor="free" className="text-sm font-medium">
                      Free
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="trade" id="trade" />
                    <label htmlFor="trade" className="text-sm font-medium">
                      Skill Trade
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchPricingType === "paid" && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $15/hr, $50/session" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchPricingType === "trade" && (
          <FormField
            control={form.control}
            name="skillTrade"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I'm open to trading for other skills
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        )}

        {watchPricingType === "trade" && watchSkillTrade && (
          <FormField
            control={form.control}
            name="tradeSkill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills I'm Looking For</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Math Tutoring, Guitar Lessons" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Weekends, Evenings, MWF 3-5pm" {...field} />
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

        <Button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">List Skill</Button>
      </form>
    </Form>
  );
 }
