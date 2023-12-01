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
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
}