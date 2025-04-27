export interface LoginRequest {
  Email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}
