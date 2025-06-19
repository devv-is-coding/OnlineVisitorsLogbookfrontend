export interface Sex {
  id: number;
  sex: 'Male' | 'Female';
}

export interface Visitor {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  age: number;
  sex: 'Male' | 'Female'; // For frontend display
  sex_id?: number; // For Laravel backend
  sexes?: Sex[]; // Laravel relationship data
  purpose_of_visit: string;
  contact_number: string;
  created_at: string;
  updated_at: string;
  time_out?: string | null;
}

export interface Admin {
  id: number;
  name: string; // Laravel uses 'name' field
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVisitorData {
  firstname: string;
  middlename?: string;
  lastname: string;
  age: number;
  sex: 'Male' | 'Female';
  purpose_of_visit: string;
  contact_number: string;
}

export interface UpdateVisitorData extends CreateVisitorData {}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}