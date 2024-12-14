//Registration form data
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean; //agreed to terms
}

//Response from login
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
  };
  token?: string; //JWT token
}

//User data without password
export interface UserWithoutPassword {
  id: number;
  email: string;
}
