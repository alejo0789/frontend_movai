// src/components/partner/TopDriversCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ConductorDestacado } from '@/types/partner';

interface TopDriversCardProps {
  drivers: ConductorDestacado[];
}

const TopDriversCard: React.FC<TopDriversCardProps> = ({ drivers }) => {
  // Función para obtener el color del badge según la calificación
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'bg-green-100 text-green-800';
    if (rating >= 8) return 'bg-blue-100 text-blue-800';
    if (rating >= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Función para obtener el badge de posición
  const getPositionBadge = (index: number) => {
    const badges = [
      { icon: '🥇', class: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      { icon: '🥈', class: 'bg-gray-100 text-gray-800 border-gray-300' },
      { icon: '🥉', class: 'bg-orange-100 text-orange-800 border-orange-300' },
    ];
    return badges[index] || { icon: `#${index + 1}`, class: 'bg-blue-100 text-blue-800 border-blue-300' };
  };

  return (
    <div className="card-modern p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Conductores Destacados</h3>
        <div className="flex items-center space-x-1 text-yellow-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-gray-600">Este Mes</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Los {drivers.length} mejores conductores por desempeño y seguridad
      </p>

      <div className="space-y-3">
        {drivers.map((driver, index) => {
          const positionBadge = getPositionBadge(index);
          return (
            <div
              key={driver.id}
              className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
            >
              {/* Header con posición y nombre */}
              <div className="flex items-center space-x-3 mb-3">
                {/* Badge de posición */}
                <div className={`w-10 h-10 rounded-full border-2 ${positionBadge.class} flex items-center justify-center font-bold text-sm shadow-sm`}>
                  {positionBadge.icon}
                </div>

                {/* Foto y nombre */}
                <div className="flex-1 flex items-center space-x-3">
                  {driver.foto_url ? (
                    <Image
                      src={driver.foto_url}
                      alt={driver.nombre}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {driver.nombre.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {driver.nombre}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Cédula: {driver.cedula}
                    </p>
                  </div>
                </div>

                {/* Calificación */}
                <div className={`px-3 py-1 rounded-full ${getRatingColor(driver.calificacion_mes)} font-bold text-sm`}>
                  {driver.calificacion_mes.toFixed(1)}
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Horas</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {driver.horas_conducidas_mes}h
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    driver.alertas_mes === 0 
                      ? 'bg-green-100' 
                      : driver.alertas_mes <= 3 
                      ? 'bg-yellow-100' 
                      : 'bg-red-100'
                  }`}>
                    <svg className={`w-4 h-4 ${
                      driver.alertas_mes === 0 
                        ? 'text-green-600' 
                        : driver.alertas_mes <= 3 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l7.964 14.172c.766 1.36-.191 3.06-1.743 3.06H2.035c-1.552 0-2.509-1.7-1.743-3.06L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Alertas</div>
                    <div className={`text-sm font-semibold ${
                      driver.alertas_mes === 0 
                        ? 'text-green-600' 
                        : driver.alertas_mes <= 3 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {driver.alertas_mes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer con acción */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center space-x-1 transition-colors">
          <span>Ver todos los conductores</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopDriversCard;