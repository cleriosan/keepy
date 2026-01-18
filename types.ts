
export enum Role {
  ADMIN = 'ADMIN',
  CLEANER = 'CLEANER',
  HANDYMAN = 'HANDYMAN',
  CONTRACTOR = 'CONTRACTOR'
}

export enum JobStatus {
  NEEDS_CLEANING = 'NEEDS_CLEANING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum JobType {
  TURNOVER = 'TURNOVER',
  MAINTENANCE = 'MAINTENANCE'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum IssueType {
  MISSING = 'MISSING',
  DAMAGED = 'DAMAGED',
  LOW_STOCK = 'LOW_STOCK',
  OTHER = 'OTHER'
}

export interface Permission {
  viewJobs: boolean;
  updateStatus: boolean;
  uploadMedia: boolean;
  addComments: boolean;
  reportIssues: boolean;
  adjustInventory: boolean;
  createMaintenance: boolean;
  viewGuestDetails: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission;
  active: boolean;
  whatsapp?: string;
  tradeTags?: string[];
  rate?: number;
  score?: number;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  parLevels: Record<string, number>;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  reference: string;
  checkIn: string;
  checkOut: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  completedAt?: string;
  issue?: {
    type: IssueType;
    comment: string;
    mediaUrl?: string;
  };
}

export interface Job {
  id: string;
  propertyId: string;
  bookingId?: string;
  type: JobType;
  status: JobStatus;
  priority: Priority;
  assignedTo: string[];
  deadline: string;
  checklist: ChecklistItem[];
  mediaUrls: string[];
  notes: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  propertyId: string;
  category: string;
  name: string;
  currentCount: number;
  parLevel: number;
}

export interface Issue {
  id: string;
  jobId: string;
  bookingId?: string;
  propertyId: string;
  type: IssueType;
  itemName: string;
  comment: string;
  mediaUrl: string;
  reportedBy: string;
  reportedAt: string;
}
