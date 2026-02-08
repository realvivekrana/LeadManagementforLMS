import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormData {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;

  // Company Information
  jobTitle: string;
  industry: string;
  companySize: string;
  website: string;
  location: string;

  // Lead Information
  source: string;
  budget: string;
  priority: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  industry: "",
  companySize: "",
  website: "",
  location: "",
  source: "Website",
  budget: "Not Specified",
  priority: "Medium",
  notes: "",
};

const AddLeadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required basic fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("New Lead Added:", {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/agent/leads");
      }, 2000);
    }, 1000);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setActiveSection("basic");
  };

  const handleBack = () => {
    navigate("/agent");
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "company", label: "Company", icon: Building2 },
    { id: "details", label: "Lead Details", icon: FileText },
  ];

  const filledFields = Object.values(formData).filter((v) => v && v !== "").length;
  const totalFields = Object.keys(formData).length;
  const progress = Math.round((filledFields / totalFields) * 100);

  return (
    <DashboardLayout role="agent" title="Add New Lead">
      {showSuccess ? (
        // Success Screen
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <div className="h-24 w-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-14 w-14 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Lead Added Successfully!
            </h2>
            <p className="text-muted-foreground mb-2">
              {formData.firstName} {formData.lastName} has been added to your leads.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Redirecting to My Leads...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-teal-500 animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="h-2 w-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="text-left sm:text-right">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  Add New Lead
                </h1>
                <p className="text-muted-foreground text-sm">
                  Fill in the lead information to get started
                </p>
              </div>
            </div>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-card rounded-lg border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">
                Form Progress
              </span>
              <span className="text-sm font-bold text-teal-600">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium w-full sm:w-auto ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={activeSection === "basic" || activeSection === "" ? "visible" : "hidden"}
            >
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-teal-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Enter the lead's personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-medium">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="e.g., John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-medium">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="e.g., Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-medium">
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+1 234 567 8900"
                          className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="font-medium">
                      Company Name *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="company"
                        name="company"
                        placeholder="e.g., Acme Corporation"
                        className={`pl-10 ${errors.company ? "border-red-500" : ""}`}
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.company && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.company}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 2: Company Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={activeSection === "company" || activeSection === "" ? "visible" : "hidden"}
            >
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-teal-600" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    Details about the company (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Job Title & Industry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="font-medium">
                        Job Title
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          id="jobTitle"
                          name="jobTitle"
                          placeholder="e.g., Sales Manager"
                          className="pl-10"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="font-medium">
                        Industry
                      </Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) => handleSelectChange("industry", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Company Size & Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companySize" className="font-medium">
                        Company Size
                      </Label>
                      <Select
                        value={formData.companySize}
                        onValueChange={(value) => handleSelectChange("companySize", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Startup">Startup (1-50)</SelectItem>
                          <SelectItem value="Small">Small (51-200)</SelectItem>
                          <SelectItem value="Medium">Medium (201-1000)</SelectItem>
                          <SelectItem value="Large">Large (1000+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="font-medium">
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="e.g., www.example.com"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-medium">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g., New York, USA"
                        className="pl-10"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Section 3: Lead Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={activeSection === "details" || activeSection === "" ? "visible" : "hidden"}
            >
              <Card className="border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    Lead Details
                  </CardTitle>
                  <CardDescription>
                    Information about the lead source and potential
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Source, Budget & Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source" className="font-medium">
                        Lead Source *
                      </Label>
                      <Select
                        value={formData.source}
                        onValueChange={(value) => handleSelectChange("source", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Ads">Ads</SelectItem>
                          <SelectItem value="Email">Email Campaign</SelectItem>
                          <SelectItem value="Direct">Direct Contact</SelectItem>
                          <SelectItem value="Event">Event</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget" className="font-medium">
                        Budget
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Select
                          value={formData.budget}
                          onValueChange={(value) => handleSelectChange("budget", value)}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Specified">Not Specified</SelectItem>
                            <SelectItem value="<$1000">&lt; $1,000</SelectItem>
                            <SelectItem value="$1000-$5000">$1,000 - $5,000</SelectItem>
                            <SelectItem value="$5000-$10000">$5,000 - $10,000</SelectItem>
                            <SelectItem value="$10000-$50000">$10,000 - $50,000</SelectItem>
                            <SelectItem value=">$50000">&gt; $50,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="font-medium">
                        Priority
                      </Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange("priority", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-medium">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Add any additional information, observations, or context about this lead..."
                      className="min-h-[120px] resize-none"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Character count: {formData.notes.length}/500
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border"
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      ⚙️
                    </motion.div>
                    Adding Lead...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Add Lead
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="w-full sm:flex-1"
              >
                Clear Form
              </Button>
            </motion.div>
          </form>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">
                  💡 Tip: Fields marked with * are required
                </p>
                <p>
                  After adding a lead, you can update the status, add notes, and set follow-up
                  dates from the lead details page.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AddLeadPage;
