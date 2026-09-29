import {
  BarChart3,
  CheckCircle2,
  Clock,
  PieChart,
  Shield,
  Star,
  TrendingUp,
} from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_INFO, HOSTEL_BLOCKS } from '../../data/mockData';

export const WardenAnalytics: React.FC = () => {
  const { complaints } = useApp();

  const total = complaints.length;
  const resolvedComplaints = complaints.filter(
    (c) => c.status === 'resolved' || c.status === 'closed'
  );
  const ratedComplaints = complaints.filter(
    (c) => c.resolution?.studentRating !== undefined
  );

  const avgRating =
    ratedComplaints.length > 0
      ? (
          ratedComplaints.reduce(
            (acc, curr) => acc + (curr.resolution?.studentRating || 0),
            0
          ) / ratedComplaints.length
        ).toFixed(1)
      : '4.8';

  // Category counts
  const categoryStats = Object.keys(CATEGORY_INFO).map((catKey) => {
    const count = complaints.filter((c) => c.category === catKey).length;
    const info = CATEGORY_INFO[catKey];
    return {
      category: catKey,
      label: info.label,
      count,
      avgHours: info.avgResolutionHours,
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            <span>Hostel Maintenance Metrics & SLA Performance</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data insights on repair turnarounds, student ratings, and breakdown trends across wings.
          </p>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Average Turnaround Time
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              3.4 Hours
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Target SLA: &lt; 6 hours for critical repairs
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Student Satisfaction Rating
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                {avgRating} / 5.0
              </span>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Based on closed ticket post-verification reviews
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Resolution Efficacy Rate
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              96.2%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Only 3.8% tickets reopened by students
            </p>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-xs text-slate-800">
            Grievances by Category & Target Resolution Benchmarks
          </div>
          <div className="divide-y divide-slate-100">
            {categoryStats.map((item) => (
              <div key={item.category} className="px-4 py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{item.label}</div>
                  <div className="text-slate-500 text-[11px]">
                    SLA Target: {item.avgHours} hours
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {item.count} tickets
                  </span>
                  <div className="text-[11px] text-slate-400">
                    {total > 0 ? ((item.count / total) * 100).toFixed(0) : 0}% of all
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
