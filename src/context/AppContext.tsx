import React, { createContext, useContext, useEffect, useState } from 'react';
import { ANNOUNCEMENTS, INITIAL_COMPLAINTS, TECHNICIANS_LIST } from '../data/mockData';
import { Announcement, Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus, Technician, UserRole } from '../types';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  complaints: Complaint[];
  announcements: Announcement[];
  technicians: Technician[];
  activeStudent: {
    name: string;
    studentId: string;
    roomNumber: string;
    block: string;
    floor: number;
    phone: string;
  };
  activeTechnician: Technician;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  createComplaint: (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    block: string;
    floor: number;
    roomNumber: string;
    bedNo?: string;
    preferredSlot: string;
    imageUrl?: string;
  }) => Complaint;
  updateComplaintStatus: (id: string, status: ComplaintStatus, note: string) => void;
  assignTechnician: (complaintId: string, technicianId: string) => void;
  resolveWorkOrder: (complaintId: string, remarks: string, partsUsed?: string) => void;
  rateAndCloseComplaint: (complaintId: string, rating: number, feedback: string) => void;
  reopenComplaint: (complaintId: string, reason: string) => void;
  addTicketComment: (complaintId: string, content: string) => void;
  postAnnouncement: (data: {
    title: string;
    message: string;
    priority: 'normal' | 'important' | 'urgent';
    targetAudience: string;
  }) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPLAINTS: 'hosteldesk_complaints_v1',
  ANNOUNCEMENTS: 'hosteldesk_announcements_v1',
  ROLE: 'hosteldesk_current_role_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'student';
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : ANNOUNCEMENTS;
    } catch {
      return ANNOUNCEMENTS;
    }
  });

  const [technicians] = useState<Technician[]>(TECHNICIANS_LIST);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const activeStudent = {
    name: 'Aarav Sharma',
    studentId: '23BCE1048',
    roomNumber: '304',
    block: 'Block A - Nilgiri',
    floor: 3,
    phone: '+91 98451 22910',
  };

  const activeTechnician = technicians[0]; // Ramesh Kumar (Electrician)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    showToast(
      'Switched Role View',
      `Now browsing portal as ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}`,
      'info'
    );
  };

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const createComplaint = (data: {
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    block: string;
    floor: number;
    roomNumber: string;
    bedNo?: string;
    preferredSlot: string;
    imageUrl?: string;
  }) => {
    const ticketId = `HST-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newTicket: Complaint = {
      id: ticketId,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'submitted',
      block: data.block,
      floor: data.floor,
      roomNumber: data.roomNumber,
      bedNo: data.bedNo || 'Standard',
      studentName: activeStudent.name,
      studentId: activeStudent.studentId,
      studentPhone: activeStudent.phone,
      preferredSlot: data.preferredSlot,
      imageUrl: data.imageUrl,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: 'tl-' + Date.now(),
          status: 'submitted',
          timestamp: now,
          note: 'Complaint registered by student',
          actor: `${activeStudent.name} (${activeStudent.studentId})`,
        },
      ],
      comments: [],
    };

    setComplaints((prev) => [newTicket, ...prev]);
    showToast('Complaint Logged', `Ticket #${ticketId} submitted to Warden Office`, 'success');
    return newTicket;
  };

  const updateComplaintStatus = (id: string, newStatus: ComplaintStatus, note: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newTimeline = [
          ...c.timeline,
          {
            id: 'tl-' + Date.now(),
            status: newStatus,
            timestamp: now,
            note: note || `Status changed to ${newStatus}`,
            actor: role === 'warden' ? 'Dr. K. Ramanathan (Warden)' : activeTechnician.name,
          },
        ];
        return {
          ...c,
          status: newStatus,
          updatedAt: now,
          timeline: newTimeline,
        };
      })
    );
    showToast('Status Updated', `Ticket #${id} is now ${newStatus.replace('_', ' ')}`, 'info');
  };

  const assignTechnician = (complaintId: string, technicianId: string) => {
    const tech = technicians.find((t) => t.id === technicianId);
    if (!tech) return;

    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: 'assigned',
          updatedAt: now,
          assignedTechnician: {
            name: tech.name,
            phone: tech.phone,
            specialty: tech.specialty,
            assignedAt: now,
          },
          timeline: [
            ...c.timeline,
            {
              id: 'tl-' + Date.now(),
              status: 'assigned',
              timestamp: now,
              note: `Assigned to ${tech.name} (${tech.specialty})`,
              actor: 'Hostel Warden Office',
            },
          ],
        };
      })
    );
    showToast('Technician Assigned', `Dispatched to ${tech.name}`, 'success');
  };

  const resolveWorkOrder = (complaintId: string, remarks: string, partsUsed?: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: 'resolved',
          updatedAt: now,
          resolution: {
            resolvedAt: now,
            remarks,
            partsUsed,
            technicianName: activeTechnician.name,
          },
          timeline: [
            ...c.timeline,
            {
              id: 'tl-' + Date.now(),
              status: 'resolved',
              timestamp: now,
              note: `Work completed: ${remarks}`,
              actor: `${activeTechnician.name} (Technician)`,
            },
          ],
        };
      })
    );
    showToast('Work Order Resolved', `Ticket #${complaintId} marked resolved. Waiting student verification.`, 'success');
  };

  const rateAndCloseComplaint = (complaintId: string, rating: number, feedback: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: 'closed',
          updatedAt: now,
          resolution: c.resolution
            ? {
                ...c.resolution,
                studentRating: rating,
                studentFeedback: feedback,
                closedAt: now,
              }
            : undefined,
          timeline: [
            ...c.timeline,
            {
              id: 'tl-' + Date.now(),
              status: 'closed',
              timestamp: now,
              note: `Verified by student (${rating}/5 stars): ${feedback || 'Resolution confirmed'}`,
              actor: `${c.studentName} (Student)`,
            },
          ],
        };
      })
    );
    showToast('Grievance Closed', `Thank you for your feedback! Rating: ${rating} Stars`, 'success');
  };

  const reopenComplaint = (complaintId: string, reason: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: 'reopened',
          updatedAt: now,
          timeline: [
            ...c.timeline,
            {
              id: 'tl-' + Date.now(),
              status: 'reopened',
              timestamp: now,
              note: `Reopened by student: ${reason}`,
              actor: `${c.studentName} (Student)`,
            },
          ],
        };
      })
    );
    showToast('Ticket Reopened', `Warden office notified that issue is persisting`, 'warning');
  };

  const addTicketComment = (complaintId: string, content: string) => {
    if (!content.trim()) return;
    const now = new Date().toISOString();
    const senderName =
      role === 'student'
        ? activeStudent.name
        : role === 'warden'
        ? 'Dr. K. Ramanathan (Warden)'
        : activeTechnician.name;

    const newComment = {
      id: 'cm-' + Date.now(),
      senderName,
      senderRole: role,
      content: content.trim(),
      createdAt: now,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          updatedAt: now,
          comments: [...c.comments, newComment],
        };
      })
    );
  };

  const postAnnouncement = (data: {
    title: string;
    message: string;
    priority: 'normal' | 'important' | 'urgent';
    targetAudience: string;
  }) => {
    const newAnc: Announcement = {
      id: 'anc-' + Date.now(),
      title: data.title,
      message: data.message,
      priority: data.priority,
      targetAudience: data.targetAudience,
      author: 'Dr. K. Ramanathan',
      authorRole: 'Chief Warden',
      date: new Date().toISOString().split('T')[0],
      active: true,
    };

    setAnnouncements((prev) => [newAnc, ...prev]);
    showToast('Notice Broadcasted', `Announcement published to ${data.targetAudience}`, 'success');
  };

  const resetDemoData = () => {
    setComplaints(INITIAL_COMPLAINTS);
    setAnnouncements(ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    showToast('System Reset', 'Restored default demo complaints and notices', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        complaints,
        announcements,
        technicians,
        activeStudent,
        activeTechnician,
        toasts,
        dismissToast,
        showToast,
        createComplaint,
        updateComplaintStatus,
        assignTechnician,
        resolveWorkOrder,
        rateAndCloseComplaint,
        reopenComplaint,
        addTicketComment,
        postAnnouncement,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
