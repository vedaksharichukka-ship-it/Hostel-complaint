import { AlertTriangle, Flame } from 'lucide-react';
import React from 'react';
import { ComplaintPriority } from '../../types';

interface PriorityIndicatorProps {
  priority: ComplaintPriority;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority }) => {
  switch (priority) {
    case 'emergency':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Emergency</span>
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>High Priority</span>
        </span>
      );
    case 'normal':
      return (
        <span className="text-xs text-slate-600">
          Normal
        </span>
      );
    case 'low':
      return (
        <span className="text-xs text-slate-500">
          Low
        </span>
      );
    default:
      return null;
  }
};
