export interface TeslaAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  created_at: number;
}

export interface AuthChallenge {
  code_verifier: string;
  code_challenge: string;
  state: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: T | string;
} 