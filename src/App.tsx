/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChatbotWidget } from './components/Chat/ChatbotWidget';
import { ToastContainer } from './components/Common/ToastContainer';
import { Header } from './components/Header';
import { ComplaintDetailModal } from './components/StudentView/ComplaintDetailModal';
import { EmergencyDirectory } from './components/StudentView/EmergencyDirectory';
import { NewComplaintModal } from './components/StudentView/NewComplaintModal';
import { NoticeBoard } from './components/StudentView/NoticeBoard';
import { StudentDashboard } from './components/StudentView/StudentDashboard';
import { SafetyHandbook } from './components/TechnicianView/SafetyHandbook';
import { TechnicianDashboard } from './components/TechnicianView/TechnicianDashboard';
import { PostNoticeModal } from './components/WardenView/PostNoticeModal';
import { WardenAnalytics } from './components/WardenView/WardenAnalytics';
import { WardenDashboard } from './components/WardenView/WardenDashboard';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const { role, complaints } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('complaints');
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isPostNoticeOpen, setIsPostNoticeOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Sync tab defaults when role changes
  React.useEffect(() => {
    if (role === 'student') {
      setCurrentTab('complaints');
    } else if (role === 'warden') {
      setCurrentTab('queue');
    } else {
      setCurrentTab('work_orders');
    }
  }, [role]);

  const activeComplaint = complaints.find((c) => c.id === selectedComplaintId) || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
        onOpenPostNotice={() => setIsPostNoticeOpen(true)}
      />

      {/* Main Container (1440px baseline with 1200px max-width container) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* STUDENT VIEWS */}
        {role === 'student' && (
          <>
            {currentTab === 'complaints' && (
              <StudentDashboard
                onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}
            {currentTab === 'notices' && <NoticeBoard />}
            {currentTab === 'directory' && <EmergencyDirectory />}
          </>
        )}

        {/* WARDEN VIEWS */}
        {role === 'warden' && (
          <>
            {(currentTab === 'queue' || currentTab === 'technicians') && (
              <WardenDashboard
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
                onOpenPostNotice={() => setIsPostNoticeOpen(true)}
              />
            )}
            {currentTab === 'analytics' && <WardenAnalytics />}
            {currentTab === 'notices' && <NoticeBoard />}
          </>
        )}

        {/* TECHNICIAN VIEWS */}
        {role === 'technician' && (
          <>
            {(currentTab === 'work_orders' || currentTab === 'completed') && (
              <TechnicianDashboard
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
              />
            )}
            {currentTab === 'handbook' && <SafetyHandbook />}
          </>
        )}
      </main>

      {/* Modals */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSuccess={(ticketId) => setSelectedComplaintId(ticketId)}
      />

      <PostNoticeModal
        isOpen={isPostNoticeOpen}
        onClose={() => setIsPostNoticeOpen(false)}
      />

      <ComplaintDetailModal
        complaint={activeComplaint}
        onClose={() => setSelectedComplaintId(null)}
      />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* n8n Powered AI Hostel Assistant Chatbot */}
      <ChatbotWidget />

      {/* Clean Uncluttered Site Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">HostelDesk</span>
            <span aria-hidden="true">·</span>
            <span>Campus Residential Facilities & Maintenance Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span>24x7 Helpdesk Hotline: +91 99999 10800</span>
            <span aria-hidden="true">·</span>
            <span>Warden Office Block A</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
