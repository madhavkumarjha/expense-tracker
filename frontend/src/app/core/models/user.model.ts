export interface User {
  _id: string;         // Matches MongoDB perfectly
  name: string;
  email: string;
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: string;   // ISO Date string
  updatedAt: string;
  refreshToken?: string;
  deactivatedAt?: string | null;
}