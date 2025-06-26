// src/types/driver.ts

export interface DriverData {
  cedula: string;
  nombre_completo: string;
  id_empresa: string; // UUID de la empresa a la que pertenece
  fecha_nacimiento?: string; // Formato ISO string (YYYY-MM-DD)
  telefono_contacto?: string;
  email?: string;
  licencia_conduccion?: string;
  tipo_licencia?: string;
  fecha_expiracion_licencia?: string; // Formato ISO string (YYYY-MM-DD)
  activo?: boolean; // Por defecto true en backend
}

export interface DriverResponse {
  id: string; // UUID
  cedula: string;
  nombre_completo: string;
  id_empresa: string;
  fecha_nacimiento: string | null;
  telefono_contacto: string | null;
  email: string | null;
  licencia_conduccion: string | null;
  tipo_licencia: string | null;
  fecha_expiracion_licencia: string | null;
  activo: boolean;
  codigo_qr_hash: string | null; // El hash generado por el backend
  foto_perfil_url: string | null; // URL a la foto de perfil del conductor
  id_video_entrenamiento_principal: string | null; // UUID del video de entrenamiento principal
  last_updated_at: string;
}

export interface QrResponse {
  message: string;
  qr_image_url: string; // URL donde se puede descargar la imagen del QR
}

export interface VideoTrainingResponse {
  id: string; // UUID del video de entrenamiento
  id_conductor: string;
  url_video_original: string; // URL del video original subido
  estado_procesamiento: string; // Ej. "Procesado"
  uploaded_at: string; // Fecha de subida
}

export interface ImageTrainingResponse {
  id: string;
  id_video_entrenamiento: string;
  url_imagen: string; // URL de la imagen (frame)
  es_principal: boolean;
  bounding_box_json: any; // JSON object with bbox
  caracteristicas_faciales_embedding: number[]; // Array de números
}