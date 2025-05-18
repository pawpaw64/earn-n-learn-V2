import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import { createMaterial, updateMaterial } from "@/services/materials";
import { useEditableItem } from "@/components/browse/EditableItemContext";
import { MaterialType } from "@/types/marketplace";

const formSchema = z.object({
  title: z.string().min(3, "Material name must be at least 3 characters"),
  condition: z.string().min(1, "Please select condition"),
  price: z.string().min(1, "Please specify price"),
  type: z.enum(["sale", "rent", "borrow"]),
  availability: z.string().min(1, "Please specify availability"),
  description: z.string().min(10, "Please provide a more detailed description"),
  contactInfo: z.string().email("Please enter a valid email address")
});

type ListMaterialFormValues = z.infer<typeof formSchema>;

interface ListMaterialFormProps {
  initialData?: MaterialType;
}

export default function ListMaterialForm({ initialData }: ListMaterialFormProps) {
  const { editItem, editType, clearEditItem } = useEditableItem();
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditing = Boolean(initialData || (editType === 'material' && editItem));
  const itemToEdit = initialData || (editType === 'material' ? editItem : null);

  const form = useForm<ListMaterialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      condition: "Like New",
      price: "",
      type: "sale",
      availability: "",
      description: "",
      contactInfo: ""
    }
  });

  // Pre-fill form in edit mode
  React.useEffect(() => {
    if (itemToEdit) {
      form.reset({
        title: itemToEdit.title || "",
        condition: itemToEdit.condition || "Like New",
        price: itemToEdit.price || "",
        type: itemToEdit.type || "sale",
        availability: itemToEdit.availability || "",
        description: itemToEdit.description || "",
        contactInfo: itemToEdit.contactInfo || ""
      });
      if (itemToEdit.imageUrl) {
        setImagePreview(itemToEdit.imageUrl);
      }
    }
  }, [itemToEdit, form]);

  const watchType = form.watch("type");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: ListMaterialFormValues) {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("condition", values.condition);
      formData.append("price", values.price);
      formData.append("type", values.type);
      formData.append("availability", values.availability);
      formData.append("contactInfo", values.contactInfo);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditing && itemToEdit?.id) {
        await updateMaterial(itemToEdit.id, formData);
        toast.success("Material updated successfully!");
      } else {
        await createMaterial(formData);
        toast.success("Material listed successfully!");
      }

      form.reset();
      setImagePreview("");
      setImageFile(null);
      if (clearEditItem) clearEditItem();
    } catch (error) {
      console.error("Error with material:", error);
      toast.error(isEditing 
        ? "Failed to update material. Please try again." 
        : "Failed to list material. Please try again.");
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
              <FormLabel>Material Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Calculus Textbook, Camera Lens" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Listing Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="sale" id="sale" />
                      <label htmlFor="sale" className="text-sm font-medium">Sale</label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="rent" id="rent" />
                      <label htmlFor="rent" className="text-sm font-medium">Rent</label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="borrow" id="borrow" />
                      <label htmlFor="borrow" className="text-sm font-medium">Borrow</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {watchType === "sale" ? "Price" : 
                 watchType === "rent" ? "Rental Price" : 
                 "Deposit (if any)"}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={watchType === "sale" ? "e.g., $50" : 
                               watchType === "rent" ? "e.g., $10/day" : 
                               "e.g., $0 (free) or deposit amount"} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Upload Image (Optional)</label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50">
            {imagePreview ? (
              <div className="relative w-full">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="mx-auto max-h-48 object-contain mb-2" 
                />
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setImagePreview("")}
                  className="absolute top-0 right-0"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 text-sm text-emerald-600 font-medium">
                      Click to upload
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide details about the material..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Input 
                  placeholder={watchType === "sale" ? "e.g., Available immediately" : 
                               "e.g., Available weekdays, Starting May 1st"} 
                  {...field} 
                />
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

        <Button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700">
          {watchType === "sale" ? "List for Sale" : 
           watchType === "rent" ? "List for Rent" : 
           "List to Borrow"}
        </Button>
      </form>
    </Form>
  );
}
