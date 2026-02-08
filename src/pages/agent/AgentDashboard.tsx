import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Calendar,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryCard } from "@/components/ui/summary-card";
import { ActivityTimeline } from "@/components/agent/ActivityTimeline";
import { LeadDetailModal } from "@/components/agent/LeadDetailModal";
import { AddLeadModal } from "@/components/agent/AddLeadModal";
import { mockLeads, mockActivities } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/components/tables/LeadsTable";

const statusColors: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  contacted: "bg-accent text-accent-foreground",
  qualified: "bg-warning text-warning-foreground",
  proposal: "bg-primary/80 text-primary-foreground",
  negotiation: "bg-warning/80 text-warning-foreground",
  converted: "bg-success text-success-foreground",
  lost: "bg-destructive text-destructive-foreground",
};

const AgentDashboard = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [currentAgent] = useState("John Smith");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  let myLeads = mockLeads.filter((l) => l.assignedAgent === currentAgent);
  if (filterStatus) {
    myLeads = myLeads.filter((l) => l.status === filterStatus);
  }
  const followUpsToday = myLeads.filter(
    (l) => l.nextFollowUp && new Date(l.nextFollowUp).toDateString() === new Date().toDateString()
  ).length;
  const convertedLeads = myLeads.filter((l) => l.status === "converted").length;
  const lostLeads = myLeads.filter((l) => l.status === "lost").length;

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleSaveLead = (lead: Lead, updates: any) => {
    console.log("Saving lead:", {
      leadId: lead.id,
      ...updates,
    });
    setSelectedLead(null);
  };

  const handleAddLead = (leadData: any) => {
    console.log("Adding new lead:", leadData);
  };

  return (
    <DashboardLayout role="agent" title="My Dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <SummaryCard
          title="My Leads"
          value={myLeads.length}
          icon={ClipboardList}
          delay={0}
        />
        <SummaryCard
          title="Follow-ups Today"
          value={followUpsToday}
          icon={Calendar}
          variant="warning"
          delay={0.1}
        />
        <SummaryCard
          title="Converted Leads"
          value={convertedLeads}
          icon={TrendingUp}
          variant="success"
          delay={0.2}
        />
        <SummaryCard
          title="Lost Leads"
          value={lostLeads}
          icon={TrendingDown}
          variant="destructive"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* My Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 rounded-xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <div className="p-4 md:p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">My Leads</h2>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Filter
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => setFilterStatus(null)}
                      className={filterStatus === null ? "bg-accent" : ""}
                    >
                      All Leads
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filterStatus === "new"}
                      onCheckedChange={(checked) => setFilterStatus(checked ? "new" : null)}
                    >
                      New
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterStatus === "contacted"}
                      onCheckedChange={(checked) => setFilterStatus(checked ? "contacted" : null)}
                    >
                      Contacted
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterStatus === "qualified"}
                      onCheckedChange={(checked) => setFilterStatus(checked ? "qualified" : null)}
                    >
                      Qualified
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterStatus === "proposal"}
                      onCheckedChange={(checked) => setFilterStatus(checked ? "proposal" : null)}
                    >
                      Proposal
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterStatus === "negotiation"}
                      onCheckedChange={(checked) => setFilterStatus(checked ? "negotiation" : null)}
                    >
                      Negotiation
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterStatus === "converted"}
                      onCheckedChange={(checked) => setFilterStatus(checked ? "converted" : null)}
                    >
                      Converted
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterStatus === "lost"}
                      onCheckedChange={(checked) => setFilterStatus(checked ? "lost" : null)}
                    >
                      Lost
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  size="sm" 
                  className="bg-cyan-600 hover:bg-cyan-700 text-white" 
                  onClick={() => {
                    setIsAddLeadModalOpen(true);
                  }}
                >
                  Add Lead
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="min-w-[100px] sm:min-w-[120px]">Lead Name</TableHead>
                    <TableHead className="min-w-[140px] sm:min-w-[180px]">Contact</TableHead>
                    <TableHead className="min-w-[70px]">Status</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[110px]">Follow-up</TableHead>
                    <TableHead className="text-right min-w-[110px] sm:min-w-[140px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myLeads.slice(0, 6).map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-3">
                        <span className="truncate block">{lead.name}</span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-2 sm:py-3">
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-muted-foreground truncate text-xs">{lead.email}</p>
                          <p className="text-muted-foreground truncate text-xs">{lead.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 sm:py-3">
                        <Badge className={`${statusColors[lead.status]} text-xs whitespace-nowrap`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs sm:text-sm py-2 sm:py-3">
                        {lead.nextFollowUp ? (
                          <div className="flex items-center gap-1 text-xs">
                            <CalendarDays className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className={`truncate ${
                              new Date(lead.nextFollowUp).toDateString() === new Date().toDateString()
                                ? "text-warning font-medium"
                                : ""
                            }`}>
                              {lead.nextFollowUp}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-2 sm:py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              handleLeadSelect(lead);
                            }}
                            className="shrink-0 text-xs px-2 py-1 h-7"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white shrink-0 text-xs px-2 py-1 h-7"
                            onClick={() => {
                              handleLeadSelect(lead);
                            }}
                          >
                            Update
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

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <ActivityTimeline activities={mockActivities} maxItems={6} />
        </motion.div>
      </div>

      {/* Lead Detail Modal */}
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

export default AgentDashboard;