import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Building, Save, Edit2, Shield, Key, Clock, Eye, Camera } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const AdminProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@athenuru.com",
    phone: "+1 (555) 123-4567",
    company: "Athenuru",
    department: "Administration",
    bio: "System administrator with full access to manage users, leads, and system settings."
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
      duration: 3000,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout role="admin" title="Admin Profile">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-8 text-white"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), 
                               radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
              backgroundSize: '60px 60px, 80px 80px'
            }} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <User className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                    Admin Profile
                  </h1>
                  <p className="text-teal-100 mt-1">Manage your account settings and preferences with precision</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                size="lg"
                className="bg-white hover:bg-gray-50 text-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="save"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </motion.div>
                  ) : (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center"
                    >
                      <Edit2 className="h-5 w-5 mr-2" />
                      Edit Profile
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <Card className="relative overflow-hidden border-0 shadow-xl bg-white">
            {/* Subtle gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-30" />
            
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
              <CardTitle className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="p-2 bg-teal-100 rounded-xl"
                >
                  <User className="h-5 w-5 text-teal-600" />
                </motion.div>
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Personal Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Enhanced Avatar Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl"
              >
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="h-24 w-24 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg"
                  >
                    <span className="text-3xl font-bold text-white">A</span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-teal-200 hover:bg-teal-50 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-teal-600" />
                  </motion.button>
                </div>
                <div className="space-y-2">
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {formData.name}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-600 font-medium"
                  >
                    {formData.department}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold"
                  >
                    <Shield className="h-3 w-3" />
                    Administrator
                  </motion.div>
                </div>
              </motion.div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    disabled={!isEditing}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="border-gray-300 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <Button variant="outline">Update</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Login History</h4>
                  <p className="text-sm text-gray-600">View recent login activity</p>
                </div>
                <Button variant="outline">View</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;