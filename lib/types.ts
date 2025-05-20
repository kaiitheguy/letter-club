// 用户类型定义
export interface User {
  id: string; // UUID
  email: string;
  pen_name: string | null;
  application_letter: string | null;
  approved: boolean;
  created_at: string; // ISO timestamp
}

// 信件类型定义
export interface Letter {
  id: string; // UUID
  sender_id: string; // UUID
  body: string;
  delivered_to: string[]; // UUID array
  created_at: string; // ISO timestamp
}

// 活动类型定义
export interface Activity {
  id: string; // UUID
  title: string;
  description: string;
  date: string; // ISO timestamp
  applicants: string[]; // UUID array
  created_at: string; // ISO timestamp
}

export interface UserProfile {
  id: string;
  email: string;
  approved: boolean;
  pen_name: string;
  created_at?: string;
  updated_at?: string;
}
