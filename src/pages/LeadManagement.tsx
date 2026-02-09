import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit2, 
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
  AlertTriangle
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

const LeadManagementPage = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <Badge className={`px-3 py-1 font-semibold shadow-sm ${
          status === 'converted' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
            : status === 'qualified'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : status === 'new'
            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
            : status === 'contacted'
            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white'
            : status === 'proposal'
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
            : status === 'negotiation'
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
            : status === 'lost'
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
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </motion.div>
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
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600">Manage your leads through the entire sales pipeline</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Add New Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Name</Label>
                      <Input 
                        value={newLead.name}
                        onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                        placeholder="Full name"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Email</Label>
                      <Input 
                        value={newLead.email}
                        onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                        placeholder="email@company.com"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Phone</Label>
                      <Input 
                        value={newLead.phone}
                        onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                        placeholder="+1 234 567 8900"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Company</Label>
                      <Input 
                        value={newLead.company}
                        onChange={(e) => setNewLead({...newLead, company: e.target.value})}
                        placeholder="Company name"
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Source</Label>
                      <Select value={newLead.source} onValueChange={(value) => setNewLead({...newLead, source: value})}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Referral">Referral</SelectItem>
                          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          <SelectItem value="Ads">Ads</SelectItem>
                          <SelectItem value="Cold Call">Cold Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Assign to Agent</Label>
                      <Select value={newLead.assignedAgent} onValueChange={(value) => setNewLead({...newLead, assignedAgent: value})}>
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
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">Notes</Label>
                    <Textarea 
                      value={newLead.notes}
                      onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                      placeholder="Additional notes about this lead..."
                      className="border-gray-300"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleAddLead}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                      disabled={!newLead.name || !newLead.email}
                    >
                      Add Lead
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddLeadOpen(false)}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: stats.total, icon: User, color: "bg-teal-600" },
            { label: "New Leads", value: stats.new, icon: Plus, color: "bg-blue-600" },
            { label: "Converted", value: stats.converted, icon: CheckCircle, color: "bg-green-600" },
            { label: "Lost", value: stats.lost, icon: AlertTriangle, color: "bg-red-600" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Lead Lifecycle Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Lead Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lifecycleSteps.map((step, index) => (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className={`p-2 rounded-lg ${step.color}`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{step.label}</span>
                    {index < lifecycleSteps.length - 2 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-gray-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {lifecycleSteps.map(step => (
                  <SelectItem key={step.key} value={step.key}>
                    {step.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Ads">Ads</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
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
                    >
                      <Edit2 className="h-4 w-4" />
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

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 border-0">
                  <TableHead className="text-white font-bold min-w-[150px]">Lead</TableHead>
                  <TableHead className="text-white font-bold min-w-[200px]">Contact</TableHead>
                  <TableHead className="text-white font-bold min-w-[150px]">Company</TableHead>
                  <TableHead className="text-white font-bold text-center min-w-[100px]">Source</TableHead>
                  <TableHead className="text-white font-bold text-center min-w-[120px]">Status</TableHead>
                  <TableHead className="text-white font-bold min-w-[150px]">Agent</TableHead>
                  <TableHead className="text-white font-bold min-w-[100px]">Date</TableHead>
                  <TableHead className="text-white font-bold text-center min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
                        <span className="text-gray-700 font-medium">{lead.company}</span>
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
                    <TableCell className="text-center">{getStatusBadge(lead.status)}</TableCell>
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
                        >
                          <Edit2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
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
      </div>
    </DashboardLayout>
  );
};

export default LeadManagementPage;