import { AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import React from 'react';

export const SafetyHandbook: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Hostel Maintenance Standard Operating Procedures (SOP)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory safety guidelines and student room access rules for all college maintenance contractors.
          </p>
        </div>

        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>1. Resident Room Entry Protocol</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              Technicians must always knock three times and announce affiliation ("Maintenance staff for Electrical repair"). Never enter an unoccupied student room unless accompanied by the floor warden or caretaker keyholder. Keep the main room door wide open throughout the repair visit.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>2. Electrical Lockout / Tagout (LOTO)</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              Before working on any room distribution board, geyser terminal, or sub-panel, isolate the corresponding circuit breaker at the floor sub-distribution box and apply warning tag. Always verify zero voltage with an insulated digital multi-meter.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>3. Worksite Cleanliness & Waste Disposal</span>
            </h3>
            <p className="leading-relaxed text-slate-600">
              Collect all trimmed wire snippets, drill dust, worn washers, and broken plastic covers in your toolbag. Leave the student work desk and floor completely clean.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
