import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, Mail, Phone, MoreVertical, Award, TrendingUp, Clock } from "lucide-react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { SummaryCard } from "@/components/ui/summary-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockAgents } from "@/data/mockData";

const ManagerTeam = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const totalAgents = mockAgents.length;
  const activeAgents = mockAgents.filter((a) => a.pending > 0).length;
  const avgConversionRate = Math.round(mockAgents.reduce((acc, agent) => acc + (agent.converted / agent.leadsAssigned) * 100, 0) / mockAgents.length);
  const topPerformer = mockAgents.reduce((prev, current) => (current.converted / current.leadsAssigned) > (prev.converted / prev.leadsAssigned) ? current : prev);

  return (
    <ManagerLayout title="Team Performance">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <SummaryCard title="Total Agents" value={totalAgents} icon={Users} variant="primary" delay={0} />
        <SummaryCard title="Active Agents" value={activeAgents} icon={TrendingUp} variant="success" delay={0.1} />
        <SummaryCard title="Avg Conversion Rate" value={`${avgConversionRate}%`} icon={Award} trend={{ value: 8, isPositive: true }} delay={0.2} />
        <SummaryCard title="Top Performer" value={topPerformer.name.split(" ")[0]} icon={Award} variant="primary" delay={0.3} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {mockAgents.map((agent, index) => {
          const conversionRate = Math.round((agent.converted / agent.leadsAssigned) * 100);
          const initials = agent.name.split(" ").map(n => n[0]).join("");
          return (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 gradient-teal"><AvatarFallback className="text-primary-foreground font-semibold">{initials}</AvatarFallback></Avatar>
                    <div><h3 className="font-semibold text-foreground">{agent.name}</h3><p className="text-sm text-muted-foreground">Sales Agent</p></div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedAgent(agent.id)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuItem>Assign Leads</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" /><span>{agent.name.toLowerCase().replace(" ", ".")}@athenura.com</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /><span>+1 (555) {Math.floor(Math.random() * 900) + 100}-{Math.floor(Math.random() * 9000) + 1000}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-2xl font-bold text-foreground">{agent.leadsAssigned}</p><p className="text-xs text-muted-foreground">Assigned</p></div>
                    <div><p className="text-2xl font-bold text-success">{agent.converted}</p><p className="text-xs text-muted-foreground">Converted</p></div>
                    <div><p className="text-2xl font-bold text-warning">{agent.pending}</p><p className="text-xs text-muted-foreground">Pending</p></div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2"><span className="text-sm text-muted-foreground">Conversion Rate</span><span className="text-sm font-semibold">{conversionRate}%</span></div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${conversionRate}%` }} /></div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Detailed Performance</h2>
          <Button className="gradient-teal text-primary-foreground"><UserPlus className="h-4 w-4 mr-2" />Add Agent</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[180px]">Agent</TableHead>
                <TableHead className="text-center min-w-[100px]">Assigned</TableHead>
                <TableHead className="text-center min-w-[100px]">Converted</TableHead>
                <TableHead className="text-center min-w-[100px]">Pending</TableHead>
                <TableHead className="text-center min-w-[120px]">Conv. Rate</TableHead>
                <TableHead className="text-center min-w-[120px]">Avg Response</TableHead>
                <TableHead className="text-center min-w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAgents.map((agent, index) => {
                const conversionRate = Math.round((agent.converted / agent.leadsAssigned) * 100);
                const avgResponse = `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} hrs`;
                const isActive = agent.pending > 0;
                return (
                  <motion.tr key={agent.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-card-hover">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 gradient-teal"><AvatarFallback className="text-primary-foreground text-xs font-semibold">{agent.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{agent.leadsAssigned}</TableCell>
                    <TableCell className="text-center text-success font-medium">{agent.converted}</TableCell>
                    <TableCell className="text-center text-warning font-medium">{agent.pending}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${conversionRate}%` }} /></div>
                        <span className="text-sm font-medium">{conversionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" /><span className="text-sm">{avgResponse}</span></div>
                    </TableCell>
                    <TableCell className="text-center"><Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Idle"}</Badge></TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </ManagerLayout>
  );
};

export default ManagerTeam;