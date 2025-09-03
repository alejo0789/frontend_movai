// src/components/jetson/JetsonTelemetryModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/constants/appConfig';

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
}

interface TelemetryRecord {
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

interface JetsonTelemetryModalProps {
  jetson: JetsonNano;
  onClose: () => void;
}

const JetsonTelemetryModal: React.FC<JetsonTelemetryModalProps> = ({ jetson, onClose }) => {
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  // Función para obtener historial de telemetría
  const fetchTelemetryHistory = async (page: number = 0, append: boolean = false) => {
    try {
      setLoading(true);
      const skip = page * limit;
      const response = await fetch(
        `${API_BASE_URL}/api/v1/jetson-nanos/${jetson.id_hardware_jetson}/telemetry/history?skip=${skip}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (append) {
        setTelemetryHistory(prev => [...prev, ...data]);
      } else {
        setTelemetryHistory(data);
      }
      
      setHasMore(data.length === limit);
      setError(null);
    } catch (err) {
      console.error('Error fetching telemetry history:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetryHistory();
  }, [jetson.id_hardware_jetson]);

  // Función para cargar más datos
  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchTelemetryHistory(nextPage, true);
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para obtener el color de la métrica
  const getMetricColor = (value: number | null, type: 'cpu' | 'ram' | 'disk' | 'temp') => {
    if (value === null) return 'text-gray-400';
    
    switch (type) {
      case 'cpu':
      case 'ram':
      case 'disk':
        if (value > 85) return 'text-red-600';
        if (value > 70) return 'text-yellow-600';
        return 'text-green-600';
      case 'temp':
        if (value > 80) return 'text-red-600';
        if (value > 65) return 'text-yellow-600';
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Función para cerrar modal con escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Telemetría Detallada
              </h2>
              <p className="text-indigo-100">
                Jetson: {jetson.id_hardware_jetson.substring(0, 12)}... • Bus: {jetson.bus_info?.placa || 'No asignado'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-indigo-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Estado actual */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Estado Actual</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    jetson.estado_conexion === 'Conectado'
                      ? 'text-green-600 bg-green-100' 
                      : jetson.estado_conexion === 'Mantenimiento'
                      ? 'text-yellow-600 bg-yellow-100'
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {jetson.estado_conexion}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Última Conexión</span>
                  <span className="text-sm font-medium text-gray-800">
                    {jetson.ultima_conexion_cloud_at 
                      ? formatDate(jetson.ultima_conexion_cloud_at)
                      : 'Nunca'
                    }
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Firmware</span>
                  <span className="text-sm font-medium text-gray-800">
                    {jetson.version_firmware || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bus Asignado</span>
                  <span className="text-sm font-medium text-gray-800">
                    {jetson.bus_info?.placa || 'No asignado'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Historial de telemetría */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Historial de Telemetría</h3>
            
            {loading && telemetryHistory.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600">Cargando historial...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <svg className="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600">{error}</p>
              </div>
            ) : telemetryHistory.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-700 mb-1">Sin datos de telemetría</h4>
                <p className="text-gray-500">No se encontraron registros para este dispositivo.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {telemetryHistory.map((record, index) => (
                  <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Registro #{telemetryHistory.length - index}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(record.timestamp_telemetry)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">CPU</div>
                        <div className={`text-lg font-semibold ${getMetricColor(record.cpu_usage_percent, 'cpu')}`}>
                          {record.cpu_usage_percent?.toFixed(1) || 'N/A'}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">RAM</div>
                        <div className={`text-lg font-semibold ${getMetricColor(
                          record.ram_usage_gb ? (record.ram_usage_gb / 8) * 100 : null, 
                          'ram'
                        )}`}>
                          {record.ram_usage_gb?.toFixed(1) || 'N/A'} GB
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Disco</div>
                        <div className={`text-lg font-semibold ${getMetricColor(record.disk_usage_percent, 'disk')}`}>
                          {record.disk_usage_percent?.toFixed(1) || 'N/A'}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Temperatura</div>
                        <div className={`text-lg font-semibold ${getMetricColor(record.temperatura_celsius, 'temp')}`}>
                          {record.temperatura_celsius?.toFixed(1) || 'N/A'}°C
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Botón cargar más */}
                {hasMore && (
                  <div className="text-center pt-4">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Cargando...</span>
                        </div>
                      ) : (
                        'Cargar Más'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JetsonTelemetryModal;