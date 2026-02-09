import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building,
  Calendar,
  Download,
  RefreshCw,
  Shield,
  Eye,
  TrendingUp,
  UserCheck,
  Settings,
  GraduationCap
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
  TableRow,
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
import { mockUsers } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Agent";
  status: "Active" | "Inactive";
  phone?: string;
  department?: string;
  joinDate?: string;
  lastLogin?: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(
    mockUsers.map(u => ({
      ...u,
      phone: `+1 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
      department: u.role === "Admin" ? "Administration" : u.role === "Manager" ? "Sales Management" : "Sales",
      joinDate: "2024-01-15",
      lastLogin: "2024-02-07"
    }))
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Agent",
    department: "Sales",
  });
  
  // Edit user form state
  const [editUserFormData, setEditUserFormData] = useState({
    name: "",
    email: "",
    role: "Agent" as User["role"],
    status: "Active" as User["status"]
  });

  // Export to CSV function
  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Status', 'Phone', 'Join Date', 'Last Login'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.department || '',
        user.status,
        user.phone || '',
        user.joinDate || '',
        user.lastLogin || ''
      ])
    ]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Users data has been exported to CSV successfully.",
    });
  };

  // Refresh data function
  const refreshData = () => {
    setUsers(mockUsers.map(u => ({
      ...u,
      phone: `+1 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
      department: u.role === "Admin" ? "Administration" : u.role === "Manager" ? "Sales Management" : "Sales",
      joinDate: "2024-01-15",
      lastLogin: "2024-02-07"
    })));
    
    toast({
      title: "Data Refreshed",
      description: "Users data has been refreshed successfully.",
    });
  };

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.department?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleAddUser = () => {
    const user: User = {
      id: (users.length + 1).toString(),
      ...newUser,
      role: newUser.role as "Admin" | "Manager" | "Agent",
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: "Never"
    };

    setUsers([...users, user]);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "Agent",
      department: "Sales",
    });
    setIsAddUserOpen(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditUserOpen(true);
  };
  
  // Save edited user
  const handleSaveEditedUser = () => {
    setUsers(users.map(user =>
      user.id === editingUser?.id
        ? { ...user, ...editUserFormData }
        : user
    ));
    
    setIsEditUserOpen(false);
    setEditingUser(null);
    
    toast({
      title: "User Updated",
      description: `${editUserFormData.name} has been updated successfully.`,
    });
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      Admin: "bg-red-100 text-red-800",
      Manager: "bg-blue-100 text-blue-800",
      Agent: "bg-green-100 text-green-800"
    };
    return (
      <Badge className={colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        className={
          status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }
      >
        <div className="flex items-center gap-1">
          {status === "Active" ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {status}
        </div>
      </Badge>
    );
  };

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "Active").length,
    admins: users.filter(u => u.role === "Admin").length,
    agents: users.filter(u => u.role === "Agent").length
  };

  return (
    <DashboardLayout role="admin" title="User Management">
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
                  <Users className="h-6 w-6" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                    User Management
                  </h1>
                  <p className="text-teal-100 mt-1">Manage your team members and their access levels with precision</p>
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
                  <span className="text-teal-100">Team Active</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <Shield className="h-4 w-4 text-teal-200" />
                  <span className="text-teal-100">{filteredUsers.length} Members</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <CheckCircle className="h-4 w-4 text-teal-200" />
                  <span className="text-teal-100">Live Management</span>
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
              
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" className="bg-white hover:bg-gray-50 text-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Full Name</Label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter full name"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Email</Label>
                    <Input
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="email@company.com"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Phone</Label>
                    <Input
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agent">Agent</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">Department</Label>
                    <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Sales Management">Sales Management</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleAddUser}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                      disabled={!newUser.name || !newUser.email}
                    >
                      Add User
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddUserOpen(false)}
                      className="border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
          </div>
        </motion.div>

        {/* 3D Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div
            whileHover={{ 
              scale: 1.05,
              rotateX: 5,
              rotateY: 5,
            }}
            whileTap={{ scale: 0.98 }}
            className="group perspective-1000"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg"
                  >
                    <Users className="h-6 w-6 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                  >
                    +12%
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent"
                  >
                    {stats.total}
                  </motion.p>
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                    </motion.div>
                    <span>+12% from last month</span>
                  </div>
                </div>
                
                {/* Animated border */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ 
              scale: 1.05,
              rotateX: 5,
              rotateY: 5,
            }}
            whileTap={{ scale: 0.98 }}
            className="group perspective-1000"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg"
                  >
                    <CheckCircle className="h-6 w-6 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                  >
                    +8%
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent"
                  >
                    {stats.active}
                  </motion.p>
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                    </motion.div>
                    <span>+8% from last month</span>
                  </div>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ 
              scale: 1.05,
              rotateX: 5,
              rotateY: 5,
            }}
            whileTap={{ scale: 0.98 }}
            className="group perspective-1000"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg"
                  >
                    <Shield className="h-6 w-6 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full"
                  >
                    SECURE
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Administrators</p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent"
                  >
                    {stats.admins}
                  </motion.p>
                  <div className="flex items-center text-sm text-red-600 font-medium">
                    <Shield className="h-4 w-4 mr-2" />
                    <span>System-level access</span>
                  </div>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-400 to-rose-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            whileHover={{ 
              scale: 1.05,
              rotateX: 5,
              rotateY: 5,
            }}
            whileTap={{ scale: 0.98 }}
            className="group perspective-1000"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg"
                  >
                    <Users className="h-6 w-6 text-white" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
                  >
                    ACTIVE
                  </motion.div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Sales Agents</p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"
                  >
                    {stats.agents}
                  </motion.p>
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Front-line team</span>
                  </div>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* User Management Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="mb-6">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2"
            >
              User Management Pipeline
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gray-600"
            >
              Track user lifecycle from onboarding to active engagement
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { 
                step: "Registration", 
                count: 25, 
                icon: UserPlus, 
                color: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100",
                description: "New sign-ups",
                percentage: 15
              },
              { 
                step: "Verification", 
                count: 22, 
                icon: Shield, 
                color: "from-yellow-500 to-orange-600",
                bgColor: "from-yellow-50 to-orange-100", 
                description: "Email & identity",
                percentage: 88
              },
              { 
                step: "Role Assignment", 
                count: 20, 
                icon: Settings, 
                color: "from-purple-500 to-purple-600",
                bgColor: "from-purple-50 to-purple-100",
                description: "Access levels",
                percentage: 91
              },
              { 
                step: "Training", 
                count: 18, 
                icon: GraduationCap, 
                color: "from-indigo-500 to-indigo-600",
                bgColor: "from-indigo-50 to-indigo-100",
                description: "Onboarding completed",
                percentage: 90
              },
              { 
                step: "Active Users", 
                count: 16, 
                icon: CheckCircle, 
                color: "from-green-500 to-green-600",
                bgColor: "from-green-50 to-green-100",
                description: "Fully engaged",
                percentage: 89
              }
            ].map((pipeline, index) => (
              <motion.div
                key={pipeline.step}
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
                <Card className={`relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-500 bg-gradient-to-br ${pipeline.bgColor} transform-gpu`}>
                  {/* Animated background effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${pipeline.color}`} />
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pipeline.percentage}%` }}
                      transition={{ delay: 1.5 + index * 0.2, duration: 1 }}
                      className={`h-full bg-gradient-to-r ${pipeline.color}`}
                    />
                  </div>

                  <div className="relative p-6 z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className={`p-3 bg-gradient-to-br ${pipeline.color} rounded-xl shadow-lg`}
                      >
                        <pipeline.icon className="h-5 w-5 text-white" />
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                        className="text-right"
                      >
                        <motion.div 
                          className="text-2xl font-bold text-gray-800"
                          key={pipeline.count}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                        >
                          {pipeline.count}
                        </motion.div>
                        <div className="text-xs text-gray-500 font-medium">
                          {pipeline.percentage}% conversion
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {pipeline.step}
                      </h4>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        {pipeline.description}
                      </p>
                    </div>

                    {/* Connection line to next step */}
                    {index < 4 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2 + index * 0.2 }}
                        className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 z-20"
                      />
                    )}
                  </div>

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pipeline.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pipeline insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-2 bg-teal-500 rounded-lg"
                >
                  <TrendingUp className="h-4 w-4 text-white" />
                </motion.div>
                <div>
                  <p className="font-medium text-teal-800">Pipeline Performance</p>
                  <p className="text-sm text-teal-600">Overall conversion rate: 64% (+5% from last month)</p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-teal-600 transition-colors"
              >
                View Details
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-gray-300"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Enhanced Users Table with Premium Animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative"
        >
          {/* Premium table container with glow effect */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
            {/* Subtle gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-30" />
            
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
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDetailOpen(true);
                        }}
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
                        onClick={() => toggleUserStatus(user.id)}
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
                        <Badge className={`px-3 py-1 font-semibold shadow-sm ${
                          user.status === 'Active' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                        }`}>
                          ● {user.status}
                        </Badge>
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                      >
                        <span className="text-xs text-gray-500 font-medium">{user.lastLogin}</span>
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
                        <span className="font-medium">{user.department}</span>
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

            {/* Enhanced Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 border-0">
                    <TableHead className="text-white font-bold min-w-[200px]">User</TableHead>
                    <TableHead className="text-white font-bold min-w-[200px]">Contact</TableHead>
                    <TableHead className="text-white font-bold min-w-[120px]">Role</TableHead>
                    <TableHead className="text-white font-bold min-w-[150px]">Department</TableHead>
                    <TableHead className="text-white font-bold text-center min-w-[100px]">Status</TableHead>
                    <TableHead className="text-white font-bold min-w-[130px]">Last Login</TableHead>
                    <TableHead className="text-white font-bold text-center min-w-[120px]">Actions</TableHead>
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
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </motion.div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{user.name}</p>
                            <p className="text-sm text-gray-500">User</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-700 font-medium">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{user.phone || 'Not provided'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <Badge className={`px-3 py-1 font-semibold shadow-sm ${
                            user.role === 'Admin' 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                              : user.role === 'Manager'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : user.role === 'Agent'
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                              : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </motion.div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 font-medium">{user.department}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
                        >
                          <Badge className={`px-3 py-1 font-semibold shadow-sm ${
                            user.status === 'Active' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                              : user.status === 'Inactive'
                              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                          }`}>
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="inline-block mr-1"
                            >
                              ●
                            </motion.span>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </motion.div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 font-medium">{user.lastLogin}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <motion.button
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDetailOpen(true);
                            }}
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
                            onClick={() => toggleUserStatus(user.id)}
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
            
            {/* Table footer with subtle gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="px-6 py-4 bg-gradient-to-r from-gray-50/50 to-transparent border-t border-gray-100"
            >
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Showing {filteredUsers.length} of {users.length} users</span>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-teal-600 font-medium cursor-pointer"
                >
                  <span>Load more</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* User Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
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
                      <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                      <div className="flex gap-2 mt-1">
                        {getRoleBadge(selectedUser.role)}
                        {getStatusBadge(selectedUser.status)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{selectedUser.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{selectedUser.phone || "Not provided"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{selectedUser.department}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Account Information</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Join Date: </span>
                            <span className="text-gray-900">{selectedUser.joinDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Last Login: </span>
                            <span className="text-gray-900">{selectedUser.lastLogin}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">User ID: </span>
                            <span className="text-gray-900">{selectedUser.id}</span>
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
                      onClick={() => toggleUserStatus(selectedUser.id)}
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

        {/* Edit User Modal */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Edit User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editUserName" className="text-gray-700">Full Name</Label>
                <Input
                  id="editUserName"
                  value={editUserFormData.name}
                  onChange={(e) => setEditUserFormData({ ...editUserFormData, name: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserEmail" className="text-gray-700">Email</Label>
                <Input
                  id="editUserEmail"
                  type="email"
                  value={editUserFormData.email}
                  onChange={(e) => setEditUserFormData({ ...editUserFormData, email: e.target.value })}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserRole" className="text-gray-700">Role</Label>
                <Select value={editUserFormData.role} onValueChange={(value) => setEditUserFormData({ ...editUserFormData, role: value as User["role"] })}>
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
                <Label htmlFor="editUserStatus" className="text-gray-700">Status</Label>
                <Select value={editUserFormData.status} onValueChange={(value) => setEditUserFormData({ ...editUserFormData, status: value as User["status"] })}>
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
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" onClick={handleSaveEditedUser}>
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

export default AdminUsers;