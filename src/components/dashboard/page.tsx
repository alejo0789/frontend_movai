// src/app/partner-dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import KpiCard from '@/components/dashboard/KpiCard';
import AlertCard from '@/components/alerts/AlertCard';
import BusStatusCard from '@/components/partner/BusStatusCard';
import TopDriversCard from '@/components/partner/TopDriversCard';
import { mockPartnerDashboard } from '@/lib/mockData';
import { PartnerDashboardData } from '@/types/partner';

export default function PartnerDashboardPage() {
  const [dashboardData, setDashboardData] = useState<PartnerDashboardData>(mockPartnerDashboard);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulación de actualización automática cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // En producción, aquí harías una llamada a la API real
      console.log('Actualizando datos del dashboard...');
      setDashboardData({ ...mockPartnerDashboard });
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      setDashboardData({ ...mockPartnerDashboard });
      setLoading(false);
    }, 1000);
  };

  const { socio_info, resumen, buses, alertas_recientes, conductores_destacados, metricas_hoy } = dashboardData;

  // Filtrar alertas críticas sin atender
  const alertasCriticas = alertas_recientes.filter(
    a => a.severidad === 'Crítica' && !a.atendida
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Dashboard de Socio
          </h1>
          <p className="text-gray-600 text-lg">
            Bienvenido, {socio_info.nombre} • {socio_info.empresa_nombre}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{autoRefresh ? 'Actualización automática' : 'Manual'}</span>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {autoRefresh ? 'Pausar' : 'Activar'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Buses" 
          value={resumen.total_buses.toString()} 
          icon="bus" 
          color="blue" 
        />
        <KpiCard 
          title="Buses Operativos Ahora" 
          value={resumen.buses_operativos_ahora.toString()} 
          icon="bus" 
          color="green" 
        />
        <KpiCard 
          title="Conductores Activos Hoy" 
          value={resumen.conductores_activos_hoy.toString()} 
          icon="user" 
          color="blue" 
        />
        <KpiCard 
          title="Alertas Críticas Sin Atender" 
          value={resumen.alertas_criticas_sin_atender.toString()} 
          icon="alert" 
          color="red" 
        />
      </div>

      {/* Alertas Críticas que Requieren Atención Inmediata */}
      {alertasCriticas.length > 0 && (
        <div className="card-modern p-6 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l7.964 14.172c.766 1.36-.191 3.06-1.743 3.06H2.035c-1.552 0-2.509-1.7-1.743-3.06L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-red-800">
                ¡Atención Inmediata Requerida!
              </h2>
              <p className="text-red-600">
                {alertasCriticas.length} alerta{alertasCriticas.length > 1 ? 's' : ''} crítica{alertasCriticas.length > 1 ? 's' : ''} sin atender
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {alertasCriticas.map((alerta) => (
              <AlertCard key={alerta.id} alert={alerta} compact />
            ))}
          </div>
          <div className="mt-4">
            <Link 
              href="/alerts" 
              className="btn-modern bg-red-600 text-white px-6 py-2 hover:bg-red-700 inline-flex items-center space-x-2"
            >
              <span>Ver Todas las Alertas</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Estado de Buses en Tiempo Real */}
        <div className="lg:col-span-2">
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Estado de Buses en Tiempo Real
                </h2>
                <p className="text-gray-600">
                  Monitoreo activo de tu flota de vehículos
                </p>
              </div>
              <Link 
                href="/partner-dashboard/buses"
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Ver Todos →
              </Link>
            </div>

            <div className="space-y-4">
              {buses.filter(b => b.estado_operativo === 'Operativo').map((bus) => (
                <BusStatusCard key={bus.id} bus={bus} />
              ))}
              
              {buses.filter(b => b.estado_operativo !== 'Operativo').length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Buses fuera de servicio:</p>
                  {buses.filter(b => b.estado_operativo !== 'Operativo').map((bus) => (
                    <div key={bus.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-700">{bus.placa}</span>
                        <span className="text-sm text-gray-500">{bus.numero_interno}</span>
                      </div>
                      <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        {bus.estado_operativo}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Conductores Destacados */}
          <TopDriversCard drivers={conductores_destacados} />

          {/* Métricas del Día */}
          <div className="card-modern p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Métricas de Hoy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Kilómetros Recorridos</span>
                <span className="font-bold text-gray-800">{metricas_hoy.total_km_recorridos.toFixed(1)} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Velocidad Promedio</span>
                <span className="font-bold text-gray-800">{metricas_hoy.promedio_velocidad.toFixed(1)} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Alertas Generadas</span>
                <span className="font-bold text-red-600">{metricas_hoy.total_alertas_generadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Eficiencia Operativa</span>
                <span className="font-bold text-green-600">{metricas_hoy.eficiencia_operativa.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="card-modern p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Link 
                href="/partner-dashboard/reports"
                className="w-full btn-modern bg-gray-100 text-gray-700 px-4 py-2 hover:bg-gray-200 flex items-center justify-between"
              >
                <span>Generar Reporte</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Link>
              <Link 
                href="/alerts"
                className="w-full btn-modern bg-gray-100 text-gray-700 px-4 py-2 hover:bg-gray-200 flex items-center justify-between"
              >
                <span>Ver Todas las Alertas</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </Link>
              <Link 
                href="/partner-dashboard/drivers"
                className="w-full btn-modern bg-gray-100 text-gray-700 px-4 py-2 hover:bg-gray-200 flex items-center justify-between"
              >
                <span>Gestionar Conductores</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Alertas Recientes */}
      <div className="card-modern p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Alertas Recientes
            </h2>
            <p className="text-gray-600">
              Últimas {alertas_recientes.length} alertas registradas en el sistema
            </p>
          </div>
          <Link 
            href="/alerts"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Ver Todas →
          </Link>
        </div>

        <div className="space-y-3">
          {alertas_recientes.map((alerta) => (
            <AlertCard key={alerta.id} alert={alerta} />
          ))}
        </div>
      </div>
    </div>
  );
}