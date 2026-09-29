import { Building2, Plus, Shield, User, Wrench } from 'lucide-react';
import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenNewComplaint?: () => void;
  onOpenPostNotice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenNewComplaint,
  onOpenPostNotice,
}) => {
  const { role, setRole, activeStudent, activeTechnician } = useApp();

  const getNavLinks = () => {
    if (role === 'student') {
      return [
        { id: 'complaints', label: 'My Complaints' },
        { id: 'notices', label: 'Announcements' },
        { id: 'directory', label: 'Hostel Hotlines' },
      ];
    }
    if (role === 'warden') {
      return [
        { id: 'queue', label: 'Master Queue' },
        { id: 'analytics', label: 'Hostel Analytics' },
        { id: 'notices', label: 'Notice Board' },
        { id: 'technicians', label: 'Duty Roster' },
      ];
    }
    return [
      { id: 'work_orders', label: 'Active Jobs' },
      { id: 'completed', label: 'Completed Jobs' },
      { id: 'handbook', label: 'Safety Protocols' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Element */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onTabChange(navLinks[0].id);
            }}
            className="flex items-center gap-2.5 text-slate-900 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span>HostelDesk</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-slate-900 bg-slate-100 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Role Switcher & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Segmented Role Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium border border-slate-200">
            <button
              onClick={() => setRole('student')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                role === 'student'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Student view"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student</span>
            </button>
            <button
              onClick={() => setRole('warden')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                role === 'warden'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Warden Administrator view"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Warden</span>
            </button>
            <button
              onClick={() => setRole('technician')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                role === 'technician'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Maintenance Technician view"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Staff</span>
            </button>
          </div>

          {/* Primary Action Button */}
          {role === 'student' && onOpenNewComplaint && (
            <button
              onClick={onOpenNewComplaint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Log Grievance</span>
            </button>
          )}

          {role === 'warden' && onOpenPostNotice && (
            <button
              onClick={onOpenPostNotice}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {navLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                isActive ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-600'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
