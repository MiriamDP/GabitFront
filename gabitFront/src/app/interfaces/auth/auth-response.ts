export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    idUsuario: number;
    nombre: string;
    apellidos: string;
    email: string;
    nombreUsuario: string;
    rol: string;
    fotoPerfil: string | null;
    created_at: string;
    updated_at: string;
  };
}