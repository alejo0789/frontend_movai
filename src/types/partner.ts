// src/types/partner.ts

export interface SocioInfo {
  nombre: string;
  email: string;
  empresa_nombre: string;
  empresa_id: string;
}

export interface BusStatusInfo {
  id: string;
  placa: string;
  numero_interno: string;
  estado_operativo: 'Operativo' | 'Mantenimiento' | 'Fuera de Servicio';
  conductor_actual: {
    nombre: string;
    cedula: string;
  } | null;
  sesion_activa: {
    id: string;
    inicio: string;
    km_recorridos: number;
    velocidad_actual: number;
  } | null;
  ubicacion_gps: string | null;
  ultima_alerta: {
    tipo: string;
    timestamp: string;
    severidad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  } | null;
}

export interface ConductorDestacado {
  id: string;
  nombre: string;
  cedula: string;
  foto_url: string | null;
  calificacion_mes: number;
  horas_conducidas_mes: number;
  alertas_mes: number;
}

export interface AlertaReciente {
  id: string;
  tipo: string;
  severidad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  conductor_nombre: string;
  bus_placa: string;
  timestamp: string;
  atendida: boolean;
  descripcion: string;
}

export interface MetricasHoy {
  total_km_recorridos: number;
  promedio_velocidad: number;
  total_alertas_generadas: number;
  eficiencia_operativa: number;
}

export interface ResumenDashboard {
  total_buses: number;
  buses_operativos_ahora: number;
  conductores_activos_hoy: number;
  alertas_criticas_sin_atender: number;
}

export interface PartnerDashboardData {
  socio_info: SocioInfo;
  resumen: ResumenDashboard;
  buses: BusStatusInfo[];
  alertas_recientes: AlertaReciente[];
  conductores_destacados: ConductorDestacado[];
  metricas_hoy: MetricasHoy;
}