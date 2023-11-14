export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  isPasswordReset?: boolean;
  role: string;
  companyName?: string;
  locale: string;
  currency: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}