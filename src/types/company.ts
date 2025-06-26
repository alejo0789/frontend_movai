// src/types/company.ts

export interface EmpresaResponse {
  id: string; // UUID
  nombre_empresa: string;
  nit: string;
  direccion?: string;
  telefono_contacto?: string;
  email_contacto?: string;
  fecha_registro?: string; // ISO string
  activo?: boolean;
  last_updated_at?: string; // ISO string
}