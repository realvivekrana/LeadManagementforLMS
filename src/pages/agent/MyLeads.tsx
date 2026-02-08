import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  CalendarDays,
  Phone,
  Mail,
  Building2,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead } from "@/components/tables/LeadsTable";
import { mockLeads } from "@/data/mockData";
import { LeadDetailModal } from "@/components/agent/LeadDetailModal";
import { AddLeadModal } from "@/components/agent/AddLeadModal";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-700 border border-blue-200 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-950/20",
  contacted:
    "bg-purple-500/10 text-purple-700 border border-purple-200 dark:border-purple-800 dark:text-purple-400 dark:bg-purple-950/20",
  qualified:
    "bg-amber-500/10 text-amber-700 border border-amber-200 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950/20",
  proposal:
    "bg-indigo-500/10 text-indigo-700 border border-indigo-200 dark:border-indigo-800 dark:text-indigo-400 dark:bg-indigo-950/20",
  negotiation:
    "bg-orange-500/10 text-orange-700 border border-orange-200 dark:border-orange-800 dark:text-orange-400 dark:bg-orange-950/20",
  converted:
    "bg-green-500/10 text-green-700 border border-green-200 dark:border-green-800 dark:text-green-400 dark:bg-green-950/20",
  lost: "bg-red-500/10 text-red-700 border border-red-200 dark:border-red-800 dark:text-red-400 dark:bg-red-950/20",
};

const MyLeads = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentAgent] = useState("John Smith");

  // Get agent's leads
  const agentLeads = useMemo(() => {
    return mockLeads.filter((l) => l.assignedAgent === currentAgent);
  }, [currentAgent]);

  // Filter and search leads
  const filteredLeads = useMemo(() => {
    let leads = [...agentLeads];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(term) ||
          l.email.toLowerCase().includes(term) ||
          l.company.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      leads = leads.filter((l) => l.status === filterStatus);
    }

    // Source filter
    if (filterSource !== "all") {
      leads = leads.filter((l) => l.source === filterSource);
    }

    // Sorting
    if (sortBy === "date") {
      leads.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sortBy === "name") {
      leads.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "followup") {
      leads.sort((a, b) => {
        const aDate = a.nextFollowUp ? new Date(a.nextFollowUp).getTime() : 0;
        const bDate = b.nextFollowUp ? new Date(b.nextFollowUp).getTime() : 0;
        return aDate - bDate;
      });
    }

    return leads;
  }, [agentLeads, searchTerm, filterStatus, filterSource, sortBy]);

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleSaveLead = (lead: Lead, updates: any) => {
    console.log("Saving lead:", lead.id, updates);
    // In a real app, this would make an API call
  };

  const handleAddLead = (leadData: any) => {
    console.log("Adding new lead:", leadData);
    // In a real app, this would make an API call
  };

  const uniqueSources = Array.from(new Set(mockLeads.map((l) => l.source)));

  return (
    <DashboardLayout role="agent" title="My Leads">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Leads</h1>
            <p className="text-muted-foreground mt-1">
              Showing {filteredLeads.length} of {agentLeads.length} leads
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white w-full md:w-auto"
            onClick={() => setIsAddLeadModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="w-full">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
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

          <div className="w-full">
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {uniqueSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="followup">Sort by Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Active Filters Display */}
      {(searchTerm || filterStatus !== "all" || filterSource !== "all") && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-accent/20 border border-accent/40 rounded-lg flex flex-wrap items-center gap-2"
        >
          <Filter className="h-4 w-4 text-muted-foreground" />
          {searchTerm && (
            <Badge
              variant="outline"
              className="text-xs gap-1.5 cursor-pointer hover:bg-destructive/20 hover:text-destructive hover:border-destructive"
              onClick={() => setSearchTerm("")}
            >
              Search: {searchTerm}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filterStatus !== "all" && (
            <Badge
              variant="outline"
              className="text-xs gap-1.5 cursor-pointer hover:bg-destructive/20 hover:text-destructive hover:border-destructive"
              onClick={() => setFilterStatus("all")}
            >
              Status: {filterStatus}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {filterSource !== "all" && (
            <Badge
              variant="outline"
              className="text-xs gap-1.5 cursor-pointer hover:bg-destructive/20 hover:text-destructive hover:border-destructive"
              onClick={() => setFilterSource("all")}
            >
              Source: {filterSource}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </motion.div>
      )}

      {/* Leads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card shadow-sm"
      >
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg font-medium">
              No leads found
            </p>
            <p className="text-muted-foreground text-sm">
              Try adjusting your filters or{" "}
              <button
                onClick={() => setIsAddLeadModalOpen(true)}
                className="text-teal-600 hover:underline font-medium"
              >
                add a new lead
              </button>
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50 border-b">
                  <TableHead className="min-w-[100px] sm:min-w-[120px] px-3 sm:px-4 py-3">Lead Name</TableHead>
                  <TableHead className="min-w-[120px] sm:min-w-[150px] px-3 sm:px-4 py-3">Contact</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[120px] px-3 sm:px-4 py-3">Company</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[100px] px-3 sm:px-4 py-3">Source</TableHead>
                  <TableHead className="min-w-[90px] px-3 sm:px-4 py-3">Status</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[110px] px-3 sm:px-4 py-3">Follow-up</TableHead>
                  <TableHead className="text-right min-w-[70px] sm:min-w-[90px] px-3 sm:px-4 py-3">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 border-b border-border last:border-b-0 transition-colors"
                  >
                    <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-4">
                      <span className="truncate block">{lead.name}</span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-4">
                      <div className="space-y-0.5 sm:space-y-1">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground truncate text-xs">
                            {lead.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground truncate text-xs">
                            {lead.phone}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="truncate text-xs sm:text-sm">{lead.company}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell py-2 sm:py-3 px-3 sm:px-4">
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {lead.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 sm:py-3 px-3 sm:px-4">
                      <Badge className={`text-xs whitespace-nowrap ${statusColors[lead.status]}`}>
                        {lead.status.charAt(0).toUpperCase() +
                          lead.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs sm:text-sm py-2 sm:py-3 px-3 sm:px-4">
                      {lead.nextFollowUp ? (
                        <div className="flex items-center gap-1 sm:gap-2 text-xs">
                          <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">
                            {new Date(lead.nextFollowUp).toLocaleDateString()}
                          </span>
                          {new Date(lead.nextFollowUp).toDateString() ===
                            new Date().toDateString() && (
                            <Badge className="text-xs bg-yellow-500/20 text-yellow-700 border border-yellow-200 dark:border-yellow-800 dark:text-yellow-400 dark:bg-yellow-950/20 whitespace-nowrap">
                              Today
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-2 sm:py-3 px-3 sm:px-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLeadSelect(lead)}
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/20 font-medium text-xs px-2 h-7"
                      >
                        View
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSave={handleSaveLead}
      />

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSubmit={handleAddLead}
      />
    </DashboardLayout>
  );
};

export default MyLeads;