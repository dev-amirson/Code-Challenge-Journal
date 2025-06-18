export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  displayName?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  success?: boolean;
  errors?: string[];
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}
