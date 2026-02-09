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
  Calendar,
  DollarSign,
  Clock,
  Target,
  Bell,
  Shield,
  Zap,
  Layout
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
      <div className="space-y-8">
        {/* Enhanced Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-6 md:p-8 shadow-2xl"
        >
          {/* Background Pattern */}
          <motion.div 
            className="absolute inset-0 opacity-10"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                whileHover={{ scale: 1.02 }}
              >
                Admin Dashboard
              </motion.h1>
              <motion.p 
                className="text-teal-100 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Welcome back! Here's what's happening with your leads today.
              </motion.p>
              
              {/* Live metrics ticker */}
              <motion.div 
                className="mt-4 flex items-center gap-4 text-teal-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm">Live Updates</span>
                </div>
                <div className="text-sm">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex gap-3 flex-wrap"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="sm" 
                  onClick={handleExportData}
                  className="bg-white text-teal-700 hover:bg-white/90 shadow-lg transition-all duration-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced 3D Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            {
              title: "Total Leads",
              value: totalLeads,
              icon: Users,
              trend: { value: 12.5, isPositive: true },
              color: "from-blue-500 to-indigo-600",
              bgColor: "from-blue-50 to-indigo-100",
              description: "Active pipeline"
            },
            {
              title: "Converted Leads",
              value: convertedLeads,
              icon: TrendingUp,
              trend: { value: 8.2, isPositive: true },
              color: "from-green-500 to-emerald-600",
              bgColor: "from-green-50 to-emerald-100",
              description: "Success rate"
            },
            {
              title: "Lost Leads",
              value: lostLeads,
              icon: TrendingDown,
              trend: { value: 2.1, isPositive: false },
              color: "from-red-500 to-rose-600",
              bgColor: "from-red-50 to-rose-100",
              description: "Optimization needed"
            },
            {
              title: "Active Agents",
              value: activeAgents,
              icon: UserCheck,
              trend: { value: 5.4, isPositive: true },
              color: "from-purple-500 to-violet-600",
              bgColor: "from-purple-50 to-violet-100",
              description: "Team capacity"
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.4 + index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.05,
                rotateX: 5,
                rotateY: 5,
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
              }}
              className="group perspective-1000"
            >
              <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${card.bgColor} transform-gpu`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color}`} />
                </div>
                
                <div className="absolute top-0 left-0 right-0 h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1 + index * 0.2, duration: 1 }}
                    className={`h-full bg-gradient-to-r ${card.color}`}
                  />
                </div>

                <div className="relative p-6 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className={`p-3 bg-gradient-to-br ${card.color} rounded-xl shadow-lg`}
                    >
                      <card.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        card.trend.isPositive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {card.trend.isPositive ? '+' : ''}{card.trend.value}%
                    </motion.div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-600 text-sm">{card.title}</h3>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="text-3xl font-bold text-gray-800"
                    >
                      {card.value}
                    </motion.p>
                    <p className="text-xs text-gray-500 font-medium">{card.description}</p>
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Analytics & Reports Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <Tabs defaultValue="analytics" className="space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-white shadow-sm border">
                  <TabsTrigger 
                    value="analytics" 
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all duration-300"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reports" 
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all duration-300"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all duration-300"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </motion.div>
            </div>

            <TabsContent value="analytics" className="space-y-8 p-6">
              {/* Enhanced Charts Row with Premium Animations */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-2xl -z-10" />
                  <LeadsByStatusChart />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-600/10 rounded-2xl -z-10" />
                  <MonthlyGrowthChart />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative lg:col-span-2 xl:col-span-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-violet-600/10 rounded-2xl -z-10" />
                  <AgentPerformanceChart />
                </motion.div>
              </motion.div>

              {/* Enhanced Performance Metrics Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  {
                    title: "Conversion Rate",
                    value: `${conversionRate}%`,
                    trend: "+2.5% from last month",
                    trendPositive: true,
                    color: "from-teal-500 to-cyan-600",
                    bgColor: "from-teal-50 to-cyan-100",
                    icon: TrendingUp,
                    hasProgress: true,
                    progressValue: conversionRate
                  },
                  {
                    title: "Average Deal Size",
                    value: "$12,450",
                    trend: "+5.2% from last month",
                    trendPositive: true,
                    color: "from-green-500 to-emerald-600",
                    bgColor: "from-green-50 to-emerald-100",
                    icon: BarChart3
                  },
                  {
                    title: "Response Time",
                    value: "2.4h",
                    trend: "+0.3h from last month",
                    trendPositive: false,
                    color: "from-orange-500 to-red-600",
                    bgColor: "from-orange-50 to-red-100",
                    icon: RefreshCw
                  },
                  {
                    title: "Pipeline Value",
                    value: "$156.7K",
                    trend: "+18.3% from last quarter",
                    trendPositive: true,
                    color: "from-purple-500 to-violet-600",
                    bgColor: "from-purple-50 to-violet-100",
                    icon: FileText
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      transition: { duration: 0.2 }
                    }}
                    className="group perspective-1000"
                  >
                    <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br ${metric.bgColor} transform-gpu`}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                        <div className={`absolute inset-0 bg-gradient-to-br ${metric.color}`} />
                      </div>
                      
                      <div className="absolute top-0 left-0 right-0 h-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ delay: 1 + index * 0.2, duration: 1 }}
                          className={`h-full bg-gradient-to-r ${metric.color}`}
                        />
                      </div>

                      <CardContent className="relative p-6 z-10">
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className={`p-2 bg-gradient-to-br ${metric.color} rounded-lg shadow-md`}
                          >
                            <metric.icon className="h-4 w-4 text-white" />
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              metric.trendPositive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {metric.trendPositive ? '↗' : '↘'}
                          </motion.div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-600">{metric.title}</p>
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="text-2xl font-bold text-gray-800"
                          >
                            {metric.value}
                          </motion.p>
                          <p className={`text-xs font-medium ${
                            metric.trendPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {metric.trend}
                          </p>
                        </div>
                        
                        {metric.hasProgress && (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.progressValue}%` }}
                                transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                                className={`h-1.5 rounded-full bg-gradient-to-r ${metric.color}`}
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Advanced Analytics Tables */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Lead Source Analytics */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b">
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <BarChart3 className="h-5 w-5" />
                      Lead Source Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableBody>
                          {[
                            { source: "Website", leads: 45, conv: "24.4%", revenue: "$89.2K" },
                            { source: "LinkedIn", leads: 32, conv: "18.7%", revenue: "$52.3K" },
                            { source: "Referral", leads: 28, conv: "35.7%", revenue: "$68.1K" },
                            { source: "Cold Email", leads: 19, conv: "12.6%", revenue: "$24.7K" }
                          ].map((item, index) => (
                            <motion.tr
                              key={item.source}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="hover:bg-blue-50/50 transition-colors"
                            >
                              <TableCell className="font-medium py-3">{item.source}</TableCell>
                              <TableCell className="text-center">
                                <Badge className="bg-blue-100 text-blue-800">{item.leads}</Badge>
                              </TableCell>
                              <TableCell className="text-center text-green-600 font-medium">{item.conv}</TableCell>
                              <TableCell className="text-right font-semibold">{item.revenue}</TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Agent Performance Analytics */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100 border-b">
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Users className="h-5 w-5" />
                      Top Agent Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableBody>
                          {[
                            { name: "Sarah Johnson", deals: 12, value: "$156.2K", rate: "28.5%" },
                            { name: "Mike Chen", deals: 10, value: "$134.8K", rate: "25.0%" },
                            { name: "Emily Davis", deals: 8, value: "$98.4K", rate: "22.2%" },
                            { name: "John Smith", deals: 6, value: "$76.1K", rate: "18.7%" }
                          ].map((agent, index) => (
                            <motion.tr
                              key={agent.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="hover:bg-green-50/50 transition-colors"
                            >
                              <TableCell className="font-medium py-3">{agent.name}</TableCell>
                              <TableCell className="text-center">
                                <Badge className="bg-green-100 text-green-800">{agent.deals}</Badge>
                              </TableCell>
                              <TableCell className="text-center font-semibold text-gray-700">{agent.value}</TableCell>
                              <TableCell className="text-right text-green-600 font-medium">{agent.rate}</TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-8 p-6">
              {/* Enhanced Lead Overview Table with Premium Design */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <motion.div
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
                      }}
                    />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                        >
                          <FileText className="h-6 w-6" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-xl font-bold">Lead Management Reports</CardTitle>
                          <p className="text-indigo-100 text-sm">Comprehensive lead analytics and tracking</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all duration-200"
                          onClick={generateLeadReport}
                        >
                          <Download className="h-4 w-4 mr-2 inline" />
                          Export Report
                        </motion.button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        {
                          title: "Sales Performance Report",
                          description: "Comprehensive sales metrics and performance analytics",
                          icon: TrendingUp,
                          color: "from-green-500 to-emerald-600",
                          bgColor: "from-green-50 to-emerald-100",
                          type: "sales"
                        },
                        {
                          title: "Lead Conversion Analysis",
                          description: "Detailed conversion funnel and optimization insights",
                          icon: BarChart3,
                          color: "from-blue-500 to-indigo-600",
                          bgColor: "from-blue-50 to-indigo-100",
                          type: "conversion"
                        },
                        {
                          title: "Agent Performance Review",
                          description: "Individual and team performance evaluations",
                          icon: Users,
                          color: "from-purple-500 to-violet-600",
                          bgColor: "from-purple-50 to-violet-100",
                          type: "agent"
                        }
                      ].map((report, index) => (
                        <motion.div
                          key={report.type}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                          whileHover={{ 
                            scale: 1.05,
                            rotateY: 5,
                            transition: { duration: 0.2 }
                          }}
                          className="group perspective-1000"
                        >
                          <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br ${report.bgColor} transform-gpu cursor-pointer`}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                              <div className={`absolute inset-0 bg-gradient-to-br ${report.color}`} />
                            </div>
                            
                            <div className="absolute top-0 left-0 right-0 h-1">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 1 + index * 0.2, duration: 1 }}
                                className={`h-full bg-gradient-to-r ${report.color}`}
                              />
                            </div>

                            <CardContent className="relative p-6 z-10">
                              <div className="flex items-center justify-between mb-4">
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: 10 }}
                                  className={`p-3 bg-gradient-to-br ${report.color} rounded-xl shadow-lg`}
                                >
                                  <report.icon className="h-6 w-6 text-white" />
                                </motion.div>
                                
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => generateLeadReport()}
                                  className="p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200 shadow-md"
                                >
                                  <Download className="h-4 w-4 text-gray-600" />
                                </motion.button>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                                  {report.title}
                                </h3>
                                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                                  {report.description}
                                </p>
                              </div>
                              
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 + index * 0.1 }}
                                className="mt-4 pt-4 border-t border-gray-200"
                              >
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Last generated: 2 hours ago</span>
                                  <span className="px-2 py-1 bg-white/60 rounded-full">Ready</span>
                                </div>
                              </motion.div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8 p-6">
              {/* Enhanced System Settings with Premium Design */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* General Settings */}
                <Card className="border-0 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white relative overflow-hidden">
                    <motion.div
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{ 
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)'
                      }}
                    />
                    
                    <div className="relative z-10 flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg"
                      >
                        <Settings className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <CardTitle className="font-bold">General Settings</CardTitle>
                        <p className="text-teal-100 text-sm">Configure system preferences</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-6">
                    {[
                      {
                        label: "Organization Name",
                        value: "LeadFlow Hub",
                        type: "text",
                        icon: Building,
                        description: "Your company name displayed across the platform"
                      },
                      {
                        label: "Default Currency",
                        value: "USD",
                        type: "select",
                        icon: DollarSign,
                        description: "Currency used for all financial calculations"
                      },
                      {
                        label: "Time Zone",
                        value: "UTC-8 (PST)",
                        type: "select",
                        icon: Clock,
                        description: "Default timezone for all users and reports"
                      }
                    ].map((setting, index) => (
                      <motion.div
                        key={setting.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors"
                          >
                            <setting.icon className="h-4 w-4 text-teal-600" />
                          </motion.div>
                          <label className="font-medium text-gray-700">{setting.label}</label>
                        </div>
                        
                        {setting.type === 'select' ? (
                          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200">
                            <option>{setting.value}</option>
                          </select>
                        ) : (
                          <input
                            type={setting.type}
                            defaultValue={setting.value}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200"
                          />
                        )}
                        
                        <p className="text-xs text-gray-500 mt-1 ml-11">{setting.description}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Lead Management Settings */}
                <Card className="border-0 shadow-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white relative overflow-hidden">
                    <motion.div
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{ 
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)'
                      }}
                    />
                    
                    <div className="relative z-10 flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, -360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg"
                      >
                        <Users className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <CardTitle className="font-bold">Lead Assignment Rules</CardTitle>
                        <p className="text-indigo-100 text-sm">Configure lead handling preferences</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <Label className="text-gray-700 font-medium">Assignment Method</Label>
                      <Select>
                        <SelectTrigger className="mt-2 border-gray-300 focus:ring-2 focus:ring-indigo-500">
                          <SelectValue placeholder="Round Robin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round-robin">Round Robin</SelectItem>
                          <SelectItem value="manual">Manual Assignment</SelectItem>
                          <SelectItem value="performance">Performance Based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium">Email Notifications</Label>
                      <div className="mt-3 space-y-3">
                        {[
                          { label: "New lead assignments", checked: true },
                          { label: "Daily performance reports", checked: true },
                          { label: "Lead status updates", checked: false }
                        ].map((notification, index) => (
                          <motion.label
                            key={notification.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                          >
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                              defaultChecked={notification.checked}
                            />
                            <span className="text-sm text-gray-600">{notification.label}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
          >
            {/* Premium gradient background for leads table */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-emerald-600/5 to-cyan-600/10" />
            
            {/* Enhanced header */}
            <div className="relative z-10 bg-gradient-to-r from-teal-600 via-emerald-700 to-cyan-600 p-4">
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-white font-bold text-lg flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                Recent Leads Overview
              </motion.h3>
            </div>
            
            <div className="relative z-10 bg-white/95 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <LeadsTable 
                    leads={leads.slice(0, 8)} 
                    onView={handleViewLead}
                    onUpdate={handleUpdateLead}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
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
            {/* Enhanced Mobile View - Premium Cards */}
            <div className="md:hidden space-y-4 p-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group"
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      user.status === 'Active' ? 'from-green-400 to-emerald-600' : 'from-gray-400 to-gray-600'
                    }`} />
                  </div>
                  
                  {/* Progress bar at top */}
                  <div className="absolute top-0 left-0 right-0 h-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${
                        user.status === 'Active' ? 'from-green-400 to-emerald-600' : 'from-gray-400 to-gray-500'
                      }`}
                    />
                  </div>
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      >
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 shadow-sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200 shadow-sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200 shadow-sm"
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        <Ban className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="relative z-10 space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{user.email}</span>
                      </div>
                    </motion.div>
                    
                    <div className="flex items-center justify-between">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                      >
                        <Badge 
                          className={`px-3 py-1 font-semibold shadow-sm ${
                            user.role === 'Admin' ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' : 
                            user.role === 'Manager' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 
                            'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                      >
                        <Badge
                          className={`px-3 py-1 font-semibold shadow-sm ${
                            user.status === "Active"
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                          }`}
                        >
                          ● {user.status}
                        </Badge>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Desktop View - Premium Table */}
            <div className="hidden md:block overflow-x-auto">
              <div className="relative">
                {/* Premium gradient header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-xl p-4">
                  <motion.h3 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white font-bold text-lg flex items-center gap-2"
                  >
                    <Users className="h-5 w-5" />
                    User Directory
                  </motion.h3>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
                      <TableHead className="min-w-[200px] text-gray-800 font-bold py-4">User Profile</TableHead>
                      <TableHead className="min-w-[200px] text-gray-800 font-bold">Contact Info</TableHead>
                      <TableHead className="min-w-[120px] text-gray-800 font-bold text-center">Role</TableHead>
                      <TableHead className="min-w-[120px] text-gray-800 font-bold text-center">Status</TableHead>
                      <TableHead className="text-center min-w-[150px] text-gray-800 font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr 
                        key={user.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ 
                          backgroundColor: "rgba(99, 102, 241, 0.05)",
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        }}
                        className="border-b border-gray-100 group cursor-pointer"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                            >
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </motion.div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                              <p className="text-sm text-gray-500">Team Member</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 font-medium">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                          >
                            <Badge 
                              className={`px-3 py-1 font-semibold shadow-sm ${
                                user.role === 'Admin' ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' : 
                                user.role === 'Manager' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 
                                'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                              }`}
                            >
                              {user.role}
                            </Badge>
                          </motion.div>
                        </TableCell>
                        <TableCell className="text-center">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
                          >
                            <Badge
                              className={`px-3 py-1 font-semibold shadow-sm ${
                                user.status === "Active"
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                  : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                              }`}
                            >
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block mr-1"
                              >
                                ●
                              </motion.span>
                              {user.status}
                            </Badge>
                          </motion.div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.2, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                              onClick={() => handleViewUser(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
