// src/types/user.types.ts

// Bu tip, backend'den login/register sonrası dönen yanıta göre modellenmiştir.
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin';
  avatar?: string;
}