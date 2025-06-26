// src/app/page.tsx
import Link from 'next/link';
import KpiCard from '@/components/dashboard/KpiCard';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Dashboard General
          </h1>
          <p className="text-gray-600 text-lg">
            Monitoreo en tiempo real de tu flota de vehículos
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"></div>
            <span>Sistema activo</span>
            <span className="mx-2">•</span>
            <span>Última actualización: hace 2 min</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Buses Activos" value="45" icon="bus" color="blue" />
        <KpiCard title="Conductores Monitoreando" value="38" icon="user" color="green" />
        <KpiCard title="Alertas Activas" value="5" icon="alert" color="red" />
        <KpiCard title="Promedio Calificación" value="8.7" unit="/10" icon="star" color="yellow" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alertas Recientes */}
        <div className="lg:col-span-2">
          <div className="card-modern p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Alertas Recientes</h2>
                <p className="text-gray-600">Monitoreo en tiempo real de eventos críticos</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse-soft"></div>
                <span className="text-sm text-gray-500">5 activas</span>
              </div>
            </div>

            {/* Lista de alertas */}
            <div className="space-y-4">
              {[
                { type: 'Fatiga', driver: 'Carlos Mendez', bus: 'BUS-001', time: '2 min', severity: 'high' },
                { type: 'Distracción', driver: 'Ana García', bus: 'BUS-015', time: '5 min', severity: 'medium' },
                { type: 'Velocidad', driver: 'Luis Torres', bus: 'BUS-008', time: '8 min', severity: 'low' },
              ].map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alert.severity === 'high'
                          ? 'bg-red-400'
                          : alert.severity === 'medium'
                          ? 'bg-yellow-400'
                          : 'bg-blue-400'
                      }`}
                    ></div>
                    <div>
                      <p className="font-semibold text-gray-800">{alert.type}</p>
                      <p className="text-sm text-gray-600">
                        {alert.driver} • {alert.bus}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">hace {alert.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link href="/alerts" className="btn-modern btn-primary inline-flex items-center space-x-2">
                <span>Ver todas las alertas</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Panel lateral con estadísticas */}
        <div className="space-y-6">
          <div className="card-modern p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Estadísticas Hoy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Viajes completados</span>
                <span className="font-bold text-gray-800">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Horas activas</span>
                <span className="font-bold text-gray-800">8.5h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Eficiencia promedio</span>
                <span className="font-bold text-green-600">94%</span>
              </div>
            </div>
          </div>

          <div className="card-modern p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Estado del Sistema</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Servidor principal</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Base de datos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">API externa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de Flota */}
      <div className="card-modern p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Estadísticas de Flota</h2>
            <p className="text-gray-600">Análisis de rendimiento y tendencias de tu flota</p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-modern bg-gray-100 text-gray-700 px-4 py-2 text-sm hover:bg-gray-200">
              7 días
            </button>
            <button className="btn-modern bg-gray-100 text-gray-700 px-4 py-2 text-sm hover:bg-gray-200">
              30 días
            </button>
          </div>
        </div>

        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Gráficos interactivos próximamente</p>
            <Link href="/reports" className="btn-modern btn-primary">
              Generar reportes detallados
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
