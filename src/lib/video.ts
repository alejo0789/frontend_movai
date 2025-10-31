// Guía de Integración API para Videos
// src/lib/api/videos.ts

/**
 * API Service para gestión de video clips
 * Este archivo contiene las funciones necesarias para integrar
 * el dashboard con una API real de videos
 */

// ============================================
// TIPOS Y INTERFACES
// ============================================

export interface VideoClipAPI {
  id: string;
  thumbnail_url: string;
  video_url: string;
  title: string;
  description?: string;
  created_at: string;
  bus_id: string;
  bus_plate: string;
  driver_id: string;
  driver_name: string;
  duration_seconds: number;
  event_type: 'alerta' | 'incidente' | 'normal';
  severity?: 'baja' | 'media' | 'alta' | 'critica';
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  metadata?: {
    speed?: number;
    acceleration?: number;
    alert_type?: string;
    camera_id?: string;
  };
}

export interface VideoClipFilters {
  fecha_inicio?: string;
  fecha_fin?: string;
  bus_id?: string;
  driver_id?: string;
  event_type?: string[];
  severity?: string[];
  page?: number;
  limit?: number;
}

export interface VideoClipsResponse {
  videos: VideoClipAPI[];
  total: number;
  page: number;
  pages: number;
}

// ============================================
// CONFIGURACIÓN
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 segundos

// ============================================
// FUNCIONES DE API
// ============================================

/**
 * Obtener lista de video clips con filtros opcionales
 */
export async function getVideoClips(
  filters: VideoClipFilters = {}
): Promise<VideoClipsResponse> {
  try {
    const params = new URLSearchParams();
    
    // Agregar filtros a params
    if (filters.fecha_inicio) params.append('fecha_inicio', filters.fecha_inicio);
    if (filters.fecha_fin) params.append('fecha_fin', filters.fecha_fin);
    if (filters.bus_id) params.append('bus_id', filters.bus_id);
    if (filters.driver_id) params.append('driver_id', filters.driver_id);
    if (filters.event_type) params.append('event_type', filters.event_type.join(','));
    if (filters.severity) params.append('severity', filters.severity.join(','));
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(
      `${API_BASE_URL}/video-clips?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar token de autenticación si es necesario
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo video clips:', error);
    throw error;
  }
}

/**
 * Obtener un video clip específico por ID
 */
export async function getVideoClipById(id: string): Promise<VideoClipAPI> {
  try {
    const response = await fetch(`${API_BASE_URL}/video-clips/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error obteniendo video clip:', error);
    throw error;
  }
}

/**
 * Obtener video clips recientes (últimos 10)
 */
export async function getRecentVideoClips(): Promise<VideoClipAPI[]> {
  const response = await getVideoClips({ limit: 10, page: 1 });
  return response.videos;
}

/**
 * Obtener video clips por tipo de evento
 */
export async function getVideoClipsByType(
  type: 'alerta' | 'incidente' | 'normal'
): Promise<VideoClipAPI[]> {
  const response = await getVideoClips({ event_type: [type], limit: 20 });
  return response.videos;
}

/**
 * Descargar video clip
 */
export async function downloadVideoClip(id: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE_URL}/video-clips/${id}/download`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error descargando video');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error descargando video:', error);
    throw error;
  }
}

/**
 * Crear reporte basado en un video clip
 */
export async function createVideoReport(
  videoId: string,
  reportData: {
    title: string;
    description: string;
    include_metadata: boolean;
  }
): Promise<{ report_id: string; report_url: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/video-clips/${videoId}/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });

    if (!response.ok) {
      throw new Error('Error creando reporte');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creando reporte:', error);
    throw error;
  }
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Formatear duración de segundos a MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formatear fecha para mostrar
 */
export function formatVideoDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Transformar datos de API a formato del componente
 */
export function transformVideoClipForUI(apiVideo: VideoClipAPI) {
  return {
    id: apiVideo.id,
    thumbnail: apiVideo.thumbnail_url,
    titulo: apiVideo.title,
    fecha: formatVideoDate(apiVideo.created_at),
    bus: apiVideo.bus_plate,
    conductor: apiVideo.driver_name,
    duracion: formatDuration(apiVideo.duration_seconds),
    tipo: apiVideo.event_type,
    videoUrl: apiVideo.video_url
  };
}

// ============================================
// HOOK PERSONALIZADO
// ============================================

/**
 * Hook para cargar y gestionar video clips en componentes React
 */
import { useState, useEffect } from 'react';

export function useVideoClips(filters: VideoClipFilters = {}) {
  const [videos, setVideos] = useState<VideoClipAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVideoClips(filters);
      setVideos(response.videos);
      setPagination({
        page: response.page,
        pages: response.pages,
        total: response.total
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [JSON.stringify(filters)]);

  return {
    videos,
    loading,
    error,
    pagination,
    reload: loadVideos
  };
}

// ============================================
// EJEMPLO DE USO EN COMPONENTE
// ============================================

/*
// En tu componente del dashboard:

import { useVideoClips, transformVideoClipForUI } from '@/lib/api/videos';

export default function PartnerDashboardPage() {
  // Cargar videos recientes
  const { videos, loading, error, reload } = useVideoClips({ limit: 4 });
  
  // Transformar para UI
  const videoClipsForUI = videos.map(transformVideoClipForUI);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {videoClipsForUI.map((clip) => (
          <VideoClipCard
            key={clip.id}
            {...clip}
            onClick={() => setSelectedVideo({
              url: clip.videoUrl,
              title: clip.titulo,
              metadata: {
                fecha: clip.fecha,
                bus: clip.bus,
                conductor: clip.conductor
              }
            })}
          />
        ))}
      </div>
    </div>
  );
}
*/

// ============================================
// CONFIGURACIÓN DE WEBHOOKS (Opcional)
// ============================================

/**
 * Si tu sistema genera videos en tiempo real,
 * puedes configurar webhooks para notificar al dashboard
 */

export interface VideoWebhookPayload {
  event: 'video.created' | 'video.processed' | 'video.deleted';
  video: VideoClipAPI;
  timestamp: string;
}

/**
 * Handler para webhooks de videos
 */
export async function handleVideoWebhook(
  payload: VideoWebhookPayload,
  onVideoCreated?: (video: VideoClipAPI) => void
) {
  switch (payload.event) {
    case 'video.created':
      console.log('Nuevo video creado:', payload.video.id);
      if (onVideoCreated) {
        onVideoCreated(payload.video);
      }
      break;
    
    case 'video.processed':
      console.log('Video procesado:', payload.video.id);
      break;
    
    case 'video.deleted':
      console.log('Video eliminado:', payload.video.id);
      break;
  }
}

// ============================================
// SISTEMA DE CACHE (Opcional pero recomendado)
// ============================================

class VideoCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutos

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const videoCache = new VideoCache();

// ============================================
// NOTAS DE IMPLEMENTACIÓN
// ============================================

/*
ENDPOINTS ESPERADOS EN TU API:

GET /api/video-clips
  - Lista paginada de videos con filtros
  - Query params: fecha_inicio, fecha_fin, bus_id, driver_id, event_type, etc.
  
GET /api/video-clips/:id
  - Detalle de un video específico
  
GET /api/video-clips/:id/download
  - Descargar archivo de video
  
POST /api/video-clips/:id/report
  - Crear reporte basado en video
  
DELETE /api/video-clips/:id
  - Eliminar video (opcional)

AUTENTICACIÓN:
- Implementar JWT o session-based auth
- Incluir token en header Authorization
- Manejar refresh tokens

SEGURIDAD:
- Validar permisos de acceso por socio
- Limitar rate de descargas
- Validar tamaños de archivo
- Sanitizar inputs

PERFORMANCE:
- Implementar paginación
- Usar CDN para videos
- Comprimir videos automáticamente
- Generar thumbnails automáticamente
- Lazy loading de videos

ALMACENAMIENTO:
- AWS S3 / Google Cloud Storage para videos
- Base de datos para metadata
- Redis para cache (opcional)
*/

export default {
  getVideoClips,
  getVideoClipById,
  getRecentVideoClips,
  getVideoClipsByType,
  downloadVideoClip,
  createVideoReport,
  formatDuration,
  formatVideoDate,
  transformVideoClipForUI,
  useVideoClips,
  videoCache
};