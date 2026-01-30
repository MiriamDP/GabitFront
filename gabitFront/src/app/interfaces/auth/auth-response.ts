export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    idUser: number;
    email: string;
    username: string;
    rol: string;
    photo: string | null;
    created_at: string;
    updated_at: string;
  };
}