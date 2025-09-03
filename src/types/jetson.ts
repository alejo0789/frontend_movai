// src/types/jetson.ts
export interface JetsonNano {
  id: string;
  id_hardware_jetson: string;
  id_bus: string | null;
  version_firmware: string | null;
  estado_salud: string;
  estado_conexion: 'Conectado' | 'Desconectado' | 'Mantenimiento';
  ultima_actualizacion_firmware_at: string | null;
  ultima_conexion_cloud_at: string | null;
  last_telemetry_at: string | null;
  fecha_instalacion: string | null;
  activo: boolean;
  observaciones: string | null;
  last_updated_at: string;
  // Información del bus (ya incluida desde el backend)
  bus_info?: {
    placa: string;
    numero_interno: string | null;
    marca: string | null;
    modelo: string | null;
    estado_operativo: string | null;
  };
  // Telemetría más reciente (si está disponible)
  recent_telemetry?: {
    timestamp_telemetry: string;
    ram_usage_gb: number | null;
    cpu_usage_percent: number | null;
    disk_usage_gb: number | null;
    disk_usage_percent: number | null;
    temperatura_celsius: number | null;
  };
}

export interface TelemetryRecord {
  id: string;
  id_hardware_jetson: string;
  timestamp_telemetry: string;
  ram_usage_gb: number | null;
  cpu_usage_percent: number | null;
  disk_usage_gb: number | null;
  disk_usage_percent: number | null;
  temperatura_celsius: number | null;
  created_at: string;
}

export type ConnectionStatus = 'Conectado' | 'Desconectado' | 'Mantenimiento';
export type HealthStatus = 'Operativo' | 'Advertencia' | 'Crítico' | 'Desconocido';