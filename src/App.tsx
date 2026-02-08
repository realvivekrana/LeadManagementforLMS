import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerTeam from "./pages/manager/ManagerTeam";
import ManagerReports from "./pages/manager/ManagerReports";
import ManagerLeads from "./pages/manager/ManagerLeads";
import ManagerSettings from "./pages/manager/ManagerSettings";
import AgentDashboard from "./pages/agent/AgentDashboard";
import MyLeads from "./pages/agent/MyLeads";
import AddLeadPage from "./pages/agent/AddLeadPage";
import Settings from "./pages/agent/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/leads" element={<ManagerLeads />} />
          <Route path="/manager/team" element={<ManagerTeam />} />
          <Route path="/manager/reports" element={<ManagerReports />} />
          <Route path="/manager/settings" element={<ManagerSettings />} />
          
          {/* Agent Routes */}
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/agent/leads" element={<MyLeads />} />
          <Route path="/agent/add-lead" element={<AddLeadPage />} />
          <Route path="/agent/settings" element={<Settings />} />
          <Route path="/agent/*" element={<AgentDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
