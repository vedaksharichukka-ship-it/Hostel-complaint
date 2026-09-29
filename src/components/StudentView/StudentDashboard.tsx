import {
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  PhoneCall,
  Plus,
  Search,
  Sparkles,
  Wrench,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, ComplaintStatus } from '../../types';
import { CategoryIcon } from '../Common/CategoryIcon';
import { PriorityIndicator } from '../Common/PriorityIndicator';
import { StatusBadge } from '../Common/StatusBadge';

interface StudentDashboardProps {
  onOpenNewComplaint: () => void;
  onSelectComplaint: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenNewComplaint,
  onSelectComplaint,
  onNavigateTab,
}) => {
  const { complaints, activeStudent, announcements } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints for student (e.g. resident complaints or all room complaints)
  const studentComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Filter by status tab
      if (statusFilter === 'active') {
        if (c.status === 'resolved' || c.status === 'closed') return false;
      } else if (statusFilter === 'resolved') {
        if (c.status !== 'resolved' && c.status !== 'closed') return false;
      }

      // Filter by category
      if (categoryFilter !== 'all' && c.category !== categoryFilter) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = c.id.toLowerCase().includes(query);
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesDesc = c.description.toLowerCase().includes(query);
        const matchesRoom = c.roomNumber.toLowerCase().includes(query);
        if (!matchesId && !matchesTitle && !matchesDesc && !matchesRoom) {
          return false;
        }
      }

      return true;
    });
  }, [complaints, statusFilter, categoryFilter, searchQuery]);

  // Metrics
  const activeCount = complaints.filter(
    (c) => c.status !== 'resolved' && c.status !== 'closed'
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'resolved' || c.status === 'closed'
  ).length;

  const urgentAnnouncements = announcements.filter((a) => a.active);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Profile & Quick Action Banner */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="relative h-32 sm:h-40 bg-slate-800">
          <img
            src="/src/assets/images/hostel_campus_hero_1790649975201.jpg"
            alt="Hostel Campus"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/src/assets/images/avatar_student_user_1790649987769.jpg"
                alt="Student Avatar"
                className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="text-white">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  {activeStudent.name}
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <span className="font-mono">{activeStudent.studentId}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeStudent.block}</span>
                  <span aria-hidden="true">·</span>
                  <span>Room {activeStudent.roomNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigateTab('directory')}
                className="px-3 py-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hostel Hotlines</span>
              </button>
              <button
                onClick={onOpenNewComplaint}
                className="px-4 py-1.5 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Log New Grievance</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stat Bar */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50 text-center py-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium block">
              Total Grievances
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">
              {complaints.length}
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-700 font-medium block">
              Active / In Progress
            </span>
            <span className="text-lg font-bold font-mono text-amber-600 tabular-nums">
              {activeCount}
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-medium block">
              Resolved & Closed
            </span>
            <span className="text-lg font-bold font-mono text-emerald-600 tabular-nums">
              {resolvedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Urgent Announcements Strip if any */}
      {urgentAnnouncements.length > 0 && (
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-amber-900">
                Notice: {urgentAnnouncements[0].title}
              </span>
              <span className="text-[10px] text-amber-700 font-mono">
                {urgentAnnouncements[0].date}
              </span>
            </div>
            <p className="text-amber-800 leading-relaxed line-clamp-1">
              {urgentAnnouncements[0].message}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('notices')}
            className="text-xs font-semibold text-amber-900 hover:underline shrink-0"
          >
            View All ({announcements.length})
          </button>
        </div>
      )}

      {/* Main Complaints List Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Controls Toolbar: Segmented status tabs + category select + search */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Tickets ({complaints.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'resolved'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Categories</option>
              <option value="electrical">Electrical</option>
              <option value="plumbing">Plumbing</option>
              <option value="wifi">Wi-Fi & LAN</option>
              <option value="carpentry">Carpentry</option>
              <option value="housekeeping">Sanitation</option>
              <option value="mess">Mess & Food</option>
              <option value="appliances">Appliances</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket # or issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-44 sm:w-56 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Complaints List Cards */}
        <div className="divide-y divide-slate-100">
          {studentComplaints.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No Grievances Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'No tickets match the selected filters. Try clearing your search.'
                  : 'You have no active complaints reported. All facilities in your room are operating normally.'}
              </p>
              <button
                onClick={onOpenNewComplaint}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Log a Complaint</span>
              </button>
            </div>
          ) : (
            studentComplaints.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onSelectComplaint(ticket.id)}
                className="p-4 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-semibold text-slate-900">{ticket.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize flex items-center gap-1">
                      <CategoryIcon category={ticket.category} className="w-3.5 h-3.5 text-slate-500" />
                      <span>{ticket.category}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Room {ticket.roomNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{formatDate(ticket.createdAt)}</span>
                  </div>

                  {/* Title & Preview */}
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {ticket.description}
                  </p>

                  {/* Assigned Technician Info if available */}
                  {ticket.assignedTechnician && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <Wrench className="w-3 h-3 text-slate-400" />
                      <span>Assigned to {ticket.assignedTechnician.name}</span>
                    </div>
                  )}
                </div>

                {/* Right side: Status, Priority and Action */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <PriorityIndicator priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectComplaint(ticket.id);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
