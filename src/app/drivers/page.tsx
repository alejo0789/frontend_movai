// src/app/drivers/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import KpiCard from '@/components/dashboard/KpiCard';
import Button from '@/components/common/Button';
import { fetchApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/appConfig';
import { DriverResponse } from '@/types/driver';
import { EmpresaResponse } from '@/types/company';

// --- Mock Data for demonstration ---
// In a real application, this data would come from your backend API
const mockDrivers: DriverResponse[] = [
  {
    id: '1a2b3c4d-5e6f-7890-1234-567890abcdef',
    cedula: '123456789',
    nombre_completo: 'Juan Pérez García',
    id_empresa: 'empresa-uuid-1',
    fecha_nacimiento: '1985-03-15',
    telefono_contacto: '555-1111',
    email: 'juan.perez@example.com',
    licencia_conduccion: 'LIC-JP85',
    tipo_licencia: 'B2',
    fecha_expiracion_licencia: '2027-12-31',
    activo: true,
    codigo_qr_hash: null,
    foto_perfil_url: '',
    id_video_entrenamiento_principal: null,
    last_updated_at: new Date().toISOString(),
    // These fields would ideally come from the backend or be calculated
    // For demonstration, adding mock values
    calificacion_general: 9.2,
    calificacion_ultimo_mes: 8.9,
    horas_conduccion: 185, // in hours
  },
  {
    id: '9f8e7d6c-5b4a-3210-fedc-ba9876543210',
    cedula: '987654321',
    nombre_completo: 'María López Fernández',
    id_empresa: 'empresa-uuid-2',
    fecha_nacimiento: '1990-07-22',
    telefono_contacto: '555-2222',
    email: 'maria.lopez@example.com',
    licencia_conduccion: 'LIC-ML90',
    tipo_licencia: 'C1',
    fecha_expiracion_licencia: '2026-06-30',
    activo: true,
    codigo_qr_hash: null,
    foto_perfil_url: '',
    id_video_entrenamiento_principal: null,
    last_updated_at: new Date().toISOString(),
    calificacion_general: 8.5,
    calificacion_ultimo_mes: 8.7,
    horas_conduccion: 150,
  },
  {
    id: 'abcde123-4567-89ab-cdef-1234567890ab',
    cedula: '112233445',
    nombre_completo: 'Carlos Ruiz Delgado',
    id_empresa: 'empresa-uuid-1',
    fecha_nacimiento: '1978-01-01',
    telefono_contacto: '555-3333',
    email: 'carlos.ruiz@example.com',
    licencia_conduccion: 'LIC-CR78',
    tipo_licencia: 'B1',
    fecha_expiracion_licencia: '2028-11-01',
    activo: false,
    codigo_qr_hash: null,
    foto_perfil_url: '',
    id_video_entrenamiento_principal: null,
    last_updated_at: new Date().toISOString(),
    calificacion_general: 7.9,
    calificacion_ultimo_mes: 8.1,
    horas_conduccion: 90,
  },
];

const mockCompanies: EmpresaResponse[] = [
  { id: 'empresa-uuid-1', nombre_empresa: 'Transportes Rápidos S.A.', nit: '900123456-1' },
  { id: 'empresa-uuid-2', nombre_empresa: 'Logística Segura Ltda.', nit: '800987654-2' },
];

// Extend DriverResponse type to include mock rating and hours data
// This is a declaration merge, it adds new properties to the existing interface.
// For Next.js App Router and 'use client' components, metadata export is not allowed directly
// in the page file. It should be defined in a layout.tsx for server components or handled
// dynamically if needed in client components.
declare module '@/types/driver' {
  export interface DriverResponse {
    calificacion_general?: number;
    calificacion_ultimo_mes?: number;
    horas_conduccion?: number;
  }
}
// --- End Mock Data ---

export default function DriversPage() {
  const [drivers, setDrivers] = useState<DriverResponse[]>(mockDrivers);
  const [companies, setCompanies] = useState<EmpresaResponse[]>(mockCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [busPlaca, setBusPlaca] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, you'd fetch initial data here
    // For demonstration, we're using mock data
    /*
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const companiesResponse = await fetchApi<EmpresaResponse[]>(API_ENDPOINTS.companies); //
        if (companiesResponse.success && companiesResponse.data) {
          setCompanies(companiesResponse.data);
        } else {
          setError(companiesResponse.message || 'Error al cargar empresas.');
        }

        const driversResponse = await fetchApi<DriverResponse[]>(API_ENDPOINTS.drivers.base); //
        if (driversResponse.success && driversResponse.data) {
          setDrivers(driversResponse.data);
        } else {
          setError(driversResponse.message || 'Error al cargar conductores.');
        }
      } catch (err: any) {
        console.error('Error loading data:', err);
        setError(err.message || 'Error de red o servidor.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    */
  }, []);

  const handleFilterByCompany = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(e.target.value);
    // In a real app, you'd trigger an API call or filter existing 'drivers' state
    // For mock: filter locally
    if (e.target.value === '') {
      setDrivers(mockDrivers);
    } else {
      setDrivers(mockDrivers.filter(driver => driver.id_empresa === e.target.value));
    }
  };

  const handleSearchByBusPlaca = async () => {
    setError(null);
    setLoading(true);
    // In a real app, this would involve multiple API calls:
    // 1. Fetch bus by placa: API_ENDPOINTS.buses.byPlaca
    // 2. Then, fetch drivers for that bus: API_ENDPOINTS.buses.drivers(busId)
    // For now, it's a mock.
    console.log(`Searching for drivers by bus placa: ${busPlaca}`);
    // Simulate a search result (e.g., all drivers if no specific bus logic)
    setDrivers(mockDrivers); // Or a subset filtered by placa if mock data supports it
    setLoading(false);
  };

  const handleClearFilters = () => {
    setSelectedCompanyId('');
    setBusPlaca('');
    setDrivers(mockDrivers); // Reset to all mock drivers
  };

  // Calculate KPI values from mock data
  const totalDrivers = mockDrivers.length;
  const activeDrivers = mockDrivers.filter(d => d.activo).length;
  const averageRating = (mockDrivers.reduce((sum, d) => sum + (d.calificacion_general || 0), 0) / totalDrivers).toFixed(1);
  const totalDrivingHoursLastMonth = mockDrivers.reduce((sum, d) => sum + (d.horas_conduccion || 0), 0); // using total for simplicity

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Gestión de Conductores
          </h1>
          <p className="text-gray-600 text-lg">
            Administra y monitorea a todos los conductores del sistema.
          </p>
        </div>
        {/* You can add real-time status or other small indicators here */}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Conductores" value={totalDrivers.toString()} icon="user" color="blue" />
        <KpiCard title="Conductores Activos" value={activeDrivers.toString()} icon="user" color="green" />
        {/* For these KPI Cards, the data (calificacion_general, horas_conduccion) are not explicitly in DriverResponse type or current API endpoints. 
            They would need to be added to your backend data model and API responses. */}
        <KpiCard title="Promedio Calificación General" value={averageRating} unit="/10" icon="star" color="yellow" />
        <KpiCard title="Horas Conducción (Último Mes)" value={totalDrivingHoursLastMonth.toString()} unit="hrs" icon="bus" color="blue" />
      </div>

      {/* Filter Section */}
      <div className="card-modern p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Filter by Company */}
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

          {/* Search by Bus Placa */}
          <div>
            <label htmlFor="bus-placa-search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar por Placa de Bus:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="bus-placa-search"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={busPlaca}
                onChange={(e) => setBusPlaca(e.target.value)}
                placeholder="Ej: ABC-123"
                disabled={loading}
              />
              <Button onClick={handleSearchByBusPlaca} disabled={loading || busPlaca.trim() === ''}>
                Buscar
              </Button>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="md:col-span-1 flex justify-end">
            <Button variant="secondary" onClick={handleClearFilters} disabled={loading}>
              Limpiar Filtros
            </Button>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mt-4 text-center font-medium shadow-sm">
            {error}
          </div>
        )}
      </div>

      {/* Main Content: Driver List Table */}
      <div className="card-modern p-6 overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Listado de Conductores</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Cargando conductores...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Foto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cédula
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Licencia / Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificación General
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificación Último Mes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horas Conducción
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    No se encontraron conductores.
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {driver.foto_perfil_url ? (
                        <Image
                          className="h-10 w-10 rounded-full"
                          src={driver.foto_perfil_url}
                          alt="Foto Conductor"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          {driver.nombre_completo.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {driver.nombre_completo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.cedula}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {companies.find(c => c.id === driver.id_empresa)?.nombre_empresa || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.licencia_conduccion} ({driver.tipo_licencia})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.calificacion_general?.toFixed(1) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.calificacion_ultimo_mes?.toFixed(1) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.horas_conduccion || 'N/A'} hrs
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        driver.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {driver.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Example link to a detailed driver page */}
                      <Link href={`/drivers/${driver.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Ver Detalles
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {/* Pagination Controls would go here */}
      </div>
    </div>
  );
}