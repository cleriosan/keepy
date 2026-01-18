
import React from 'react';
import { Role, JobStatus, JobType, Priority, Permission } from './types';

export const DEFAULT_PERMISSIONS: Record<Role, Permission> = {
  [Role.ADMIN]: {
    viewJobs: true, updateStatus: true, uploadMedia: true, addComments: true,
    reportIssues: true, adjustInventory: true, createMaintenance: true, viewGuestDetails: true
  },
  [Role.CLEANER]: {
    viewJobs: true, updateStatus: true, uploadMedia: true, addComments: true,
    reportIssues: true, adjustInventory: false, createMaintenance: false, viewGuestDetails: false
  },
  [Role.HANDYMAN]: {
    viewJobs: true, updateStatus: true, uploadMedia: true, addComments: true,
    reportIssues: true, adjustInventory: false, createMaintenance: true, viewGuestDetails: false
  },
  [Role.CONTRACTOR]: {
    viewJobs: true, updateStatus: true, uploadMedia: true, addComments: true,
    reportIssues: true, adjustInventory: false, createMaintenance: false, viewGuestDetails: false
  }
};

export const MOCK_USERS = [
  {
    id: 'u1', name: 'Alice Admin', email: 'alice@lumina.com', role: Role.ADMIN,
    active: true, permissions: DEFAULT_PERMISSIONS[Role.ADMIN]
  },
  {
    id: 'u2', name: 'Bob Cleaner', email: 'bob@lumina.com', role: Role.CLEANER,
    active: true, permissions: DEFAULT_PERMISSIONS[Role.CLEANER], whatsapp: '44123456789'
  },
  {
    id: 'u3', name: 'Charlie Handyman', email: 'charlie@lumina.com', role: Role.HANDYMAN,
    active: true, permissions: DEFAULT_PERMISSIONS[Role.HANDYMAN], tradeTags: ['Plumbing', 'Electrical'],
    score: 4.8, rate: 45
  }
];

export const MOCK_PROPERTIES = [
  { id: 'p1', name: 'The Shard Suite', address: '32 London Bridge St, London SE1 9SG', parLevels: { 'Toilet Roll': 10, 'Coffee Pods': 20 } },
  { id: 'p2', name: 'Notting Hill Mews', address: '12 Kensington Park Rd, London W11 3BU', parLevels: { 'Toilet Roll': 8, 'Coffee Pods': 15 } }
];

export const MOCK_BOOKINGS = [
  { id: 'b1', propertyId: 'p1', guestName: 'John Doe', reference: 'TK-9981', checkIn: '2023-10-25', checkOut: '2023-10-27' },
  { id: 'b2', propertyId: 'p2', guestName: 'Jane Smith', reference: 'TK-4421', checkIn: '2023-10-26', checkOut: '2023-10-27' }
];

export const INITIAL_CHECKLIST = [
  { id: 'c1', label: 'Launder all linen and towels', required: true },
  { id: 'c2', label: 'Deep clean kitchen and surfaces', required: true },
  { id: 'c3', label: 'Refill toiletries and consumables', required: true },
  { id: 'c4', label: 'Vacuum and mop all floors', required: true },
  { id: 'c5', label: 'Check for maintenance issues', required: false }
];

export const STATUS_COLORS = {
  [JobStatus.NEEDS_CLEANING]: 'bg-rose-100 text-rose-700 border-rose-200',
  [JobStatus.IN_PROGRESS]: 'bg-amber-100 text-amber-700 border-amber-200',
  [JobStatus.COMPLETED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [JobStatus.CANCELLED]: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const PRIORITY_COLORS = {
  [Priority.LOW]: 'text-slate-500',
  [Priority.MEDIUM]: 'text-blue-500',
  [Priority.HIGH]: 'text-orange-500',
  [Priority.URGENT]: 'text-red-600 font-bold',
};
