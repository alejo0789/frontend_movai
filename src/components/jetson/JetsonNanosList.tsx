// src/components/jetson/JetsonNanosList.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/constants/appConfig';
import JetsonCard from './JetsonCard';
import JetsonTelemetryModal from './JetsonTelemetryModal';

interface JetsonNano {
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

const JetsonNanosList: React.FC = () => {
  const [jetsonNanos, setJetsonNanos] = useState<JetsonNano[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJetson, setSelectedJetson] = useState<JetsonNano | null>(null);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Función para obtener todos los Jetson Nanos (simplificada ya que el backend incluye bus_info)
  const fetchJetsonNanos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/jetson-nanos/`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Para cada Jetson, solo necesitamos obtener telemetría (bus_info ya viene incluida)
      const jetsonsWithTelemetry = await Promise.all(
        data.map(async (jetson: JetsonNano) => {
          const updatedJetson = { ...jetson };
          
          // Obtener telemetría más reciente
          try {
            const telemetryResponse = await fetch(
              `${API_BASE_URL}/api/v1/jetson-nanos/${jetson.id_hardware_jetson}/telemetry/recent`
            );
            if (telemetryResponse.ok) {
              const telemetryData = await telemetryResponse.json();
              updatedJetson.recent_telemetry = telemetryData;
            }
          } catch (e) {
            console.warn(`No se pudo obtener telemetría para Jetson ${jetson.id_hardware_jetson}`);
          }
          
          return updatedJetson;
        })
      );
      
      setJetsonNanos(jetsonsWithTelemetry);
      setError(null);
    } catch (err) {
      console.error('Error fetching Jetson Nanos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchJetsonNanos();

    // Configurar actualización automática cada 30 segundos
    const interval = setInterval(fetchJetsonNanos, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Función para abrir modal de telemetría
  const handleViewTelemetry = (jetson: JetsonNano) => {
    setSelectedJetson(jetson);
    setShowTelemetryModal(true);
  };

  // Función para cerrar modal
  const handleCloseModal = () => {
    setSelectedJetson(null);
    setShowTelemetryModal(false);
  };

  // Función manual de refresh
  const handleRefresh = () => {
    setLoading(true);
    fetchJetsonNanos();
  };

  if (loading && jetsonNanos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dispositivos Jetson Nano...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-modern p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar datos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de herramientas */}
      <div className="card-modern p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{jetsonNanos.length}</span> dispositivos encontrados
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {jetsonNanos.filter(j => j.estado_conexion === 'Conectado').length} conectados
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {jetsonNanos.filter(j => j.estado_conexion === 'Desconectado').length} desconectados
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {jetsonNanos.filter(j => j.estado_conexion === 'Mantenimiento').length} mantenimiento
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <svg 
                className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid de tarjetas de Jetson Nanos */}
      {jetsonNanos.length === 0 ? (
        <div className="card-modern p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay dispositivos registrados</h3>
          <p className="text-gray-600">No se encontraron dispositivos Jetson Nano en el sistema.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jetsonNanos.map((jetson) => (
            <JetsonCard
              key={jetson.id}
              jetson={jetson}
              onViewTelemetry={() => handleViewTelemetry(jetson)}
            />
          ))}
        </div>
      )}

      {/* Modal de telemetría */}
      {showTelemetryModal && selectedJetson && (
        <JetsonTelemetryModal
          jetson={selectedJetson}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default JetsonNanosList;