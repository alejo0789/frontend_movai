// src/components/partner/BusStatusCard.tsx
'use client';

import React from 'react';
import { BusStatusInfo } from '@/types/partner';

interface BusStatusCardProps {
  bus: BusStatusInfo;
}

const BusStatusCard: React.FC<BusStatusCardProps> = ({ bus }) => {
  // Función para formatear tiempo transcurrido
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`;
    return `${Math.floor(diffHours / 24)}d ${diffHours % 24}h`;
  };

  // Función para obtener color de severidad
  const getSeverityColor = (severidad: string) => {
    switch (severidad) {
      case 'Crítica':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Alta':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baja':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        {/* Info del Bus */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10M7.5 17A1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 14 1.5 1.5 0 019 15.5 1.5 1.5 0 017.5 17m9 0A1.5 1.5 0 0115 15.5 1.5 1.5 0 0116.5 14 1.5 1.5 0 0118 15.5 1.5 1.5 0 0116.5 17M5 11V6h14v5H5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-800">{bus.placa}</h3>
              <span className="text-sm text-gray-500">{bus.numero_interno}</span>
            </div>
            {bus.conductor_actual ? (
              <p className="text-sm text-gray-600">
                {bus.conductor_actual.nombre}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">Sin conductor asignado</p>
            )}
          </div>
        </div>

        {/* Estado de Conexión */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            bus.estado_operativo === 'Operativo' 
              ? 'bg-green-400 animate-pulse' 
              : 'bg-gray-400'
          }`}></div>
          <span className={`text-xs font-medium ${
            bus.estado_operativo === 'Operativo' 
              ? 'text-green-600' 
              : 'text-gray-500'
          }`}>
            En línea
          </span>
        </div>
      </div>

      {/* Métricas de la Sesión Activa */}
      {bus.sesion_activa ? (
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Tiempo</div>
            <div className="text-sm font-semibold text-gray-800">
              {getTimeAgo(bus.sesion_activa.inicio)}
            </div>
          </div>
          <div className="text-center border-l border-r border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Km Recorridos</div>
            <div className="text-sm font-semibold text-gray-800">
              {bus.sesion_activa.km_recorridos.toFixed(1)} km
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Velocidad</div>
            <div className="text-sm font-semibold text-gray-800">
              {bus.sesion_activa.velocidad_actual} km/h
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3 mb-3 text-center">
          <p className="text-sm text-gray-500">Sin sesión activa</p>
        </div>
      )}

      {/* Última Alerta */}
      {bus.ultima_alerta ? (
        <div className={`border rounded-lg p-3 ${getSeverityColor(bus.ultima_alerta.severidad)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l7.964 14.172c.766 1.36-.191 3.06-1.743 3.06H2.035c-1.552 0-2.509-1.7-1.743-3.06L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{bus.ultima_alerta.tipo}</span>
            </div>
            <span className="text-xs">
              Hace {getTimeAgo(bus.ultima_alerta.timestamp)}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-green-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Sin alertas recientes</span>
          </div>
        </div>
      )}

      {/* Botón Ver Detalles */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center space-x-1 transition-colors">
          <span>Ver detalles completos</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BusStatusCard;