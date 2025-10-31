// src/app/dashboard-partner/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import KpiCard from '@/components/dashboard/KpiCard';
import AlertCard from '@/components/alerts/AlertCard';
import BusStatusCard from '@/components/partner/BusStatusCard';
import TopDriversCard from '@/components/partner/TopDriversCard';
import { mockPartnerDashboard } from '@/lib/mockData';
import { PartnerDashboardData } from '@/types/partner';

// Modal de Video
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  metadata?: {
    fecha: string;
    bus: string;
    conductor: string;
  };
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, title, metadata }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl animate-scale-in">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            {metadata && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {metadata.fecha}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  {metadata.bus}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {metadata.conductor}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
          <video
            className="absolute inset-0 w-full h-full"
            controls
            autoPlay
            src={videoUrl}
          >
            Tu navegador no soporta el elemento de video.
          </video>
        </div>

        {/* Footer con acciones */}
        <div className="flex items-center justify-end space-x-3 p-4 bg-gray-50 rounded-b-2xl">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            Descargar Video
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
            Crear Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Video Clip
interface VideoClipCardProps {
  id: string;
  thumbnail: string;
  titulo: string;
  fecha: string;
  bus: string;
  conductor: string;
  duracion: string;
  tipo: 'alerta' | 'cansancio' | 'riesgo'  ;
  onClick: () => void;
}

const VideoClipCard: React.FC<VideoClipCardProps> = ({
  thumbnail,
  titulo,
  fecha,
  bus,
  conductor,
  duracion,
  tipo,
  onClick
}) => {
  const tipoColors = {
    alerta: 'bg-red-100 text-red-700',
    cansancio: 'bg-orange-100 text-orange-700',
    riesgo: 'bg-green-100 text-green-700'
  };

  const tipoLabels = {
    alerta: 'Alerta',
    cansancio: 'Cansancio',
    riesgo: 'Riesgo'
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
    >
      {/* Thumbnail con overlay */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        <img
          src={thumbnail}
          alt={titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay oscuro en hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        {/* Badge de tipo */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tipoColors[tipo]}`}>
            {tipoLabels[tipo]}
          </span>
        </div>
        {/* Duración */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
            {duracion}
          </span>
        </div>
      </div>

      {/* Información del video */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {titulo}
        </h4>
        <div className="flex flex-col space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {fecha}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Bus {bus}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {conductor}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PartnerDashboardPage() {
  const [dashboardData, setDashboardData] = useState<PartnerDashboardData>(mockPartnerDashboard);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
    metadata?: {
      fecha: string;
      bus: string;
      conductor: string;
    };
  } | null>(null);

  // Videos de ejemplo (en producción vendrían de una API)
  const videoClips = [
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
      titulo: 'Alerta de Velocidad Excesiva - Ruta Centro',
      fecha: '30 Oct 2025, 14:30',
      bus: 'ABC-123',
      conductor: 'Carlos Méndez',
      duracion: '1:45',
      tipo: 'alerta' as const,
      videoUrl: '/videos/alerta-velocidad-1.mp4'
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
      titulo: 'Frenado Brusco Detectado',
      fecha: '30 Oct 2025, 13:15',
      bus: 'DEF-456',
      conductor: 'Ana García',
      duracion: '0:58',
      tipo: 'cansancio' as const,
      videoUrl: '/videos/frenado-brusco-1.mp4'
    },
    {
      id: '3',
      thumbnail: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400',
      titulo: 'Operación Normal - Revisión',
      fecha: '30 Oct 2025, 12:00',
      bus: 'GHI-789',
      conductor: 'Luis Rodríguez',
      duracion: '2:30',
      tipo: 'riesgo' as const,
      videoUrl: '/videos/operacion-normal-1.mp4'
    },
    {
      id: '4',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      titulo: 'Alerta de Fatiga del Conductor',
      fecha: '30 Oct 2025, 11:45',
      bus: 'JKL-012',
      conductor: 'Jorge Martínez',
      duracion: '1:20',
      tipo: 'alerta' as const,
      videoUrl: '/videos/alerta-fatiga-1.mp4'
    }
  ];

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('Actualizando datos del dashboard...');
      setDashboardData({ ...mockPartnerDashboard });
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDashboardData({ ...mockPartnerDashboard });
      setLoading(false);
    }, 1000);
  };

  const { socio_info, resumen, buses, alertas_recientes, conductores_destacados, metricas_hoy } = dashboardData;

  const alertasCriticas = alertas_recientes.filter(
    a => a.severidad === 'Crítica' && !a.atendida
  );

  // Calcular calificación promedio de conductores destacados
  const calificacionPromedio = conductores_destacados.length > 0
    ? conductores_destacados.reduce((sum, c) => sum + c.calificacion_mes, 0) / conductores_destacados.length
    : 0;

  return (
    <>
      <div className="space-y-8 animate-fade-in-up max-w-7xl mx-auto">
        {/* Header más limpio */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Dashboard de Socio
            </h1>
            <p className="text-gray-600">
              {socio_info.nombre} • {socio_info.empresa_nombre}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-600">{autoRefresh ? 'Live' : 'Pausado'}</span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="ml-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {autoRefresh ? 'Pausar' : 'Activar'}
              </button>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Actualizar"
            >
              <svg className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* KPIs - Grid más limpio con tipos correctos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Buses Operativos</p>
                <p className="text-3xl font-bold text-gray-900">{resumen.buses_operativos_ahora}</p>
                <p className="text-xs text-gray-500 mt-1">de {resumen.total_buses} total</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Conductores Activos</p>
                <p className="text-3xl font-bold text-gray-900">{resumen.conductores_activos_hoy}</p>
                <p className="text-xs text-gray-500 mt-1">Calificación: {calificacionPromedio.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Alertas Críticas</p>
                <p className="text-3xl font-bold text-red-600">{resumen.alertas_criticas_sin_atender}</p>
                <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Eficiencia Operativa</p>
                <p className="text-3xl font-bold text-green-600">{metricas_hoy.eficiencia_operativa.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">{metricas_hoy.total_km_recorridos.toFixed(1)} km hoy</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Video Clips */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Video Clips Recientes</h2>
              <p className="text-sm text-gray-600">Eventos capturados por las cámaras de tus buses</p>
            </div>
            <Link 
              href="/videos"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
            >
              Ver todos
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {videoClips.map((clip) => (
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

        {/* Buses Activos - Tabla más limpia */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Flota Activa</h2>
              <p className="text-sm text-gray-600">{resumen.buses_operativos_ahora} buses en operación</p>
            </div>
            <Link 
              href="/buses"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
            >
              Ver flota completa
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="space-y-3">
            {buses.slice(0, 5).map((bus) => (
              <BusStatusCard key={bus.id} bus={bus} />
            ))}
          </div>
        </div>

        {/* Alertas Recientes - Solo las críticas */}
        {alertasCriticas.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Alertas Críticas</h2>
                  <p className="text-sm text-red-600">{alertasCriticas.length} requieren atención inmediata</p>
                </div>
              </div>
              <Link 
                href="/alerts"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Ver Todas
              </Link>
            </div>

            <div className="space-y-3">
              {alertasCriticas.map((alerta) => (
                <AlertCard key={alerta.id} alert={alerta} />
              ))}
            </div>
          </div>
        )}

        {/* Conductores Destacados - Grid más compacto */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Conductores Destacados</h2>
              <p className="text-sm text-gray-600">Mejor desempeño del mes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          </div>
        </div>
      </div>

      {/* Modal de Video */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          metadata={selectedVideo.metadata}
        />
      )}
    </>
  );
}