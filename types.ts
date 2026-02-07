
export enum UserRole {
  OWNER = 'OWNER',
  EMPLOYEE = 'EMPLOYEE',
  GUEST = 'GUEST'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED'
}

export enum BillStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export enum ShiftRequestType {
  START = 'START',
  STOP = 'STOP'
}

export type MarketingChannel = 'WHATSAPP' | 'SMS' | 'EMAIL' | 'IN_APP';

export type Language = 'EN' | 'TA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  designation: string;
  mobile?: string;
  password?: string;
}

export interface LocationRecord {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  checkIn: number;
  checkOut?: number;
  checkInLoc: LocationRecord;
  checkOutLoc?: LocationRecord;
}

export interface ShiftRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: ShiftRequestType;
  otp?: string;
  otpExpiresAt?: number;
  createdAt: number;
}

export interface Bill {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  imageUrl: string;
  status: BillStatus;
}

export interface CampaignMetrics {
  reach: number;
  engagement: number;
  ctr: number;
}

export interface Campaign {
  id: string;
  title: string;
  type: 'SEO' | 'SMM' | 'CAMPAIGN';
  status: CampaignStatus;
  assignedTo: string[];
  description: string;
  channels: MarketingChannel[];
  targetLocation?: {
    label: string;
    radius: number; // in km
  };
  metrics: CampaignMetrics;
  createdAt: number;
}
