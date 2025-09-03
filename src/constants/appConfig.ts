// src/constants/appConfig.ts

// Accedemos a las variables de entorno. Next.js las expone a través de process.env
const BACKEND_BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";
const JWT_SECRET: string = process.env.NEXT_PUBLIC_JWT_SECRET || "fallback_secret"; // Por si lo implementamos después

export const API_BASE_URL = BACKEND_BASE_URL;

// Rutas de los endpoints de tu API. Se construirán a partir de API_BASE_URL.
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/v1/auth/login/`,
  },
  companies: `${API_BASE_URL}/api/v1/empresas/`,
  buses: {
    base: `${API_BASE_URL}/api/v1/buses/`,
    byPlaca: `${API_BASE_URL}/api/v1/buses/by_placa/`,
    drivers: (busId: string) => `${API_BASE_URL}/api/v1/buses/${busId}/drivers`,
  },
  drivers: {
    base: `${API_BASE_URL}/api/v1/conductores/`,
    byCedula: `${API_BASE_URL}/api/v1/conductores/by_cedula/`,
    qr: (driverId: string) => `${API_BASE_URL}/api/v1/conductores/${driverId}/qr`,
  },
  jetsonNanos: {
    base: `${API_BASE_URL}/api/v1/jetson-nanos/`,
    telemetry: `${API_BASE_URL}/api/v1/jetson-nanos/telemetry`,
    recentTelemetry: (hardwareId: string) => `${API_BASE_URL}/api/v1/jetson-nanos/${hardwareId}/telemetry/recent`,
    telemetryHistory: (hardwareId: string) => `${API_BASE_URL}/api/v1/jetson-nanos/${hardwareId}/telemetry/history`,
    byHardwareId: (hardwareId: string) => `${API_BASE_URL}/api/v1/jetson-nanos/${hardwareId}`,
  },
  trainingData: {
    videos: `${API_BASE_URL}/api/v1/training-data/videos/`,
    images: (videoId: string) => `${API_BASE_URL}/api/v1/training-data/images/${videoId}`,
  },
  sessions: {
    base: `${API_BASE_URL}/api/v1/sesiones-conduccion/`,
    byJetsonId: (jetsonSessionId: string) => `${API_BASE_URL}/api/v1/sesiones-conduccion/by_jetson_id/${jetsonSessionId}`,
    active: `${API_BASE_URL}/api/v1/sesiones-conduccion/active`,
    byBus: (busId: string) => `${API_BASE_URL}/api/v1/sesiones-conduccion/by_bus/${busId}`,
    byConductor: (driverId: string) => `${API_BASE_URL}/api/v1/sesiones-conduccion/by_conductor/${driverId}`,
  },
  events: {
    base: `${API_BASE_URL}/api/v1/eventos/`,
    recent: `${API_BASE_URL}/api/v1/eventos/recent/`,
    byBus: (busId: string) => `${API_BASE_URL}/api/v1/eventos/?bus_id=${busId}`, // Ejemplo con query param
    byConductor: (driverId: string) => `${API_BASE_URL}/api/v1/eventos/?conductor_id=${driverId}`,
    bySession: (sessionId: string) => `${API_BASE_URL}/api/v1/eventos/?session_id=${sessionId}`,
  },
  alerts: {
    base: `${API_BASE_URL}/api/v1/alertas/`,
    active: `${API_BASE_URL}/api/v1/alertas/active`,
  },
  users: {
    base: `${API_BASE_URL}/api/v1/users/`,
    byUsername: (username: string) => `${API_BASE_URL}/api/v1/users/by_username?username=${username}`,
  },
  
  // Añade más endpoints aquí a medida que los implementes en el backend
};

// Otras constantes de la aplicación (roles, límites de paginación por defecto, etc.)
export const APP_CONSTANTS = {
  PAGINATION_LIMIT_DEFAULT: 10,
  ROLES: {
    ADMIN_GLOBAL: "Administrador Global",
    ADMIN_EMPRESA: "Administrador Empresa",
    SOCIO: "Socio",
  },
  JETSON_STATUS: {
    CONNECTED: "Conectado",
    DISCONNECTED: "Desconectado",
    MAINTENANCE: "Mantenimiento",
  },
  TELEMETRY_THRESHOLDS: {
    CPU_WARNING: 70,
    CPU_CRITICAL: 85,
    RAM_WARNING: 70,
    RAM_CRITICAL: 85,
    DISK_WARNING: 70,
    DISK_CRITICAL: 85,
    TEMP_WARNING: 65,
    TEMP_CRITICAL: 80,
  },
  // Añade más constantes aquí
};