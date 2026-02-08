import React, { useState, useMemo } from "react";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  UserCheck, 
  Plus, 
  Edit2, 
  Ban, 
  BarChart3, 
  FileText, 
  Settings,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  User,
  Mail,
  Phone,
  Building,
  Calendar
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryCard } from "@/components/ui/summary-card";
import { LeadsByStatusChart } from "@/components/charts/LeadsByStatusChart";
import { MonthlyGrowthChart } from "@/components/charts/MonthlyGrowthChart";
import { AgentPerformanceChart } from "@/components/charts/AgentPerformanceChart";
import { LeadsTable } from "@/components/tables/LeadsTable";
import { mockLeads, mockUsers } from "@/data/mockData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  
  // State for leads and users management
  const [users, setUsers] = useState(mockUsers);
  const [leads, setLeads] = useState(mockLeads);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLeadDetailOpen, setIsLeadDetailOpen] = useState(false);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  
  // Search state
  const [userSearchQuery, setUserSearchQuery] = useState("");
  
  // Edit modal states
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  
  // Edit form data states
  const [leadFormData, setLeadFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    status: 'new' as any,
    assignedAgent: ''
  });
  
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'Agent' as any,
    status: 'Active' as any
  });
  
  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;
  const lostLeads = leads.filter((l) => l.status === "lost").length;
  const activeAgents = users.filter((u) => u.role === "Agent" && u.status === "Active").length;

  const conversionRate = ((convertedLeads / totalLeads) * 100).toFixed(1);
  
  // Filtered users based on search query
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }, [users, userSearchQuery]);

  // Export functionality
  const handleExportData = () => {
    const csvContent = [
      ['Metric', 'Value', 'Details'],
      ['Total Leads', totalLeads, 'Current total lead count'],
      ['Converted Leads', convertedLeads, 'Successfully converted leads'],
      ['Lost Leads', lostLeads, 'Leads marked as lost'],
      ['Active Agents', activeAgents, 'Currently active agent count'],
      ['Conversion Rate', `${conversionRate}%`, 'Lead to conversion percentage'],
      ['Average Deal Size', '$12,450', 'Average revenue per deal'],
      ['Response Time', '2.4h', 'Average response time to leads']
    ]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard-metrics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Dashboard metrics have been exported to CSV successfully.",
    });
  };

  // Report generation functions
  const generateLeadReport = () => {
    const csvContent = [
      ['Lead Name', 'Email', 'Company', 'Status', 'Source', 'Agent', 'Date'],
      ...mockLeads.map(lead => [
        lead.name,
        lead.email,
        lead.company,
        lead.status,
        lead.source,
        lead.assignedAgent || 'Unassigned',
        lead.date
      ])
    ]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lead-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Lead Report Generated",
      description: "Lead performance report has been downloaded as CSV.",
    });
  };

  const generateAgentPerformanceReport = () => {
    const agentStats = mockUsers
      .filter(user => user.role === "Agent")
      .map(agent => {
        const agentLeads = mockLeads.filter(lead => lead.assignedAgent === agent.name);
        const converted = agentLeads.filter(lead => lead.status === "converted").length;
        const total = agentLeads.length;
        
        return {
          name: agent.name,
          email: agent.email,
          status: agent.status,
          totalLeads: total,
          convertedLeads: converted,
          conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) + '%' : '0%'
        };
      });

    const csvContent = [
      ['Agent Name', 'Email', 'Status', 'Total Leads', 'Converted', 'Conversion Rate'],
      ...agentStats.map(agent => [
        agent.name,
        agent.email,
        agent.status,
        agent.totalLeads,
        agent.convertedLeads,
        agent.conversionRate
      ])
    ]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `agent-performance-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Agent Performance Report Generated",
      description: "Agent performance report has been downloaded as CSV.",
    });
  };

  const generateSalesAnalytics = () => {
    const csvContent = [
      ['Metric', 'Value', 'Description'],
      ['Total Revenue', '$247,890', 'Total revenue generated'],
      ['Average Deal Size', '$12,450', 'Average deal value'],
      ['Conversion Rate', `${conversionRate}%`, 'Lead to customer conversion rate'],
      ['Average Response Time', '2.4h', 'Average response time to leads'],
      ['Monthly Growth', '+12.5%', 'Month-over-month growth'],
      ['Quarterly Growth', '+18.3%', 'Quarter-over-quarter growth'],
      ['Total Leads', totalLeads, 'Total number of leads'],
      ['Converted Leads', convertedLeads, 'Successfully converted leads'],
      ['Lost Leads', lostLeads, 'Leads marked as lost'],
      ['Pipeline Value', '$156,780', 'Total pipeline value']
    ]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Sales Analytics Report Generated", 
      description: "Sales analytics report has been downloaded as CSV.",
    });
  };

  // Lead Management Handlers
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setIsLeadDetailOpen(true);
  };

  const handleUpdateLead = (lead) => {
    setEditingLead(lead);
    setLeadFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
      assignedAgent: lead.assignedAgent
    });
    setIsEditLeadOpen(true);
  };

  const handleSaveLead = () => {
    setLeads(leads.map(lead =>
      lead.id === editingLead.id
        ? { ...lead, ...leadFormData }
        : lead
    ));
    
    setIsEditLeadOpen(false);
    setEditingLead(null);
    
    toast({
      title: "Lead Updated",
      description: `${leadFormData.name} has been updated successfully.`,
    });
  };

  // User Management Handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditUserOpen(true);
  };

  const handleSaveUser = () => {
    setUsers(users.map(user =>
      user.id === editingUser.id
        ? { ...user, ...userFormData }
        : user
    ));
    
    setIsEditUserOpen(false);
    setEditingUser(null);
    
    toast({
      title: "User Updated",
      description: `${userFormData.name} has been updated successfully.`,
    });
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
    
    const updatedUser = users.find(u => u.id === userId);
    const newStatus = updatedUser.status === "Active" ? "Inactive" : "Active";
    
    toast({
      title: `User ${newStatus === "Active" ? "Activated" : "Deactivated"}`,
      description: `${updatedUser.name} has been ${newStatus.toLowerCase()}`,
    });
    
    // Update selectedUser if it's currently displayed
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, status: newStatus });
    }
  };

  // Helper functions for badges
  const getStatusBadge = (status) => {
    const colors = {
      new: "bg-teal-100 text-teal-800",
      contacted: "bg-blue-100 text-blue-800",
      qualified: "bg-yellow-100 text-yellow-800",
      proposal: "bg-purple-100 text-purple-800",
      negotiation: "bg-orange-100 text-orange-800",
      converted: "bg-green-100 text-green-800",
      lost: "bg-red-100 text-red-800",
    };
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout role="admin" title="Admin Dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your leads today.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              size="sm" 
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <SummaryCard
            title="Total Leads"
            value={totalLeads}
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
            delay={0}
          />
          <SummaryCard
            title="Converted Leads"
            value={convertedLeads}
            icon={TrendingUp}
            trend={{ value: 8.2, isPositive: true }}
            variant="success"
            delay={0.1}
          />
          <SummaryCard
            title="Lost Leads"
            value={lostLeads}
            icon={TrendingDown}
            trend={{ value: 2.1, isPositive: false }}
            variant="destructive"
            delay={0.2}
          />
          <SummaryCard
            title="Active Agents"
            value={activeAgents}
            icon={UserCheck}
            delay={0.3}
          />
        </div>

        {/* Analytics & Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="analytics" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-gray-100">
                <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="analytics" className="space-y-6">
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                <LeadsByStatusChart />
                <MonthlyGrowthChart />
                <AgentPerformanceChart />
              </div>

              {/* Additional Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
                    <p className="text-xs text-gray-600 mt-1">+2.5% from last month</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${conversionRate}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Average Deal Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">$12,450</div>
                    <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">2.4h</div>
                    <p className="text-xs text-red-600 mt-1">+0.3h from last month</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Generate Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col border-gray-300 hover:bg-gray-50"
                      onClick={generateLeadReport}
                    >
                      <FileText className="h-6 w-6 mb-2 text-teal-600" />
                      Lead Report
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col border-gray-300 hover:bg-gray-50"
                      onClick={generateAgentPerformanceReport}
                    >
                      <Users className="h-6 w-6 mb-2 text-teal-600" />
                      Agent Performance
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-24 flex-col border-gray-300 hover:bg-gray-50"
                      onClick={generateSalesAnalytics}
                    >
                      <TrendingUp className="h-6 w-6 mb-2 text-teal-600" />
                      Sales Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">System Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-700">Lead Assignment Rules</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select assignment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round-robin">Round Robin</SelectItem>
                          <SelectItem value="manual">Manual Assignment</SelectItem>
                          <SelectItem value="performance">Performance Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700">Email Notifications</Label>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">New lead assignments</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm text-gray-600">Daily performance reports</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Leads Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <LeadsTable 
                leads={leads.slice(0, 8)} 
                onView={handleViewLead}
                onUpdate={handleUpdateLead}
              />
            </div>
          </div>
        </motion.div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-600">Manage your team members and their access</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-9 w-full sm:w-64 border-gray-300"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Add New User</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" className="border-gray-300" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Email</Label>
                      <Input id="email" type="email" placeholder="email@company.com" className="border-gray-300" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-700">Role</Label>
                      <Select>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      Create User
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>
            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100" onClick={() => handleViewUser(user)}>
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100" onClick={() => handleEditUser(user)}>
                        <Edit2 className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleToggleUserStatus(user.id)}>
                        <Ban className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium text-gray-900 text-right">{user.email}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Role:</span>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          user.role === 'Admin' ? 'bg-teal-100 text-teal-800' : 
                          user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-gray-200">
                    <TableHead className="min-w-[150px] text-gray-700">Name</TableHead>
                    <TableHead className="min-w-[200px] text-gray-700">Email</TableHead>
                    <TableHead className="min-w-[100px] text-gray-700">Role</TableHead>
                    <TableHead className="min-w-[100px] text-gray-700">Status</TableHead>
                    <TableHead className="text-right min-w-[120px] text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 border-gray-200">
                      <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`${
                            user.role === 'Admin' ? 'bg-teal-100 text-teal-800' : 
                            user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100" onClick={() => handleViewUser(user)}>
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100" onClick={() => handleEditUser(user)}>
                            <Edit2 className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleToggleUserStatus(user.id)}>
                            <Ban className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={isLeadDetailOpen} onOpenChange={setIsLeadDetailOpen}>
        <DialogContent className="max-w-2xl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900">Lead Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{selectedLead.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{selectedLead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{selectedLead.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{selectedLead.company}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Lead Details</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Status: </span>
                          {getStatusBadge(selectedLead.status)}
                        </div>
                        <div>
                          <span className="text-gray-500">Source: </span>
                          <span className="text-gray-900">{selectedLead.source}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Assigned Agent: </span>
                          <span className="text-gray-900">{selectedLead.assignedAgent}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date Added: </span>
                          <span className="text-gray-900">{selectedLead.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline" 
                    className="flex-1 border-gray-300"
                    onClick={() => handleUpdateLead(selectedLead)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Lead
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-300">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Lead
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* User Detail Modal */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="max-w-2xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900">User Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          selectedUser.role === 'Admin' ? 'bg-teal-100 text-teal-800' : 
                          selectedUser.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedUser.role}
                      </Badge>
                      <Badge
                        className={
                          selectedUser.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{selectedUser.role} Department</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Account Status: </span>
                          <span className="text-gray-900">{selectedUser.status}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">User Role: </span>
                          <span className="text-gray-900">{selectedUser.role}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Join Date: </span>
                          <span className="text-gray-900">Jan 15, 2024</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Login: </span>
                          <span className="text-gray-900">Feb 07, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300"
                    onClick={() => handleEditUser(selectedUser)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                  <Button
                    variant={selectedUser.status === "Active" ? "destructive" : "default"}
                    className="flex-1"
                    onClick={() => handleToggleUserStatus(selectedUser.id)}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    {selectedUser.status === "Active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Lead Modal */}
      <Dialog open={isEditLeadOpen} onOpenChange={setIsEditLeadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leadName" className="text-gray-700">Full Name</Label>
              <Input
                id="leadName"
                value={leadFormData.name}
                onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadEmail" className="text-gray-700">Email</Label>
              <Input
                id="leadEmail"
                type="email"
                value={leadFormData.email}
                onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadPhone" className="text-gray-700">Phone</Label>
              <Input
                id="leadPhone"
                value={leadFormData.phone}
                onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadCompany" className="text-gray-700">Company</Label>
              <Input
                id="leadCompany"
                value={leadFormData.company}
                onChange={(e) => setLeadFormData({ ...leadFormData, company: e.target.value })}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadSource" className="text-gray-700">Source</Label>
              <Select value={leadFormData.source} onValueChange={(value) => setLeadFormData({ ...leadFormData, source: value as any })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Social">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadStatus" className="text-gray-700">Status</Label>
              <Select value={leadFormData.status} onValueChange={(value) => setLeadFormData({ ...leadFormData, status: value as any })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadAgent" className="text-gray-700">Assigned Agent</Label>
              <Select value={leadFormData.assignedAgent} onValueChange={(value) => setLeadFormData({ ...leadFormData, assignedAgent: value })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role === "Agent").map(agent => (
                    <SelectItem key={agent.id} value={agent.name}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsEditLeadOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSaveLead}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-gray-700">Full Name</Label>
              <Input
                id="userName"
                value={userFormData.name}
                onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail" className="text-gray-700">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userRole" className="text-gray-700">Role</Label>
              <Select value={userFormData.role} onValueChange={(value) => setUserFormData({ ...userFormData, role: value as any })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userStatus" className="text-gray-700">Status</Label>
              <Select value={userFormData.status} onValueChange={(value) => setUserFormData({ ...userFormData, status: value as any })}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsEditUserOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSaveUser}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;
