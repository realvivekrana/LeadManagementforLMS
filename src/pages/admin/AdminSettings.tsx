import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Mail,
  Globe,
  Key,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
  Download,
  Trash2,
  Edit,
  Plus,
  AlertTriangle
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      companyName: "Athenura",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
      language: "en",
      currency: "USD"
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      loginAttempts: 5,
      ipWhitelist: "192.168.1.0/24, 10.0.0.0/8"
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      leadAlerts: true,
      systemAlerts: true
    },
    integrations: {
      crmEnabled: true,
      emailProvider: "sendgrid",
      paymentProcessor: "stripe",
      analyticsEnabled: true
    }
  });

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
    setIsChanged(true);
  };

  const saveSettings = () => {
    // Simulate saving
    setTimeout(() => {
      setIsChanged(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  const resetSettings = () => {
    // Reset to default values
    setIsChanged(false);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast({
      title: "Settings Exported",
      description: "System settings have been exported successfully.",
    });
  };

  // Refresh settings function
  const refreshSettings = () => {
    // Reset to current saved state
    setIsChanged(false);
    setActiveTab("general");
    
    toast({
      title: "Settings Refreshed",
      description: "Settings have been refreshed successfully.",
    });
  };

  return (
    <DashboardLayout role="admin" title="Settings">
      <div className="space-y-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 p-8 text-white"
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
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                >
                  <Settings className="h-8 w-8" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                    System Settings
                  </h1>
                  <p className="text-indigo-100 mt-1">Configure system preferences and security with precision</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              {isChanged && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-2"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={resetSettings}
                      className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      onClick={saveSettings}
                      className="bg-white hover:bg-gray-50 text-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </motion.div>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={refreshSettings}
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                  </motion.div>
                  Refresh
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={exportSettings}
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100/50 p-2">
              <TabsList className="grid w-full grid-cols-5 bg-transparent gap-1">
                {[
                  { value: "general", icon: Settings, label: "General" },
                  { value: "security", icon: Shield, label: "Security" },
                  { value: "notifications", icon: Bell, label: "Notifications" },
                  { value: "integrations", icon: Globe, label: "Integrations" },
                  { value: "backup", icon: Database, label: "Backup" }
                ].map((tab, index) => (
                  <motion.div
                    key={tab.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <TabsTrigger 
                      value={tab.value}
                      className="relative w-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl"
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      <span className="font-medium">{tab.label}</span>
                      {activeTab === tab.value && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"
                          style={{ zIndex: -1 }}
                        />
                      )}
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </div>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Settings className="h-5 w-5 text-teal-600" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settings.general.companyName}
                        onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                        className="border-gray-300 focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.general.timezone}
                        onValueChange={(value) => handleSettingChange('general', 'timezone', value)}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select
                        value={settings.general.dateFormat}
                        onValueChange={(value) => handleSettingChange('general', 'dateFormat', value)}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={settings.general.currency}
                        onValueChange={(value) => handleSettingChange('general', 'currency', value)}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Shield className="h-5 w-5 text-teal-600" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorEnabled}
                      onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorEnabled', checked)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="border-gray-300 focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                        className="border-gray-300 focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                    <Textarea
                      id="ipWhitelist"
                      value={settings.security.ipWhitelist}
                      onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
                      placeholder="Enter IP addresses or ranges, separated by commas"
                      className="border-gray-300 focus:border-teal-600"
                      rows={3}
                    />
                    <p className="text-sm text-gray-600 mt-1">Leave empty to allow all IPs</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Bell className="h-5 w-5 text-teal-600" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.emailEnabled}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'emailEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Send notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.notifications.smsEnabled}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'smsEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-gray-600">Send browser push notifications</p>
                      </div>
                      <Switch
                        checked={settings.notifications.pushEnabled}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'pushEnabled', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Lead Alerts</Label>
                        <p className="text-sm text-gray-600">Notify when new leads arrive</p>
                      </div>
                      <Switch
                        checked={settings.notifications.leadAlerts}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'leadAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">System Alerts</Label>
                        <p className="text-sm text-gray-600">Notify about system issues</p>
                      </div>
                      <Switch
                        checked={settings.notifications.systemAlerts}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'systemAlerts', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Settings */}
            <TabsContent value="integrations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Globe className="h-5 w-5 text-teal-600" />
                      Third-party Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">CRM Integration</Label>
                        <p className="text-sm text-gray-600">Connect with external CRM</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={settings.integrations.crmEnabled ? "default" : "secondary"}>
                          {settings.integrations.crmEnabled ? "Connected" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={settings.integrations.crmEnabled}
                          onCheckedChange={(checked) => handleSettingChange('integrations', 'crmEnabled', checked)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="emailProvider">Email Provider</Label>
                      <Select
                        value={settings.integrations.emailProvider}
                        onValueChange={(value) => handleSettingChange('integrations', 'emailProvider', value)}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sendgrid">SendGrid</SelectItem>
                          <SelectItem value="mailgun">Mailgun</SelectItem>
                          <SelectItem value="aws-ses">AWS SES</SelectItem>
                          <SelectItem value="smtp">Custom SMTP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="paymentProcessor">Payment Processor</Label>
                      <Select
                        value={settings.integrations.paymentProcessor}
                        onValueChange={(value) => handleSettingChange('integrations', 'paymentProcessor', value)}
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="authorize">Authorize.net</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Analytics Tracking</Label>
                        <p className="text-sm text-gray-600">Enable Google Analytics</p>
                      </div>
                      <Switch
                        checked={settings.integrations.analyticsEnabled}
                        onCheckedChange={(checked) => handleSettingChange('integrations', 'analyticsEnabled', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Key className="h-5 w-5 text-teal-600" />
                      API Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type={showPassword ? "text" : "password"}
                          value="sk_test_••••••••••••••••••••••••"
                          className="border-gray-300 focus:border-teal-600 pr-10"
                          readOnly
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-300 hover:bg-gray-50"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate API Key
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-300 hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Backup Settings */}
            <TabsContent value="backup" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Database className="h-5 w-5 text-teal-600" />
                    Data Backup & Recovery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Automatic Backups</h4>
                      <div className="space-y-2">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                          <Download className="h-4 w-4 mr-2" />
                          Create Backup Now
                        </Button>
                        <p className="text-sm text-gray-600">Last backup: 2 hours ago</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Backup Schedule</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger className="border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Every Hour</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Backup History</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {[
                          { date: "2024-01-15 14:30", size: "2.4 MB", status: "success" },
                          { date: "2024-01-14 14:30", size: "2.3 MB", status: "success" },
                          { date: "2024-01-13 14:30", size: "2.2 MB", status: "success" },
                          { date: "2024-01-12 14:30", size: "2.1 MB", status: "failed" },
                          { date: "2024-01-11 14:30", size: "2.0 MB", status: "success" },
                        ].map((backup, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                backup.status === "success" ? "bg-green-500" : "bg-red-500"
                              }`} />
                              <span className="text-sm text-gray-700">{backup.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{backup.size}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-100"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-900">Danger Zone</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Permanently delete all system data. This action cannot be undone.
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-3"
                          onClick={() => setShowDeleteDialog(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete All Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all system data including users, leads, and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Yes, delete everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminSettings;