import { AlertCircle, CheckCircle2, Clock, RotateCcw, Wrench } from 'lucide-react';
import React from 'react';
import { ComplaintStatus } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  switch (status) {
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          <span>Pending Review</span>
        </span>
      );
    case 'under_review':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-400">
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
          <span>Under Review</span>
        </span>
      );
    case 'assigned':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-400">
          {showIcon && <Wrench className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
          <span>Technician Dispatched</span>
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-sky-400">
          {showIcon && <Wrench className="w-3.5 h-3.5 text-sky-600 animate-pulse shrink-0" />}
          <span>In Progress</span>
        </span>
      );
    case 'resolved':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          <span>Resolved (Pending Verification)</span>
        </span>
      );
    case 'closed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span>Closed & Verified</span>
        </span>
      );
    case 'reopened':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-400">
          {showIcon && <RotateCcw className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          <span>Reopened</span>
        </span>
      );
    default:
      return <span className="text-xs text-slate-600">{status}</span>;
  }
};
