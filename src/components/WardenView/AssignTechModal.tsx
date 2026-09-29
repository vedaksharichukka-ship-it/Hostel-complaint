import { Check, Phone, UserCheck, Wrench, X } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint } from '../../types';

interface AssignTechModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignTechModal: React.FC<AssignTechModalProps> = ({
  complaint,
  isOpen,
  onClose,
}) => {
  const { technicians, assignTechnician } = useApp();
  const [selectedTechId, setSelectedTechId] = useState<string>(technicians[0]?.id || '');

  if (!isOpen || !complaint) return null;

  const handleAssign = () => {
    if (!selectedTechId) return;
    assignTechnician(complaint.id, selectedTechId);
    onClose();
  };

  // Recommend tech matching complaint category
  const matchingTechs = technicians.filter(
    (t) => t.category === complaint.category
  );
  const otherTechs = technicians.filter(
    (t) => t.category !== complaint.category
  );
  const sortedTechs = [...matchingTechs, ...otherTechs];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Dispatch Technician for Work Order
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ticket #{complaint.id} · {complaint.category} · Room {complaint.roomNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-xs text-slate-600 mb-2">
            Select an on-duty maintenance technician. Matching specialists are pinned to top:
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {sortedTechs.map((tech) => {
              const isSelected = selectedTechId === tech.id;
              const isMatching = tech.category === complaint.category;

              return (
                <div
                  key={tech.id}
                  onClick={() => setSelectedTechId(tech.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{tech.name}</span>
                      {isMatching && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Recommended Match
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 truncate">{tech.specialty}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3 font-mono">
                      <span>{tech.phone}</span>
                      <span>·</span>
                      <span>{tech.activeJobsCount} active jobs</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 shadow-xs"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Confirm Assignment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
