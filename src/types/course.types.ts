// src/types/course.types.ts

// Diğer tipleri kendi dosyalarından import etmek en temiz yoldur.
import type { User } from './user.types';
import type { Category } from './category.types';

export interface Course {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  instructor: Pick<User, '_id' | 'name'>; // User'ın sadece _id ve name alanlarını al
  categories: Pick<Category, '_id' | 'name'>[]; // Category'nin sadece _id ve name alanlarını al
  isPublished: boolean;
  sections: {
    _id: string;
    title: string;
    order: number;
    lectures: {
      _id: string;
      title: string;
      duration: number;
      order: number;
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
}