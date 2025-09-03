// src/components/jetson/JetsonCard.tsx
'use client';
import React from 'react';
import { JetsonNano } from '@/types/jetson';

interface JetsonCardProps {
  jetson: JetsonNano;
  onViewTelemetry: () => void;
}

const JetsonCard: React.FC<JetsonCardProps> = ({ jetson, onViewTelemetry }) => {
  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Conectado':
        return 'text-green-600 bg-green-100';
      case 'Desconectado':
        return 'text-red-600 bg-red-100';
      case 'Mantenimiento':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para formatear tiempo relativo
  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Ahora';
      if (diffMins < 60) return `Hace ${diffMins}m`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `Hace ${diffHours}h`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `Hace ${diffDays}d`;
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para obtener el color de la métrica basado en el valor
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

  return (
    <div className="card-modern p-6 hover:shadow-lg transition-all duration-300 group">
      {/* Header con estado */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {jetson.id_hardware_jetson.substring(0, 8)}...
              </h3>
              <p className="text-sm text-gray-500">
                {jetson.bus_info?.placa || 'Sin bus asignado'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(jetson.estado_conexion)}`}>
            {jetson.estado_conexion}
          </span>
          <div className={`w-3 h-3 rounded-full ${
            jetson.estado_conexion === 'Conectado' 
              ? 'bg-green-400 animate-pulse' 
              : jetson.estado_conexion === 'Mantenimiento'
              ? 'bg-yellow-400'
              : 'bg-red-400'
          }`}></div>
        </div>
      </div>

      {/* Información del bus */}
      <div className="border-t border-gray-100 pt-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block">Bus asignado</span>
            <span className="font-medium text-gray-800">
              {jetson.bus_info?.placa || 'No asignado'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Número interno</span>
            <span className="font-medium text-gray-800">
              {jetson.bus_info?.numero_interno || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Estado salud</span>
            <span className="font-medium text-gray-800">
              {jetson.estado_salud || 'Desconocido'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block">Firmware</span>
            <span className="font-medium text-gray-800">
              {jetson.version_firmware || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Telemetría reciente */}
      {jetson.recent_telemetry ? (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Telemetría</h4>
            <span className="text-xs text-gray-500">
              {getTimeAgo(jetson.recent_telemetry.timestamp_telemetry)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">CPU:</span>
              <span className={`font-medium ${getMetricColor(jetson.recent_telemetry.cpu_usage_percent, 'cpu')}`}>
                {jetson.recent_telemetry.cpu_usage_percent?.toFixed(1) || 'N/A'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RAM:</span>
              <span className={`font-medium ${getMetricColor(
                jetson.recent_telemetry.ram_usage_gb ? (jetson.recent_telemetry.ram_usage_gb / 8) * 100 : null, 
                'ram'
              )}`}>
                {jetson.recent_telemetry.ram_usage_gb?.toFixed(1) || 'N/A'} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Disco:</span>
              <span className={`font-medium ${getMetricColor(jetson.recent_telemetry.disk_usage_percent, 'disk')}`}>
                {jetson.recent_telemetry.disk_usage_percent?.toFixed(1) || 'N/A'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temp:</span>
              <span className={`font-medium ${getMetricColor(jetson.recent_telemetry.temperatura_celsius, 'temp')}`}>
                {jetson.recent_telemetry.temperatura_celsius?.toFixed(1) || 'N/A'}°C
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="text-center text-sm text-gray-500">
            <svg className="w-6 h-6 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Sin datos de telemetría
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-gray-500 space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Última conexión:</span>
          <span>{getTimeAgo(jetson.ultima_conexion_cloud_at)}</span>
        </div>
        <div className="flex justify-between">
          <span>Última actualización:</span>
          <span>{getTimeAgo(jetson.last_updated_at)}</span>
        </div>
        <div className="flex justify-between">
          <span>Instalación:</span>
          <span>{formatDate(jetson.fecha_instalacion)}</span>
        </div>
      </div>

      {/* Botón para ver telemetría detallada */}
      <button
        onClick={onViewTelemetry}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium group-hover:bg-indigo-700"
      >
        Ver Telemetría Detallada
      </button>
    </div>
  );
};

export default JetsonCard;