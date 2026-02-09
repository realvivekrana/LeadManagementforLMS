import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Shield, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roleIcons = {
  admin: Shield,
  manager: Users,
  agent: BarChart3,
};

const roleRoutes = {
  admin: "/admin",
  manager: "/manager",
  agent: "/agent",
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "agent">("admin");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ["admin", "manager", "agent"].includes(roleParam)) {
      setRole(roleParam as "admin" | "manager" | "agent");
    }
  }, [searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      navigate(roleRoutes[role]);
    }, 800);
  };

  const RoleIcon = roleIcons[role];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-white"
      >
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/Athenura logo.png" alt="Athenura" className="h-12 w-auto" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">
              Sign in to access your dashboard and manage leads
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-teal-600 focus:ring-teal-600"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">Login as</Label>
              <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                <SelectTrigger className="w-full border-gray-300 focus:border-teal-600 focus:ring-teal-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-teal-600" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-600" />
                      Manager
                    </div>
                  </SelectItem>
                  <SelectItem value="agent">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-teal-600" />
                      Agent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <RoleIcon className="mr-2 h-5 w-5" />
                  Sign in as {role.charAt(0).toUpperCase() + role.slice(1)}
                </>
              )}
            </Button>
          </form>

          {/* Quick Access */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">
              Quick access (demo mode)
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRole("admin");
                  navigate("/admin");
                }}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRole("manager");
                  navigate("/manager");
                }}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Manager
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRole("agent");
                  navigate("/agent");
                }}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Agent
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Decorative */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:flex flex-1 bg-teal-600 items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="h-24 w-24 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center mx-auto mb-8"
          >
            <RoleIcon className="h-12 w-12 text-white" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-4"
          >
            {role === "admin" && "System Control Center"}
            {role === "manager" && "Team Management Hub"}
            {role === "agent" && "Sales Dashboard"}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/80"
          >
            {role === "admin" && "Full access to all system features, user management, and analytics."}
            {role === "manager" && "Manage your team, assign leads, and track performance."}
            {role === "agent" && "View your leads, track follow-ups, and close more deals."}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
