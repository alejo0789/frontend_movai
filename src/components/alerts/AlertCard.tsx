// src/components/alerts/AlertCard.tsx
'use client';

import React from 'react';
import { AlertaReciente } from '@/types/partner';

interface AlertCardProps {
  alert: AlertaReciente;
  compact?: boolean;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, compact = false }) => {
  // Función para obtener el color según la severidad
  const getSeverityStyles = (severidad: string) => {
    switch (severidad) {
      case 'Crítica':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-100 text-red-800',
          icon: 'text-red-600',
        };
      case 'Alta':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          badge: 'bg-orange-100 text-orange-800',
          icon: 'text-orange-600',
        };
      case 'Media':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badge: 'bg-yellow-100 text-yellow-800',
          icon: 'text-yellow-600',
        };
      case 'Baja':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800',
          icon: 'text-blue-600',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          badge: 'bg-gray-100 text-gray-800',
          icon: 'text-gray-600',
        };
    }
  };

  // Función para formatear el tiempo
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays}d`;
  };

  const styles = getSeverityStyles(alert.severidad);

  if (compact) {
    // Versión compacta para alertas críticas
    return (
      <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`w-10 h-10 rounded-full ${styles.badge} flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-5 h-5 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l7.964 14.172c.766 1.36-.191 3.06-1.743 3.06H2.035c-1.552 0-2.509-1.7-1.743-3.06L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-semibold ${styles.text}`}>{alert.tipo}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                  {alert.severidad}
                </span>
              </div>
              <p className={`text-sm ${styles.text} mb-2`}>
                {alert.descripcion}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <span className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>{alert.conductor_nombre}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10M7.5 17A1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 14 1.5 1.5 0 019 15.5 1.5 1.5 0 017.5 17m9 0A1.5 1.5 0 0115 15.5 1.5 1.5 0 0116.5 14 1.5 1.5 0 0118 15.5 1.5 1.5 0 0116.5 17M5 11V6h14v5H5z" />
                  </svg>
                  <span>{alert.bus_placa}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="text-right ml-4">
            <span className="text-xs text-gray-500">{getTimeAgo(alert.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Versión normal
  return (
    <div className={`${styles.bg} border ${styles.border} rounded-lg p-4 hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`w-12 h-12 rounded-lg ${styles.badge} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <svg className={`w-6 h-6 ${styles.icon}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l7.964 14.172c.766 1.36-.191 3.06-1.743 3.06H2.035c-1.552 0-2.509-1.7-1.743-3.06L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`text-lg font-bold ${styles.text}`}>{alert.tipo}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles.badge}`}>
                {alert.severidad}
              </span>
              {alert.atendida && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Atendida
                </span>
              )}
            </div>
            <p className={`text-sm ${styles.text} mb-3`}>
              {alert.descripcion}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>{alert.conductor_nombre}</span>
              </span>
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10M7.5 17A1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 14 1.5 1.5 0 019 15.5 1.5 1.5 0 017.5 17m9 0A1.5 1.5 0 0115 15.5 1.5 1.5 0 0116.5 14 1.5 1.5 0 0118 15.5 1.5 1.5 0 0116.5 17M5 11V6h14v5H5z" />
                </svg>
                <span>{alert.bus_placa}</span>
              </span>
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{getTimeAgo(alert.timestamp)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      {!alert.atendida && (
        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-200">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Ver Detalles
          </button>
          <button className={`px-4 py-2 ${styles.badge} rounded-lg hover:opacity-80 transition-opacity text-sm font-medium`}>
            Marcar como Atendida
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertCard;