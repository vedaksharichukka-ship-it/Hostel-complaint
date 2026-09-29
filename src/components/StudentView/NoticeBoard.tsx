import { Bell, Calendar, Pin, User } from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';

export const NoticeBoard: React.FC = () => {
  const { announcements } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-700" />
              <span>Official Hostel Circulars & Announcements</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Broadcasts, water schedule updates, maintenance shutdowns, and mess notifications
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600">
            {announcements.length} Published
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((notice) => (
            <div
              key={notice.id}
              className={`p-5 rounded-xl border transition-all ${
                notice.priority === 'urgent'
                  ? 'border-rose-200 bg-rose-50/40'
                  : notice.priority === 'important'
                  ? 'border-amber-200 bg-amber-50/40'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{notice.targetAudience}</span>
                </span>
                <span className="font-mono text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{notice.date}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {notice.title}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                {notice.message}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{notice.author} ({notice.authorRole})</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {notice.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
