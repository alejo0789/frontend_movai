// src/types/bus.ts

export interface BusResponse {
  id: string; // UUID
  placa: string;
  numero_interno: string;
  id_empresa: string;
  marca?: string | null;
  modelo?: string | null;
  anio_fabricacion?: number | null;
  capacidad_pasajeros?: number | null;
  estado_operativo: 'Operativo' | 'Mantenimiento' | 'Fuera de Servicio';
  ultima_conexion_at?: string | null;
  ubicacion_actual_gps?: string | null;
  last_updated_at: string;
}

export type BusEstadoOperativo = 'Operativo' | 'Mantenimiento' | 'Fuera de Servicio';