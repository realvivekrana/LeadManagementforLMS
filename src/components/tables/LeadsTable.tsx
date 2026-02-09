import { motion } from "framer-motion";
import { Eye, Edit2, Mail, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "converted" | "lost";
  assignedAgent: string;
  date: string;
  nextFollowUp?: string;
}

interface LeadsTableProps {
  leads: Lead[];
  showAgent?: boolean;
  showActions?: boolean;
  onView?: (lead: Lead) => void;
  onUpdate?: (lead: Lead) => void;
}

const statusColors: Record<Lead["status"], string> = {
  new: "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
  contacted: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  qualified: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
  proposal: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
  negotiation: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
  converted: "bg-gradient-to-r from-green-500 to-green-600 text-white",
  lost: "bg-gradient-to-r from-red-500 to-red-600 text-white",
};

export function LeadsTable({
  leads,
  showAgent = true,
  showActions = true,
  onView,
  onUpdate,
}: LeadsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      {/* Enhanced Mobile View - Premium Cards */}
      <div className="md:hidden space-y-4 p-4">
        {leads.map((lead, index) => (
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
                  <p className="text-sm text-gray-600">{lead.company || 'Lead'}</p>
                </div>
              </div>
              
              {showActions && (
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 shadow-sm"
                    onClick={() => onView?.(lead)}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  {onUpdate && (
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200 shadow-sm"
                      onClick={() => onUpdate(lead)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </motion.button>
                  )}
                </div>
              )}
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
              
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <p className="text-xs text-gray-500 mb-1">Source</p>
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 font-semibold shadow-sm">
                    {lead.source}
                  </Badge>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <Badge className={`${statusColors[lead.status]} px-3 py-1 font-semibold shadow-sm`}>
                    ● {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </motion.div>
              </div>
              
              {showAgent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm bg-gray-100/80 rounded-lg p-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {lead.assignedAgent.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium text-gray-900">{lead.assignedAgent}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Desktop View - Premium Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="relative">
          {/* Premium gradient header */}
          <div className="bg-gradient-to-r from-teal-600 via-emerald-700 to-cyan-600 rounded-t-xl p-4">
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white font-bold text-lg flex items-center gap-2"
            >
              <Eye className="h-5 w-5" />
              Lead Directory
            </motion.h3>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
                <TableHead className="font-bold min-w-[200px] text-gray-800 py-4">Lead Profile</TableHead>
                <TableHead className="font-bold min-w-[120px] text-gray-800">Source</TableHead>
                <TableHead className="font-bold min-w-[120px] text-gray-800 text-center">Status</TableHead>
                {showAgent && <TableHead className="font-bold min-w-[180px] text-gray-800">Assigned Agent</TableHead>}
                <TableHead className="font-bold min-w-[100px] text-gray-800">Date</TableHead>
                {showActions && <TableHead className="font-bold text-center min-w-[120px] text-gray-800">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead, index) => (
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
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span>{lead.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
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
                      <Badge className={`${statusColors[lead.status]} px-3 py-1 font-semibold shadow-sm`}>
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
                  {showAgent && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {lead.assignedAgent.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-gray-700 font-medium">{lead.assignedAgent}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <span className="text-gray-600 font-medium">{lead.date}</span>
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={() => onView?.(lead)}
                        >
                          <Eye className="h-4 w-4" />
                        </motion.button>
                        {onUpdate && (
                          <motion.button
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            onClick={() => onUpdate(lead)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </motion.button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}
