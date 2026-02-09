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

interface ManagerSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const managerItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/manager" },
  { icon: Target, label: "Lead Assignment", path: "/manager/leads" },
  { icon: Users, label: "Team Performance", path: "/manager/team" },
  { icon: FileText, label: "Reports", path: "/manager/reports" },
  { icon: User, label: "Profile", path: "/manager/profile" },
  { icon: Settings, label: "Settings", path: "/manager/settings" },
];

export function ManagerSidebar({ isOpen, setIsOpen }: ManagerSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

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
      id="manager-sidebar"
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
      <nav className="flex-1 px-3 py-4 space-y-1">
        {managerItems.map((item) => {
          const isActive = location.pathname === item.path;
          const showLabel = !collapsed || isMobile;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", !showLabel && "mx-auto")} />
              <AnimatePresence mode="wait">
                {showLabel && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* Role Badge & Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "mb-2 rounded-lg bg-sidebar-accent/50 px-3 py-2",
          (!collapsed || isMobile) ? "" : "text-center"
        )}>
          {(!collapsed || isMobile) && !isMobile && (
            <p className="text-xs text-sidebar-muted">Logged in as</p>
          )}
          <p className="text-sm font-medium text-sidebar-foreground capitalize">
            {(!collapsed || isMobile) ? "Manager" : "M"}
          </p>
        </div>
        {/* Desktop logout */}
        {!isMobile && (
          <NavLink
            to="/"
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              "text-sidebar-foreground/80 hover:bg-destructive/20 hover:text-destructive-foreground"
            )}
          >
            <LogOut className={cn("h-5 w-5 shrink-0", (!collapsed || isMobile) ? "" : "mx-auto")} />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </NavLink>
        )}
      </div>
    </motion.aside>
  );
}
