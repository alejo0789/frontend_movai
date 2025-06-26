// src/types/user.ts

export interface UserData {
  username: string;
  password?: string; // Opcional para actualizaciones, requerido para creación
  email: string;
  rol: string;
  activo?: boolean; // Opcional, por defecto true en backend
  id_empresa?: string | null; // UUID de la empresa, o null para admin global
}

export interface UserResponse {
  id: string; // UUID
  username: string;
  email: string;
  rol: string;
  activo: boolean;
  id_empresa: string | null; // UUID de la empresa, o null
  fecha_creacion?: string; // ISO string
  ultimo_login_at?: string | null; // ISO string
  last_updated_at?: string; // ISO string
}