export type UserRole = 'student' | 'warden' | 'technician';

export type ComplaintCategory =
  | 'electrical'
  | 'plumbing'
  | 'wifi'
  | 'carpentry'
  | 'housekeeping'
  | 'mess'
  | 'pest_control'
  | 'security'
  | 'appliances';

export type ComplaintPriority = 'low' | 'normal' | 'high' | 'emergency';

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'reopened';

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  note: string;
  actor: string;
}

export interface TicketComment {
  id: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  createdAt: string;
}

export interface AssignedTechnician {
  name: string;
  phone: string;
  specialty: string;
  assignedAt: string;
}

export interface ComplaintResolution {
  resolvedAt: string;
  remarks: string;
  partsUsed?: string;
  technicianName: string;
  studentRating?: number; // 1 to 5 stars
  studentFeedback?: string;
  closedAt?: string;
}

export interface Complaint {
  id: string; // e.g. "HST-1042"
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  block: string;
  floor: number;
  roomNumber: string;
  bedNo?: string;
  studentName: string;
  studentId: string; // e.g. "23BCE1048"
  studentPhone: string;
  preferredSlot: string; // "Morning (09:00 - 12:00)", "Afternoon (14:00 - 17:00)", "Evening (17:00 - 20:00)"
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  assignedTechnician?: AssignedTechnician;
  timeline: TimelineEvent[];
  comments: TicketComment[];
  resolution?: ComplaintResolution;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'normal' | 'important' | 'urgent';
  targetAudience: string;
  author: string;
  authorRole: string;
  date: string;
  active: boolean;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  category: ComplaintCategory;
  specialty: string;
  avatar?: string;
  activeJobsCount: number;
  onDuty: boolean;
}

export interface EmergencyContact {
  id: string;
  title: string;
  name: string;
  phone: string;
  availableHours: string;
  location: string;
  isEmergency: boolean;
}
