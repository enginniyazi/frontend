// src/types/application.types.ts
import type { User } from './user.types';

export interface InstructorApplication {
  _id: string;
  user: Pick<User, '_id' | 'name' | 'email'>; // Başvuran kullanıcının sadece temel bilgileri
  status: 'pending' | 'approved' | 'rejected';
  bio: string;
  expertise: string[];
  createdAt: string;
  updatedAt: string;
}