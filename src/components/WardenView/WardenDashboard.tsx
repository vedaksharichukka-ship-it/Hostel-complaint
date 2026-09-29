import {
  AlertCircle,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  RefreshCw,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_INFO, HOSTEL_BLOCKS } from '../../data/mockData';
import { Complaint } from '../../types';
import { AssignTechModal } from './AssignTechModal';
import { PostNoticeModal } from './PostNoticeModal';
import { WardenQueueTable } from './WardenQueueTable';

interface WardenDashboardProps {
  onSelectComplaint: (id: string) => void;
  onOpenPostNotice: () => void;
}

export const WardenDashboard: React.FC<WardenDashboardProps> = ({
  onSelectComplaint,
  onOpenPostNotice,
}) => {
  const { complaints, technicians, resetDemoData } = useApp();

  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<Complaint | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Computations
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'submitted' || c.status === 'under_review').length;
  const inProgressCount = complaints.filter((c) => c.status === 'assigned' || c.status === 'in_progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;
  const emergencyCount = complaints.filter(
    (c) => c.priority === 'emergency' && c.status !== 'closed' && c.status !== 'resolved'
  ).length;

  const handleOpenAssign = (ticket: Complaint) => {
    setSelectedTicketForAssign(ticket);
    setIsAssignModalOpen(true);
  };

  // Block breakdown counts
  const blockCounts = HOSTEL_BLOCKS.map((block) => {
    const total = complaints.filter((c) => c.block === block).length;
    const active = complaints.filter(
      (c) => c.block === block && c.status !== 'closed' && c.status !== 'resolved'
    ).length;
    return { block, total, active };
  });

  return (
    <div className="space-y-6">
      {/* Warden Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="/src/assets/images/avatar_warden_admin_1790650007356.jpg"
            alt="Warden Avatar"
            className="w-14 h-14 rounded-full border-2 border-slate-200 object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Dr. K. Ramanathan
              </h1>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Chief Hostel Warden
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hostel Facility Management & Student Grievance Command Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetDemoData}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Reset to default mock dataset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
          <button
            onClick={onOpenPostNotice}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Broadcast Circular</span>
          </button>
        </div>
      </div>

      {/* Emergency Alert Callout if any */}
      {emergencyCount > 0 && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-rose-900">
                {emergencyCount} Emergency Grievance Requiring Immediate Intervention
              </h3>
              <p className="text-xs text-rose-700">
                Urgent plumbing or electrical hazards logged in student wings.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-rose-800">
            Immediate Action
          </span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Total Grievances
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {totalCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across 4 residential blocks
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
            Pending Dispatch
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Awaiting technician assignment
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
            Active / Dispatched
          </div>
          <div className="text-2xl font-bold font-mono text-sky-600 tabular-nums">
            {inProgressCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Staff on-site repairing
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1">
            Resolved Today
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {resolvedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Student verified repairs
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            SLA Compliance
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-600 tabular-nums">
            94.8%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg resolution: 3.4 hrs
          </div>
        </div>
      </div>

      {/* Block Load Overview & On-Duty Staff Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Block Workload */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-500" />
            <span>Residential Block Grievance Distribution</span>
          </h3>
          <div className="space-y-3 pt-1">
            {blockCounts.map(({ block, total, active }) => {
              const percentage = totalCount > 0 ? (total / totalCount) * 100 : 0;
              return (
                <div key={block} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{block}</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {active} active / {total} total
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        active > 2 ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${Math.max(percentage, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* On Duty Maintenance Staff */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-500" />
            <span>On-Duty Maintenance Technicians ({technicians.length})</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5 truncate">
                  <div className="font-semibold text-slate-900 truncate">{tech.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{tech.specialty.split('&')[0]}</div>
                  <div className="text-[10px] font-mono text-slate-400">{tech.phone}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-800 block">
                    {tech.activeJobsCount}
                  </span>
                  <span className="text-[10px] text-slate-400">jobs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warden Grievance Dispatch Queue Table */}
      <WardenQueueTable
        onSelectComplaint={onSelectComplaint}
        onOpenAssignModal={handleOpenAssign}
      />

      {/* Assign Technician Modal */}
      <AssignTechModal
        complaint={selectedTicketForAssign}
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedTicketForAssign(null);
        }}
      />
    </div>
  );
};
