import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (leadData: any) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  notes: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website",
  notes: "",
};

export const AddLeadModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddLeadModalProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      if (onSubmit) {
        onSubmit(formData);
      }
      setTimeout(() => {
        setIsSubmitting(false);
        setFormData(initialFormData);
        setErrors({});
        onClose();
      }, 500);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSourceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      source: value,
    }));
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Add New Lead</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Enter lead details to get started
              </p>
            </div>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 mt-6"
        >
          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Lead Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g., john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row 2: Phone and Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="e.g., +1 234 567 8900"
                value={formData.phone}
                onChange={handleInputChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company Name *
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="e.g., Acme Corp"
                value={formData.company}
                onChange={handleInputChange}
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && (
                <p className="text-xs text-red-500">{errors.company}</p>
              )}
            </div>
          </div>

          {/* Row 3: Source */}
          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-medium">
              Lead Source
            </Label>
            <Select value={formData.source} onValueChange={handleSourceChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Ads">Ads</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Direct">Direct</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 4: Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any additional information or notes about this lead..."
              value={formData.notes}
              onChange={handleInputChange}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Character count: {formData.notes.length}/300
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Lead..." : "Add Lead"}
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> You can update the lead status and add
              follow-up dates after creating the lead.
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;
