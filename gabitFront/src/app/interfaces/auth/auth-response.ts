export interface AuthResponse {
    ok: boolean;
    user?: {
    id: number;
    name: string;
  };
  message?: string;
}
