import {
  Download,
  Filter,
  MoreVertical,
  Search,
  UserCheck,
  Wrench,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HOSTEL_BLOCKS } from '../../data/mockData';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../../types';
import { CategoryIcon } from '../Common/CategoryIcon';
import { PriorityIndicator } from '../Common/PriorityIndicator';
import { StatusBadge } from '../Common/StatusBadge';

interface WardenQueueTableProps {
  onSelectComplaint: (id: string) => void;
  onOpenAssignModal: (complaint: Complaint) => void;
}

export const WardenQueueTable: React.FC<WardenQueueTableProps> = ({
  onSelectComplaint,
  onOpenAssignModal,
}) => {
  const { complaints, updateComplaintStatus } = useApp();

  const [search, setSearch] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (selectedBlock !== 'all' && c.block !== selectedBlock) return false;
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && c.priority !== selectedPriority) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchId = c.id.toLowerCase().includes(query);
        const matchTitle = c.title.toLowerCase().includes(query);
        const matchRoom = c.roomNumber.toLowerCase().includes(query);
        const matchStudent = c.studentName.toLowerCase().includes(query);
        const matchRoll = c.studentId.toLowerCase().includes(query);
        if (!matchId && !matchTitle && !matchRoom && !matchStudent && !matchRoll) {
          return false;
        }
      }

      return true;
    });
  }, [complaints, selectedBlock, selectedCategory, selectedStatus, selectedPriority, search]);

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Title', 'Category', 'Priority', 'Status', 'Block', 'Room', 'Student', 'Student ID', 'Created At'];
    const rows = filteredComplaints.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.category,
      c.priority,
      c.status,
      c.block,
      c.roomNumber,
      `"${c.studentName}"`,
      c.studentId,
      c.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hostel_complaints_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Hostel Grievance Dispatch Queue
            </h3>
            <span className="text-xs font-mono font-medium text-slate-500 tabular-nums">
              ({filteredComplaints.length} tickets)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {/* Search */}
          <div className="col-span-2 sm:col-span-1 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search room / roll / ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Block */}
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Blocks</option>
            {HOSTEL_BLOCKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="wifi">Wi-Fi / LAN</option>
            <option value="carpentry">Carpentry</option>
            <option value="housekeeping">Sanitation</option>
            <option value="mess">Mess & Food</option>
            <option value="appliances">Appliances</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Pending Review</option>
            <option value="under_review">Under Review</option>
            <option value="assigned">Dispatched</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Priorities</option>
            <option value="emergency">Emergency</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-2.5 px-4">Ticket</th>
              <th className="py-2.5 px-3">Location & Student</th>
              <th className="py-2.5 px-4">Issue Description</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Assigned Staff</th>
              <th className="py-2.5 px-3">Logged Date</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                  No grievances found matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectComplaint(ticket.id)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  {/* Ticket ID & Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-900">{ticket.id}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 capitalize mt-0.5">
                      <CategoryIcon category={ticket.category} className="w-3 h-3 text-slate-400" />
                      <span>{ticket.category}</span>
                    </div>
                  </td>

                  {/* Location & Student */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{ticket.roomNumber}</div>
                    <div className="text-[11px] text-slate-500">{ticket.block.split('-')[0]}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{ticket.studentName}</div>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 truncate">{ticket.title}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{ticket.description}</p>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <PriorityIndicator priority={ticket.priority} />
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={ticket.status} />
                  </td>

                  {/* Staff Assigned */}
                  <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                    {ticket.assignedTechnician ? (
                      <div>
                        <div className="font-semibold text-slate-900 text-xs">
                          {ticket.assignedTechnician.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {ticket.assignedTechnician.phone}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAssignModal(ticket);
                        }}
                        className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:underline flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Assign Staff</span>
                      </button>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                    {formatDate(ticket.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {!ticket.assignedTechnician && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                        <button
                          onClick={() => onOpenAssignModal(ticket)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                          title="Assign Technician"
                        >
                          Dispatch
                        </button>
                      )}
                      <button
                        onClick={() => onSelectComplaint(ticket.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-900 border border-slate-200 hover:bg-slate-100 rounded transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
