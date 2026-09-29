import { Clock, MapPin, Phone, PhoneCall, ShieldAlert } from 'lucide-react';
import React from 'react';
import { EMERGENCY_CONTACTS } from '../../data/mockData';

export const EmergencyDirectory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Hostel Emergency & Helpdesk Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Direct hotlines for warden quarters, 24x7 medical emergency, security gate, and on-duty technicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className={`p-5 rounded-xl border transition-all ${
                contact.isEmergency
                  ? 'border-rose-200 bg-rose-50/20 shadow-xs'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">
                  {contact.title}
                </span>
                {contact.isEmergency && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    24x7 SOS
                  </span>
                )}
              </div>

              <div className="text-sm font-semibold text-slate-800 mb-3">
                {contact.name}
              </div>

              <div className="space-y-2 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{contact.availableHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{contact.location}</span>
                </div>
              </div>

              <a
                href={`tel:${contact.phone}`}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center gap-2 font-mono"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {contact.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
