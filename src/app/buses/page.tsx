'use client';

import React, { useState, useEffect } from 'react';
import KpiCard from '@/components/dashboard/KpiCard';
import Button from '@/components/common/Button';
// import { fetchApi } from '@/lib/api'; // Descomentado cuando implementes las llamadas API reales
import { API_ENDPOINTS } from '@/constants/appConfig';
import { BusResponse, BusEstadoOperativo } from '@/types/bus';
import { EmpresaResponse } from '@/types/company';

// --- Mock Data para desarrollo - Remover cuando implementes la API real ---
const mockBuses: BusResponse[] = [
  {
    id: '1',
    placa: 'ABC-1233',
    numero_interno: 'BUS-001',
    id_empresa: 'emp-1',
    marca: 'Mercedes-Benz',
    modelo: 'Citaro',
    anio_fabricacion: 2020,
    capacidad_pasajeros: 45,
    estado_operativo: 'Operativo',
    ultima_conexion_at: '2025-01-15T10:30:00Z',
    ubicacion_actual_gps: '4.6097,-74.0817',
    last_updated_at: '2025-01-15T10:30:00Z'
  },
  {
    id: '2',
    placa: 'DEF-456',
    numero_interno: 'BUS-002',
    id_empresa: 'emp-1',
    marca: 'Volvo',
    modelo: 'B7R',
    anio_fabricacion: 2019,
    capacidad_pasajeros: 50,
    estado_operativo: 'Mantenimiento',
    ultima_conexion_at: '2025-01-14T15:20:00Z',
    ubicacion_actual_gps: null,
    last_updated_at: '2025-01-15T08:15:00Z'
  },
  {
    id: '3',
    placa: 'GHI-789',
    numero_interno: 'BUS-003',
    id_empresa: 'emp-2',
    marca: 'Scania',
    modelo: 'K280',
    anio_fabricacion: 2021,
    capacidad_pasajeros: 42,
    estado_operativo: 'Operativo',
    ultima_conexion_at: '2025-01-15T11:00:00Z',
    ubicacion_actual_gps: '4.5981,-74.0758',
    last_updated_at: '2025-01-15T11:00:00Z'
  },
  {
    id: '4',
    placa: 'JKL-012',
    numero_interno: 'BUS-004',
    id_empresa: 'emp-2',
    marca: 'Mercedes-Benz',
    modelo: 'O500U',
    anio_fabricacion: 2018,
    capacidad_pasajeros: 48,
    estado_operativo: 'Fuera de Servicio',
    ultima_conexion_at: '2025-01-13T09:45:00Z',
    ubicacion_actual_gps: null,
    last_updated_at: '2025-01-14T16:30:00Z'
  },
  {
    id: '5',
    placa: 'MNO-345',
    numero_interno: 'BUS-005',
    id_empresa: 'emp-1',
    marca: 'Iveco',
    modelo: 'Daily',
    anio_fabricacion: 2022,
    capacidad_pasajeros: 35,
    estado_operativo: 'Operativo',
    ultima_conexion_at: '2025-01-15T10:45:00Z',
    ubicacion_actual_gps: '4.6283,-74.0641',
    last_updated_at: '2025-01-15T10:45:00Z'
  }
];

const mockCompanies: EmpresaResponse[] = [
  { id: 'emp-1', nombre_empresa: 'Transportes Urbanos S.A.', nit: '900123456-1' },
  { id: 'emp-2', nombre_empresa: 'Movilidad Moderna Ltda.', nit: '800987654-2' },
];

export default function BusesPage() {
  const [buses, setBuses] = useState<BusResponse[]>(mockBuses);
  const [companies, setCompanies] = useState<EmpresaResponse[]>(mockCompanies);
  const [filteredBuses, setFilteredBuses] = useState<BusResponse[]>(mockBuses);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<BusEstadoOperativo | ''>('');
  const [searchPlaca, setSearchPlaca] = useState<string>('');

  useEffect(() => {
    // En una aplicación real, aquí cargarías los datos iniciales
    // loadBusesData();
  }, []);

  useEffect(() => {
    // Aplicar filtros cuando cambien
    applyFilters();
  }, [selectedCompanyId, selectedStatus, searchPlaca, buses]);

  const loadBusesData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Implementación real:
      /*
      const companiesResponse = await fetchApi<EmpresaResponse[]>(API_ENDPOINTS.companies);
      if (companiesResponse.success && companiesResponse.data) {
        setCompanies(companiesResponse.data);
      }

      const busesResponse = await fetchApi<BusResponse[]>(API_ENDPOINTS.buses.base);
      if (busesResponse.success && busesResponse.data) {
        setBuses(busesResponse.data);
      } else {
        setError(busesResponse.message || 'Error al cargar buses.');
      }
      */
      
      // Por ahora, usando datos mock
      setBuses(mockBuses);
      setCompanies(mockCompanies);
    } catch (err: any) {
      console.error('Error loading buses:', err);
      setError(err.message || 'Error de red o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...buses];

    // Filtrar por empresa
    if (selectedCompanyId !== '') {
      filtered = filtered.filter(bus => bus.id_empresa === selectedCompanyId);
    }

    // Filtrar por estado operativo
    if (selectedStatus !== '') {
      filtered = filtered.filter(bus => bus.estado_operativo === selectedStatus);
    }

    // Filtrar por búsqueda de placa
    if (searchPlaca.trim() !== '') {
      filtered = filtered.filter(bus => 
        bus.placa.toLowerCase().includes(searchPlaca.toLowerCase()) ||
        bus.numero_interno.toLowerCase().includes(searchPlaca.toLowerCase())
      );
    }

    setFilteredBuses(filtered);
  };

  const handleFilterByCompany = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(e.target.value);
  };

  const handleFilterByStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as BusEstadoOperativo | '');
  };

  const handleClearFilters = () => {
    setSelectedCompanyId('');
    setSelectedStatus('');
    setSearchPlaca('');
  };

  // Calcular KPIs
  const totalBuses = buses.length;
  const operativeBuses = buses.filter(b => b.estado_operativo === 'Operativo').length;
  const maintenanceBuses = buses.filter(b => b.estado_operativo === 'Mantenimiento').length;
  const outOfServiceBuses = buses.filter(b => b.estado_operativo === 'Fuera de Servicio').length;

  const getStatusBadgeClass = (status: BusEstadoOperativo) => {
    switch (status) {
      case 'Operativo':
        return 'bg-green-100 text-green-800';
      case 'Mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fuera de Servicio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastConnection = (dateString: string | null | undefined) => {
    if (!dateString) return 'Sin conexión';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `Hace ${Math.floor(diffInMinutes / 60)} hrs`;
    } else {
      return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Encabezado de la página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Gestión de Buses
          </h1>
          <p className="text-gray-600 text-lg">
            Administra y monitorea toda la flota de vehículos del sistema.
          </p>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Buses" value={totalBuses.toString()} icon="bus" color="blue" />
        <KpiCard title="Operativos" value={operativeBuses.toString()} icon="bus" color="green" />
        <KpiCard title="Mantenimiento" value={maintenanceBuses.toString()} icon="alert" color="yellow" />
        <KpiCard title="Fuera de Servicio" value={outOfServiceBuses.toString()} icon="alert" color="red" />
      </div>

      {/* Sección de filtros */}
      <div className="card-modern p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          {/* Filtrar por Empresa */}
          <div>
            <label htmlFor="company-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Empresa:
            </label>
            <select
              id="company-filter"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={selectedCompanyId}
              onChange={handleFilterByCompany}
              disabled={loading}
            >
              <option value="">-- Todas las Empresas --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.nombre_empresa}
                </option>
              ))}
            </select>
          </div>

          {/* Filtrar por Estado */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Estado Operativo:
            </label>
            <select
              id="status-filter"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={selectedStatus}
              onChange={handleFilterByStatus}
              disabled={loading}
            >
              <option value="">-- Todos los Estados --</option>
              <option value="Operativo">Operativo</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Fuera de Servicio">Fuera de Servicio</option>
            </select>
          </div>

          {/* Buscar por Placa */}
          <div>
            <label htmlFor="placa-search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por Placa:
            </label>
            <input
              type="text"
              id="placa-search"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchPlaca}
              onChange={(e) => setSearchPlaca(e.target.value)}
              placeholder="Ej: ABC-123"
              disabled={loading}
            />
          </div>

          {/* Botón Limpiar Filtros */}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleClearFilters} disabled={loading}>
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md mt-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <strong>Error de conexión:</strong> {error}
                <div className="text-sm mt-1">
                  Verifica que el backend esté corriendo en {API_ENDPOINTS.buses.base}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resumen de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Mostrando {filteredBuses.length} de {totalBuses} buses
        </p>
      </div>

      {/* Lista de Buses */}
      <div className="card-modern p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Listado de Buses</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando buses...</span>
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-gray-600 mb-2">No se encontraron buses</p>
            <p className="text-gray-500">Intenta ajustar los filtros o agregar nuevos buses al sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bus
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Conexión
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuses.map((bus) => {
                  const company = companies.find(c => c.id === bus.id_empresa);
                  return (
                    <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{bus.placa}</div>
                          <div className="text-sm text-gray-500">{bus.numero_interno}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {company?.nombre_empresa || 'Empresa no encontrada'}
                        </div>
                        <div className="text-sm text-gray-500">{company?.nit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {bus.marca && bus.modelo ? `${bus.marca} ${bus.modelo}` : 'No especificado'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {bus.anio_fabricacion ? `Año ${bus.anio_fabricacion}` : 'Año no especificado'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(bus.estado_operativo)}`}>
                          {bus.estado_operativo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatLastConnection(bus.ultima_conexion_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bus.capacidad_pasajeros ? `${bus.capacidad_pasajeros} pasajeros` : 'No especificada'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}