import {
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  PhoneCall,
  Play,
  Wrench,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint } from '../../types';
import { CategoryIcon } from '../Common/CategoryIcon';
import { PriorityIndicator } from '../Common/PriorityIndicator';
import { StatusBadge } from '../Common/StatusBadge';

interface TechnicianDashboardProps {
  onSelectComplaint: (id: string) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  onSelectComplaint,
}) => {
  const { complaints, activeTechnician, updateComplaintStatus, resolveWorkOrder } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [resolvingTicket, setResolvingTicket] = useState<Complaint | null>(null);
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [partsUsed, setPartsUsed] = useState('');

  // Filter complaints assigned to this technician or matching specialty
  const myAssignedJobs = complaints.filter(
    (c) =>
      c.assignedTechnician?.name === activeTechnician.name ||
      (c.category === activeTechnician.category && (c.status === 'assigned' || c.status === 'in_progress'))
  );

  const pendingJobs = myAssignedJobs.filter((c) => c.status === 'assigned');
  const inProgressJobs = myAssignedJobs.filter((c) => c.status === 'in_progress');
  const completedJobs = myAssignedJobs.filter((c) => c.status === 'resolved' || c.status === 'closed');

  const displayedJobs =
    activeTab === 'pending'
      ? pendingJobs
      : activeTab === 'in_progress'
      ? inProgressJobs
      : completedJobs;

  const handleStartWork = (ticketId: string) => {
    updateComplaintStatus(ticketId, 'in_progress', 'Technician arrived at room site and began inspection.');
  };

  const handleOpenResolveModal = (ticket: Complaint) => {
    setResolvingTicket(ticket);
    setResolutionRemarks('');
    setPartsUsed('');
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicket || !resolutionRemarks.trim()) return;

    resolveWorkOrder(resolvingTicket.id, resolutionRemarks.trim(), partsUsed.trim() || undefined);
    setResolvingTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Staff Profile Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            <Wrench className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {activeTechnician.name}
              </h1>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                On Duty
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTechnician.specialty} · Phone: {activeTechnician.phone}
            </p>
          </div>
        </div>

        {/* Tab Counters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Dispatch ({pendingJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'in_progress' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress ({inProgressJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedJobs.length})
          </button>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Assigned Work Orders ({displayedJobs.length})
          </h2>
          <span className="text-xs text-slate-500">
            Please log parts used for college inventory accounting.
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {displayedJobs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No tasks currently in this queue. Great job!
            </div>
          ) : (
            displayedJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-bold text-slate-900">{job.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-800">{job.block}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-900 font-semibold">Room {job.roomNumber} ({job.bedNo || 'Standard'})</span>
                    <span aria-hidden="true">·</span>
                    <PriorityIndicator priority={job.priority} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Preferred Slot: <strong className="text-slate-800">{job.preferredSlot}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Resident: {job.studentName} ({job.studentPhone})</span>
                    </div>
                  </div>
                </div>

                {/* Technician Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`tel:${job.studentPhone}`}
                    className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                    title={`Call student ${job.studentName}`}
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                  </a>

                  <button
                    onClick={() => onSelectComplaint(job.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    View History
                  </button>

                  {job.status === 'assigned' && (
                    <button
                      onClick={() => handleStartWork(job.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                      <span>Start Work</span>
                    </button>
                  )}

                  {job.status === 'in_progress' && (
                    <button
                      onClick={() => handleOpenResolveModal(job)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Log Resolution</span>
                    </button>
                  )}

                  {(job.status === 'resolved' || job.status === 'closed') && (
                    <StatusBadge status={job.status} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resolution Completion Modal */}
      {resolvingTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Complete Work Order #{resolvingTicket.id}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Room {resolvingTicket.roomNumber} · {resolvingTicket.studentName}
                </p>
              </div>
              <button
                onClick={() => setResolvingTicket(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Done & Action Taken *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Replaced burnt capacitor on ceiling fan and oiled shaft bearings. Fan tested at full speed without noise."
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spare Parts / Materials Consumed (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1x 2.5uF Fan Capacitor, Insulation tape"
                  value={partsUsed}
                  onChange={(e) => setPartsUsed(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResolvingTicket(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!resolutionRemarks.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Work Complete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
