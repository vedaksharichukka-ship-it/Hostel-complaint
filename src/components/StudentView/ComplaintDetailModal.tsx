import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Printer,
  RotateCcw,
  Send,
  Star,
  User,
  Wrench,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_INFO } from '../../data/mockData';
import { Complaint } from '../../types';
import { CategoryIcon } from '../Common/CategoryIcon';
import { PriorityIndicator } from '../Common/PriorityIndicator';
import { StatusBadge } from '../Common/StatusBadge';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
}) => {
  const {
    role,
    rateAndCloseComplaint,
    reopenComplaint,
    addTicketComment,
    updateComplaintStatus,
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenBox, setShowReopenBox] = useState(false);

  if (!complaint) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addTicketComment(complaint.id, commentText);
    setCommentText('');
  };

  const handleRateAndClose = () => {
    rateAndCloseComplaint(complaint.id, rating, feedback);
  };

  const handleReopen = () => {
    if (!reopenReason.trim()) return;
    reopenComplaint(complaint.id, reopenReason);
    setShowReopenBox(false);
    setReopenReason('');
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  // Stepper steps
  const steps = [
    { key: 'submitted', label: 'Registered' },
    { key: 'assigned', label: 'Dispatched' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'closed', label: 'Closed' },
  ];

  const getStepStatus = (stepKey: string) => {
    const statusOrder = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed'];
    const currentIndex = statusOrder.indexOf(complaint.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (complaint.status === 'reopened') {
      if (stepKey === 'submitted') return 'completed';
      return 'reopened';
    }

    if (currentIndex >= stepIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono font-semibold text-slate-900">{complaint.id}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{complaint.category}</span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(complaint.createdAt)}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {complaint.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title="Print grievance receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Priority Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                  Current Status
                </span>
                <StatusBadge status={complaint.status} />
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                  Priority
                </span>
                <PriorityIndicator priority={complaint.priority} />
              </div>
            </div>

            <div className="text-right text-xs text-slate-600">
              <span className="font-medium text-slate-900">{complaint.block}</span>
              <span className="mx-1">/</span>
              <span>Room {complaint.roomNumber} ({complaint.bedNo || 'Standard'})</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div>
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-3">
              Resolution Lifecycle
            </span>
            <div className="grid grid-cols-5 gap-2 relative">
              {steps.map((st, i) => {
                const stepState = getStepStatus(st.key);
                return (
                  <div key={st.key} className="text-center">
                    <div
                      className={`h-2 rounded-full mb-2 transition-all ${
                        stepState === 'completed'
                          ? 'bg-emerald-500'
                          : stepState === 'reopened'
                          ? 'bg-rose-400'
                          : 'bg-slate-200'
                      }`}
                    />
                    <span
                      className={`text-[11px] block truncate ${
                        stepState === 'completed'
                          ? 'font-semibold text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Issue Details & Room Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                  {complaint.description}
                </p>
              </div>

              {complaint.imageUrl && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Attached Evidence
                  </h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-w-sm">
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint attachment"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Resolution Card if resolved */}
              {complaint.resolution && (
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resolution Logged by {complaint.resolution.technicianName}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {complaint.resolution.remarks}
                  </p>
                  {complaint.resolution.partsUsed && (
                    <p className="text-xs text-slate-600">
                      <strong className="text-slate-700">Spare Parts Used:</strong> {complaint.resolution.partsUsed}
                    </p>
                  )}
                  {complaint.resolution.studentRating && (
                    <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-3">
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= (complaint.resolution?.studentRating || 0)
                                ? 'fill-current'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-600">
                        Student review: "{complaint.resolution.studentFeedback}"
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Student Action: Rate & Close or Reopen */}
              {role === 'student' && complaint.status === 'resolved' && (
                <div className="p-4 bg-white border-2 border-slate-900 rounded-lg space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Verify Maintenance & Close Ticket
                  </h4>
                  <p className="text-xs text-slate-600">
                    The maintenance staff marked this issue as resolved. Please verify if the repair works in your room.
                  </p>

                  {!showReopenBox ? (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-700">Your Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              className="p-1 text-amber-400 hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  star <= rating ? 'fill-current' : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Leave quick feedback (e.g. Prompt work, good repair)..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                      />

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleRateAndClose}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Accept & Close Ticket</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReopenBox(true)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Issue Not Resolved? Reopen</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <label className="block text-xs font-semibold text-rose-700">
                        Reason for reopening:
                      </label>
                      <textarea
                        rows={2}
                        value={reopenReason}
                        onChange={(e) => setReopenReason(e.target.value)}
                        placeholder="Explain why the problem persists (e.g. Fan still screeching)..."
                        className="w-full px-3 py-1.5 text-xs border border-rose-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleReopen}
                          disabled={!reopenReason.trim()}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg transition-colors"
                        >
                          Confirm Reopen Ticket
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowReopenBox(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Metadata Card */}
            <div className="space-y-4">
              {/* Resident Card */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Student Details
                </span>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-semibold text-slate-800">{complaint.studentName}</span>
                </div>
                <div className="text-slate-600 font-mono text-[11px]">
                  Roll: {complaint.studentId}
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{complaint.studentPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Slot: {complaint.preferredSlot}</span>
                </div>
              </div>

              {/* Assigned Technician Card */}
              {complaint.assignedTechnician ? (
                <div className="p-3.5 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs space-y-2">
                  <span className="font-semibold text-indigo-950 uppercase tracking-wider text-[11px] block">
                    Assigned Worker
                  </span>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-900">
                      {complaint.assignedTechnician.name}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {complaint.assignedTechnician.specialty}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <a
                      href={`tel:${complaint.assignedTechnician.phone}`}
                      className="hover:underline font-mono text-[11px]"
                    >
                      {complaint.assignedTechnician.phone}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 block mb-1">Technician Not Assigned</span>
                  Awaiting dispatch from Warden Office.
                </div>
              )}

              {/* Audit Timeline */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] block mb-2.5">
                  Audit Activity
                </span>
                <div className="space-y-2.5">
                  {complaint.timeline.map((event) => (
                    <div key={event.id} className="border-l-2 border-slate-300 pl-2 text-[11px] space-y-0.5">
                      <div className="text-slate-800 font-medium">{event.note}</div>
                      <div className="text-slate-400 font-mono text-[10px]">
                        {formatDate(event.timestamp)} · {event.actor}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comment & Messages Thread */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Grievance Discussion & Updates ({complaint.comments.length})</span>
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {complaint.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No notes or comments added yet.</p>
              ) : (
                complaint.comments.map((cm) => (
                  <div
                    key={cm.id}
                    className={`p-2.5 rounded-lg text-xs border ${
                      cm.senderRole === role
                        ? 'bg-slate-100/70 border-slate-300 ml-4'
                        : 'bg-white border-slate-200 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800">{cm.senderName}</span>
                      <span className="font-mono text-[10px]">{formatDate(cm.createdAt)}</span>
                    </div>
                    <p className="text-slate-700 leading-snug">{cm.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Post an update or question regarding this issue..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
