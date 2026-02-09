import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  Building, 
  Calendar,
  User,
  ArrowRight,
  X,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  UserCheck,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockLeads, mockUsers } from "@/data/mockData";
import { Lead } from "@/components/tables/LeadsTable";
import { useToast } from "@/components/ui/use-toast";

const AdminLeads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditLeadOpen, setIsEditLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // New lead form state
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    assignedAgent: "",
    notes: ""
  });
  
  // Edit lead form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    status: "new" as Lead["status"],
    assignedAgent: ""
  });

  // Export to CSV function
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Assigned Agent', 'Date', 'Next Follow Up'],
      ...filteredLeads.map(lead => [
        lead.name,
        lead.email,
        lead.phone || '',
        lead.company,
        lead.source,
        lead.status,
        lead.assignedAgent || '',
        lead.date,
        lead.nextFollowUp || ''
      ])
    ]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Leads data has been exported to CSV successfully.",
    });
  };

  // Refresh data function
  const refreshData = () => {
    setLeads([...mockLeads]);
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
    
    toast({
      title: "Data Refreshed",
      description: "Leads data has been refreshed successfully.",
    });
  };

  // Edit lead handler
  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setEditFormData({
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
  
  // Save edited lead
  const handleSaveEditedLead = () => {
    setLeads(leads.map(lead =>
      lead.id === editingLead?.id
        ? { ...lead, ...editFormData }
        : lead
    ));
    
    setIsEditLeadOpen(false);
    setEditingLead(null);
    
    toast({
      title: "Lead Updated",
      description: `${editFormData.name} has been updated successfully.`,
    });
  };

  // Lead lifecycle steps
  const lifecycleSteps = [
    { key: "new", label: "New", icon: Plus, color: "bg-teal-100 text-teal-800" },
    { key: "contacted", label: "Contacted", icon: Phone, color: "bg-blue-100 text-blue-800" },
    { key: "qualified", label: "Qualified", icon: CheckCircle, color: "bg-yellow-100 text-yellow-800" },
    { key: "proposal", label: "Proposal", icon: Target, color: "bg-purple-100 text-purple-800" },
    { key: "negotiation", label: "Negotiation", icon: TrendingUp, color: "bg-orange-100 text-orange-800" },
    { key: "converted", label: "Converted", icon: CheckCircle, color: "bg-green-100 text-green-800" },
    { key: "lost", label: "Lost", icon: X, color: "bg-red-100 text-red-800" }
  ];

  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  const handleAddLead = () => {
    const lead: Lead = {
      id: (leads.length + 1).toString(),
      ...newLead,
      status: "new" as const,
      date: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setLeads([lead, ...leads]);
    setNewLead({
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "Website",
      assignedAgent: "",
      notes: ""
    });
    setIsAddLeadOpen(false);
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const getStatusBadge = (status: Lead["status"]) => {
    const step = lifecycleSteps.find(s => s.key === status);
    return (
      <Badge className={step?.color || "bg-gray-100 text-gray-800"}>
        {step?.label || status}
      </Badge>
    );
  };

  // Stats calculation
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    converted: leads.filter(l => l.status === "converted").length,
    lost: leads.filter(l => l.status === "lost").length
  };

  return (
    <DashboardLayout role="admin" title="Lead Management">
      <div className="space-y-8">
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
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                >
                  <User className="h-6 w-6" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                    Lead Management
                  </h1>
                  <p className="text-teal-100 mt-1">Transform prospects into customers through intelligent pipeline management</p>
                </div>
              </div>

              {/* Live Metrics Ticker */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-6 text-sm"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <span className="text-teal-100">Live Pipeline</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <TrendingUp className="h-4 w-4 text-teal-200" />
                  <span className="text-teal-100">{filteredLeads.length} Active Leads</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <Target className="h-4 w-4 text-teal-200" />
                  <span className="text-teal-100">Real-time Updates</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={refreshData}
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
                  className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={exportToCSV}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </motion.div>
              
              <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" className="bg-white hover:bg-gray-50 text-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lead
                    </Button>
                  </motion.div>
                </DialogTrigger>
              <DialogContent className="max-w-lg rounded-3xl border-0 shadow-2xl bg-gradient-to-br from-white via-gray-25 to-teal-25">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 rounded-3xl opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(20, 184, 166, 0.3) 2px, transparent 2px), 
                                       radial-gradient(circle at 75% 75%, rgba(20, 184, 166, 0.3) 2px, transparent 2px)`,
                      backgroundSize: '40px 40px, 60px 60px'
                    }} />
                  </div>

                  <div className="relative z-10 p-6">
                    <DialogHeader className="text-center mb-6">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                      >
                        <Plus className="h-8 w-8 text-white" />
                      </motion.div>
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-teal-800 bg-clip-text text-transparent">
                        Add New Lead
                      </DialogTitle>
                      <p className="text-gray-600 mt-2">Capture and qualify a new prospect</p>
                    </DialogHeader>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-2"
                        >
                          <Label className="text-gray-700 font-semibold flex items-center gap-2">
                            <User className="h-4 w-4 text-teal-600" />
                            Full Name
                          </Label>
                          <Input 
                            value={newLead.name}
                            onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                            placeholder="John Doe"
                            className="rounded-xl border-gray-300 focus:border-teal-400 focus:ring-teal-100 transition-all duration-300"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-2"
                        >
                          <Label className="text-gray-700 font-semibold flex items-center gap-2">
                            <Mail className="h-4 w-4 text-teal-600" />
                            Email
                          </Label>
                          <Input 
                            value={newLead.email}
                            onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                            placeholder="john@company.com"
                            className="rounded-xl border-gray-300 focus:border-teal-400 focus:ring-teal-100 transition-all duration-300"
                          />
                        </motion.div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-2"
                        >
                          <Label className="text-gray-700 font-semibold flex items-center gap-2">
                            <Phone className="h-4 w-4 text-teal-600" />
                            Phone
                          </Label>
                          <Input 
                            value={newLead.phone}
                            onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                            placeholder="+1 234 567 8900"
                            className="rounded-xl border-gray-300 focus:border-teal-400 focus:ring-teal-100 transition-all duration-300"
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          className="space-y-2"
                        >
                          <Label className="text-gray-700 font-semibold flex items-center gap-2">
                            <Building className="h-4 w-4 text-teal-600" />
                            Company
                          </Label>
                          <Input 
                            value={newLead.company}
                            onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                            placeholder="Acme Corp"
                            className="rounded-xl border-gray-300 focus:border-teal-400 focus:ring-teal-100 transition-all duration-300"
                          />
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="space-y-2"
                        >
                          <Label className="text-gray-700 font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-teal-600" />
                            Source
                          </Label>
                          <Select value={newLead.source} onValueChange={(value) => setNewLead({...newLead, source: value})}>
                            <SelectTrigger className="rounded-xl border-gray-300 focus:border-teal-400 focus:ring-teal-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Website">Website</SelectItem>
                              <SelectItem value="Referral">Referral</SelectItem>
                              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                              <SelectItem value="Ads">Ads</SelectItem>
                              <SelectItem value="Cold Call">Cold Call</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="space-y-2"
                        >
                          <Label className="text-gray-700 font-semibold flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-teal-600" />
                            Assign Agent
                          </Label>
                          <Select value={newLead.assignedAgent} onValueChange={(value) => setNewLead({...newLead, assignedAgent: value})}>
                            <SelectTrigger className="rounded-xl border-gray-300 focus:border-teal-400 focus:ring-teal-100">
                              <SelectValue placeholder="Select agent" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {mockUsers.filter(u => u.role === "Agent").map(agent => (
                                <SelectItem key={agent.id} value={agent.name}>{agent.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="space-y-2"
                      >
                        <Label className="text-gray-700 font-semibold flex items-center gap-2">
                          <Edit className="h-4 w-4 text-teal-600" />
                          Notes
                        </Label>
                        <Textarea 
                          value={newLead.notes}
                          onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                          placeholder="Additional notes about this prospect..."
                          className="rounded-xl border-gray-300 focus:border-teal-400 focus:ring-teal-100 transition-all duration-300 min-h-[80px]"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="flex gap-3 pt-4"
                      >
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                          <Button 
                            onClick={handleAddLead}
                            disabled={!newLead.name || !newLead.email}
                            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Lead
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAddLeadOpen(false)}
                            className="px-6 py-3 border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-300"
                          >
                            Cancel
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          </motion.div>
          </div>
        </motion.div>

        {/* Premium Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { 
              label: "Total Leads", 
              value: stats.total, 
              icon: User, 
              gradient: "from-teal-500 to-teal-600",
              bg: "from-teal-50 to-teal-100",
              change: "+12%",
              changeType: "increase"
            },
            { 
              label: "New Leads", 
              value: stats.new, 
              icon: Plus, 
              gradient: "from-blue-500 to-blue-600",
              bg: "from-blue-50 to-blue-100",
              change: "+5%",
              changeType: "increase"
            },
            { 
              label: "Converted", 
              value: stats.converted, 
              icon: CheckCircle, 
              gradient: "from-emerald-500 to-emerald-600",
              bg: "from-emerald-50 to-emerald-100", 
              change: "+8%",
              changeType: "increase"
            },
            { 
              label: "Lost", 
              value: stats.lost, 
              icon: AlertTriangle, 
              gradient: "from-red-500 to-red-600",
              bg: "from-red-50 to-red-100",
              change: "-3%",
              changeType: "decrease"
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                delay: 0.4 + index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                y: -8,
                rotateX: 5,
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 30 }
              }}
              className="group relative"
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bg} p-6 shadow-lg border border-white/50 hover:shadow-2xl transition-all duration-500`}>
                {/* Animated Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  initial={false}
                  animate={{
                    background: [
                      `linear-gradient(135deg, ${stat.gradient.split(' ')[1]} 0%, ${stat.gradient.split(' ')[3]} 100%)`,
                      `linear-gradient(225deg, ${stat.gradient.split(' ')[1]} 0%, ${stat.gradient.split(' ')[3]} 100%)`,
                      `linear-gradient(315deg, ${stat.gradient.split(' ')[1]} 0%, ${stat.gradient.split(' ')[3]} 100%)`,
                      `linear-gradient(135deg, ${stat.gradient.split(' ')[1]} 0%, ${stat.gradient.split(' ')[3]} 100%)`
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Floating Icon */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1] 
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      delay: index * 0.5 
                    }}
                    className={`relative p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                    
                    {/* Glow Effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.gradient} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    />
                  </motion.div>

                  {/* Trend Indicator */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.changeType === 'increase' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {stat.change}
                  </motion.div>
                </div>

                {/* Value and Label */}
                <div className="relative z-10">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors"
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: 0.7 + index * 0.1,
                        duration: 0.8 
                      }}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors"
                  >
                    {stat.label}
                  </motion.p>
                </div>

                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent"
                  style={{
                    background: `linear-gradient(135deg, ${stat.gradient.replace('from-', '').replace('to-', ', ')}) border-box`,
                    WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'exclude'
                  }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Lead Pipeline Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/95 via-emerald-600/90 to-cyan-600/95" />
            
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
                                 radial-gradient(circle at 25% 75%, rgba(255,255,255,0.2) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                backgroundSize: '300px 300px'
              }} />
            </div>
            
            {/* Animated Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-emerald-500/30 to-cyan-400/20"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%']
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                backgroundSize: '400% 400%'
              }}
            />

            <div className="relative z-10 p-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-between mb-8"
              >
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">Sales Pipeline</h3>
                  <p className="text-white/90 drop-shadow-sm">Track leads through their journey to conversion</p>
                </div>
                
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg border border-white/30"
                >
                  <TrendingUp className="h-6 w-6 text-white" />
                </motion.div>
              </motion.div>

              {/* Premium Sales Pipeline - User Management Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {lifecycleSteps.map((step, index) => {
                  const stepLeads = leads.filter(l => l.status === step.key).length;
                  const percentage = stats.total > 0 ? Math.round((stepLeads / stats.total) * 100) : 0;
                  
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: 0.9 + index * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: 5,
                        transition: { duration: 0.2 }
                      }}
                      className="group perspective-1000"
                    >
                      <Card className={`relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 transform-gpu ${
                        stepLeads > 0 
                          ? 'bg-gradient-to-br from-teal-50 to-emerald-100' 
                          : 'bg-gradient-to-br from-gray-50 to-gray-100'
                      }`}>
                        {/* Animated background effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                          <div className={`absolute inset-0 bg-gradient-to-br ${
                            stepLeads > 0 ? 'from-teal-500 to-emerald-600' : 'from-gray-400 to-gray-500'
                          }`} />
                        </div>
                        
                        {/* Progress indicator */}
                        <div className="absolute top-0 left-0 right-0 h-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 1.5 + index * 0.2, duration: 1 }}
                            className={`h-full bg-gradient-to-r ${
                              stepLeads > 0 ? 'from-teal-400 to-emerald-600' : 'from-gray-300 to-gray-400'
                            }`}
                          />
                        </div>

                        <div className="relative p-6 z-10">
                          {/* Pulse Animation for Active Steps */}
                          {stepLeads > 0 && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-teal-600/10 rounded-2xl"
                              animate={{ 
                                scale: [1, 1.05, 1],
                                opacity: [0.3, 0.6, 0.3] 
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                delay: index * 0.2 
                              }}
                            />
                          )}

                          <div className="flex items-center justify-between mb-4">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              className={`p-3 bg-gradient-to-br ${
                                stepLeads > 0 ? 'from-teal-500 to-emerald-600' : 'from-gray-400 to-gray-500'
                              } rounded-xl shadow-lg`}
                            >
                              <step.icon className="h-5 w-5 text-white" />
                            </motion.div>
                            
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                              className="text-right"
                            >
                              <motion.div 
                                className="text-2xl font-bold text-gray-800"
                                key={stepLeads}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                              >
                                {stepLeads}
                              </motion.div>
                              <div className="text-xs text-gray-500 font-medium">
                                {percentage}% share
                              </div>
                            </motion.div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                              {step.label}
                            </h4>
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                              Sales stage activity
                            </p>
                          </div>

                          {/* Connection line to next step */}
                          {index < lifecycleSteps.length - 1 && (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 2 + index * 0.2 }}
                              className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 z-20"
                            />
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pipeline Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-700">
                      {((stats.converted / stats.total) * 100 || 0).toFixed(1)}%
                    </div>
                    <div className="text-sm text-teal-600 font-medium">Conversion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-700">
                      {stats.total - stats.lost - stats.converted}
                    </div>
                    <div className="text-sm text-emerald-600 font-medium">In Pipeline</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {(stats.total / 30 || 0).toFixed(1)}
                    </div>
                    <div className="text-sm text-blue-600 font-medium">Avg. Daily Leads</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Premium Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-lg p-6">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-25 via-white to-emerald-25 opacity-50" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex items-center gap-3 mb-6"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-md"
                >
                  <Filter className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Smart Filters</h3>
                  <p className="text-sm text-gray-600">Find exactly what you're looking for</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Enhanced Search Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="lg:col-span-2 relative group"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.02, 1],
                        rotate: [0, 2, -2, 0] 
                      }}
                      transition={{ 
                        duration: 6, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                    >
                      <Search className="h-5 w-5 text-teal-500 group-focus-within:text-teal-600 transition-colors" />
                    </motion.div>
                    
                    <Input
                      placeholder="Search leads by name, email, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-11 pr-4 py-3 text-gray-900 bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl 
                               focus:bg-white focus:border-teal-300 focus:ring-4 focus:ring-teal-100 
                               transition-all duration-300 shadow-sm hover:shadow-md
                               group-hover:border-teal-200"
                    />
                    
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-teal-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
                      animate={{
                        rotate: [0, 1, -1, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion.div>

                {/* Enhanced Status Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="relative group"
                >
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="py-3 bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl 
                                           focus:bg-white focus:border-teal-300 focus:ring-4 focus:ring-teal-100 
                                           transition-all duration-300 shadow-sm hover:shadow-md
                                           group-hover:border-teal-200">
                      <motion.div
                        animate={{ x: [0, 2, -2, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="flex items-center gap-2"
                      >
                        <Target className="h-4 w-4 text-teal-500" />
                        <SelectValue placeholder="All Status" />
                      </motion.div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                      <SelectItem value="all" className="rounded-lg">
                        <motion.div whileHover={{ x: 2 }} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          All Status
                        </motion.div>
                      </SelectItem>
                      {lifecycleSteps.map((step, index) => (
                        <SelectItem key={step.key} value={step.key} className="rounded-lg">
                          <motion.div 
                            whileHover={{ x: 2 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-2"
                          >
                            <step.icon className="h-3 w-3" />
                            {step.label}
                          </motion.div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Enhanced Source Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="relative group"
                >
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="py-3 bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl 
                                           focus:bg-white focus:border-teal-300 focus:ring-4 focus:ring-teal-100 
                                           transition-all duration-300 shadow-sm hover:shadow-md
                                           group-hover:border-teal-200">
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="flex items-center gap-2"
                      >
                        <TrendingUp className="h-4 w-4 text-teal-500" />
                        <SelectValue placeholder="All Sources" />
                      </motion.div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                      <SelectItem value="all" className="rounded-lg">
                        <motion.div whileHover={{ x: 2 }} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          All Sources
                        </motion.div>
                      </SelectItem>
                      {["Website", "Referral", "LinkedIn", "Ads", "Cold Call"].map((source, index) => (
                        <SelectItem key={source} value={source} className="rounded-lg">
                          <motion.div 
                            whileHover={{ x: 2 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-teal-400 rounded-full" />
                            {source}
                          </motion.div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              {/* Filter Results Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 }}
                className="mt-4 flex items-center justify-between text-sm text-gray-600"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-lg border border-teal-100"
                >
                  <UserCheck className="h-4 w-4 text-teal-600" />
                  <span className="font-medium">
                    {filteredLeads.length} of {leads.length} leads shown
                  </span>
                </motion.div>

                {(searchQuery || statusFilter !== "all" || sourceFilter !== "all") && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setSourceFilter("all");
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-xl">
            {/* Table Header Background */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-teal-50 via-white to-emerald-50 opacity-80" />
            
            {/* Enhanced Mobile View - Premium Cards */}
            <div className="md:hidden space-y-4 p-4">
              {filteredLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
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
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-600" />
                  </div>
                  
                  {/* Progress bar at top */}
                  <div className="absolute top-0 left-0 right-0 h-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-600"
                    />
                  </div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      >
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 shadow-sm"
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200 shadow-sm"
                        onClick={() => handleEditLead(lead)}
                      >
                        <Edit className="h-4 w-4" />
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
                        <span className="font-medium text-gray-900">{lead.email}</span>
                      </div>
                    </motion.div>
                    
                    <div className="flex items-center justify-between">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                      >
                        <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1">
                          {lead.source}
                        </Badge>
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                      >
                        <span className="text-xs text-gray-500 font-medium">{lead.date}</span>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="border-t border-gray-200 pt-3"
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{lead.company}</span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Ripple effect on tap */}
                  <motion.div
                    className="absolute inset-0 bg-teal-400/20 rounded-2xl"
                    initial={{ scale: 0, opacity: 0.6 }}
                    whileTap={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Enhanced Desktop Table View - Premium Dashboard Style */}
            <div className="hidden sm:block overflow-x-auto relative z-10">
              <div className="relative">
                {/* Premium gradient header */}
                <div className="bg-gradient-to-r from-teal-600 via-emerald-700 to-cyan-600 rounded-t-xl p-4">
                  <motion.h3 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9 }}
                    className="text-white font-bold text-lg flex items-center gap-2"
                  >
                    <User className="h-5 w-5" />
                    Lead Directory
                  </motion.h3>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
                      <TableHead className="font-bold min-w-[200px] text-gray-800 py-4">Lead Profile</TableHead>
                      <TableHead className="font-bold min-w-[150px] text-gray-800">Contact Info</TableHead>
                      <TableHead className="font-bold min-w-[120px] text-gray-800">Company</TableHead>
                      <TableHead className="font-bold min-w-[100px] text-gray-800 text-center">Source</TableHead>
                      <TableHead className="font-bold min-w-[120px] text-gray-800 text-center">Status</TableHead>
                      <TableHead className="font-bold min-w-[150px] text-gray-800">Assigned Agent</TableHead>
                      <TableHead className="font-bold min-w-[100px] text-gray-800">Date</TableHead>
                      <TableHead className="font-bold text-center min-w-[120px] text-gray-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredLeads.map((lead, index) => (
                      <motion.tr 
                        key={lead.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ 
                          backgroundColor: "rgba(20, 184, 166, 0.05)",
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        }}
                        className="border-b border-gray-100 group cursor-pointer"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                            >
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </motion.div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{lead.name}</p>
                              <p className="text-sm text-gray-500">Lead</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-700 font-medium">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{lead.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 font-medium">{lead.company || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                          >
                            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 font-semibold shadow-sm">
                              {lead.source}
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
                            <Badge className={`px-3 py-1 font-semibold shadow-sm ${
                              lead.status === 'converted' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : lead.status === 'qualified'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : lead.status === 'new'
                                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                                : lead.status === 'contacted'
                                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
                                : lead.status === 'lost'
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                            }`}>
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block mr-1"
                              >
                                ●
                              </motion.span>
                              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            </Badge>
                          </motion.div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {lead.assignedAgent.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-gray-700 font-medium">{lead.assignedAgent}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 font-medium">{lead.date}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <motion.button
                              whileHover={{ scale: 1.2, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.2, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                              onClick={() => handleEditLead(lead)}
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Empty State */}
            {filteredLeads.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-6 bg-gray-100 rounded-full mb-4"
                >
                  <Search className="h-8 w-8 text-gray-400" />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600 text-center max-w-md">
                  {searchQuery || statusFilter !== "all" || sourceFilter !== "all" 
                    ? "Try adjusting your filters to see more results."
                    : "Start by adding your first lead to begin building your pipeline."
                  }
                </p>
              </motion.div>
            )}
          </div>
        </div>
        </motion.div>

        {/* Lead Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
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

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Status Updates</h3>
                    <div className="flex flex-wrap gap-2">
                      {lifecycleSteps.map(step => (
                        <Button
                          key={step.key}
                          variant={selectedLead.status === step.key ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateLeadStatus(selectedLead.id, step.key as Lead["status"])}
                          className={selectedLead.status === step.key ? "bg-teal-600 hover:bg-teal-700" : "border-gray-300"}
                        >
                          <step.icon className="h-3 w-3 mr-1" />
                          {step.label}
                        </Button>
                      ))}
                    </div>
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
                <Label htmlFor="editLeadName" className="text-gray-700">Full Name</Label>
                <Input
                  id="editLeadName"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLeadEmail" className="text-gray-700">Email</Label>
                <Input
                  id="editLeadEmail"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLeadPhone" className="text-gray-700">Phone</Label>
                <Input
                  id="editLeadPhone"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLeadCompany" className="text-gray-700">Company</Label>
                <Input
                  id="editLeadCompany"
                  value={editFormData.company}
                  onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLeadSource" className="text-gray-700">Source</Label>
                <Select value={editFormData.source} onValueChange={(value) => setEditFormData({ ...editFormData, source: value as any })}>
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
                <Label htmlFor="editLeadStatus" className="text-gray-700">Status</Label>
                <Select value={editFormData.status} onValueChange={(value) => setEditFormData({ ...editFormData, status: value as Lead["status"] })}>
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
                <Label htmlFor="editLeadAgent" className="text-gray-700">Assigned Agent</Label>
                <Select value={editFormData.assignedAgent} onValueChange={(value) => setEditFormData({ ...editFormData, assignedAgent: value })}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.filter(u => u.role === "Agent").map(agent => (
                      <SelectItem key={agent.id} value={agent.name}>{agent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditLeadOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSaveEditedLead}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminLeads;