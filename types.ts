
export enum UserRole {
  IMPAIRED = 'IMPAIRED',
  VOLUNTEER = 'VOLUNTEER',
  UNSET = 'UNSET'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  rating: number;
  completedTasks: number;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface HelpRequest {
  id: string;
  userId: string;
  userName: string;
  description: string;
  generalizedDescription: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: RequestStatus;
  volunteerId?: string;
  createdAt: number;
}
