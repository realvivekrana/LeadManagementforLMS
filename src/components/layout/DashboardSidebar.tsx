import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  UserPlus,
  ClipboardList,
  Target,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface DashboardSidebarProps {
  role: "admin" | "manager" | "agent";
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const adminItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ClipboardList, label: "Leads", path: "/admin/leads" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: User, label: "Profile", path: "/admin/profile" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const managerItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/manager" },
  { icon: Target, label: "Lead Assignment", path: "/manager/assign" },
  { icon: Users, label: "Team Performance", path: "/manager/team" },
  { icon: FileText, label: "Reports", path: "/manager/reports" },
  { icon: User, label: "Profile", path: "/manager/profile" },
  { icon: Settings, label: "Settings", path: "/manager/settings" },
];

const agentItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/agent" },
  { icon: ClipboardList, label: "My Leads", path: "/agent/leads" },
  { icon: UserPlus, label: "Add Lead", path: "/agent/add-lead" },
  { icon: User, label: "Profile", path: "/agent/profile" },
  { icon: Settings, label: "Settings", path: "/agent/settings" },
];

const roleItems = {
  admin: adminItems,
  manager: managerItems,
  agent: agentItems,
};

export function DashboardSidebar({ role, isOpen, setIsOpen }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const items = roleItems[role];

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sidebarClassNames = cn(
    "fixed left-0 top-0 z-40 h-screen gradient-teal transition-all duration-300 flex flex-col",
    isMobile
      ? cn(
          "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )
      : cn(
          collapsed ? "w-20" : "w-64"
        )
  );

  return (
    <motion.aside
      id="dashboard-sidebar"
      initial={{ x: isMobile ? -264 : -20, opacity: 0 }}
      animate={{ 
        x: isMobile 
          ? (isOpen ? 0 : -264)
          : 0, 
        opacity: 1 
      }}
      transition={{ duration: 0.3 }}
      className={sidebarClassNames}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <img src="/Athenura logo.png" alt="Athenura" className="h-10 w-auto" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center gap-2">
          {/* Mobile logout button */}
          {isMobile && (
            <NavLink
              to="/"
              onClick={handleNavClick}
              className="flex items-center justify-center h-8 w-8 rounded-lg text-sidebar-foreground/80 hover:bg-destructive/20 hover:text-destructive-foreground transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </NavLink>
          )}
          
          {/* Desktop collapse button */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
          
          {/* Mobile close button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {items.map((item, index) => {
          const isActive = location.pathname === item.path;
          const showLabel = !collapsed || isMobile;
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavLink
                to={item.path}
                onClick={handleNavClick}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 backdrop-blur-sm",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/25 border border-primary/20"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/90 hover:text-sidebar-foreground hover:shadow-md hover:border-sidebar-accent/30 border border-transparent"
                )}
              >
                <motion.div
                  whileHover={{ rotate: isActive ? 0 : 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", !showLabel && "mx-auto")} />
                </motion.div>
                <AnimatePresence mode="wait">
                  {showLabel && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sidebar-primary-foreground"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Role Badge & Logout */}
      <motion.div 
        className="p-3 border-t border-sidebar-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <motion.div 
          className={cn(
            "mb-3 rounded-xl bg-gradient-to-r from-sidebar-accent/30 to-sidebar-accent/50 px-4 py-3 backdrop-blur-sm border border-sidebar-accent/20",
            (!collapsed || isMobile) ? "" : "text-center"
          )}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {(!collapsed || isMobile) && !isMobile && (
            <motion.p 
              className="text-xs text-sidebar-muted mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Logged in as
            </motion.p>
          )}
          <motion.p 
            className="text-sm font-semibold text-sidebar-foreground capitalize flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-green-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {(!collapsed || isMobile) ? role : role[0].toUpperCase()}
          </motion.p>
        </motion.div>
        
        {/* Desktop logout */}
        {!isMobile && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <NavLink
              to="/"
              onClick={handleNavClick}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                "text-sidebar-foreground/80 hover:bg-destructive/20 hover:text-destructive-foreground hover:shadow-md backdrop-blur-sm border border-transparent hover:border-destructive/20"
              )}
            >
              <motion.div
                whileHover={{ rotate: -6 }}
                transition={{ duration: 0.2 }}
              >
                <LogOut className={cn("h-5 w-5 shrink-0", (!collapsed || isMobile) ? "" : "mx-auto")} />
              </motion.div>
              {(!collapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Logout
                </motion.span>
              )}
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-destructive/5 to-destructive/10 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </NavLink>
          </motion.div>
        )}
      </motion.div>
    </motion.aside>
  );
}
