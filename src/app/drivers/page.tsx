// src/app/drivers/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/appConfig';
import { DriverResponse } from '@/types/driver';
import { EmpresaResponse } from '@/types/company';
import DriversTable from './DriversTable';
import Button from '@/components/common/Button';

// Componente KPI Card
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: 'user' | 'users' | 'star' | 'clock';
  color: 'blue' | 'green' | 'yellow' | 'purple';
  subtitle?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color, subtitle }) => {
  const getIconComponent = () => {
    switch (icon) {
      case 'user':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        );
      case 'star':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'green':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg border ${getColorClasses()}`}>
          {getIconComponent()}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<DriverResponse[]>([]);
  const [companies, setCompanies] = useState<EmpresaResponse[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverResponse[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [drivers, selectedCompanyId, searchTerm, statusFilter]);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar empresas
      const companiesResponse = await fetchApi<EmpresaResponse[]>(API_ENDPOINTS.companies);
      if (companiesResponse.success && companiesResponse.data) {
        setCompanies(companiesResponse.data);
      } else {
        console.error('Error al cargar empresas:', companiesResponse.message);
      }

      // Cargar conductores
      const driversResponse = await fetchApi<DriverResponse[]>(API_ENDPOINTS.drivers.base);
      if (driversResponse.success && driversResponse.data) {
        setDrivers(driversResponse.data);
      } else {
        setError(driversResponse.message || 'Error al cargar conductores');
      }
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setError('Error de red al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...drivers];

    // Filtrar por empresa
    if (selectedCompanyId && selectedCompanyId !== 'all') {
      filtered = filtered.filter(driver => driver.id_empresa === selectedCompanyId);
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(driver => 
        driver.nombre_completo.toLowerCase().includes(term) ||
        driver.cedula.includes(term) ||
        (driver.email && driver.email.toLowerCase().includes(term)) ||
        (driver.telefono_contacto && driver.telefono_contacto.includes(term))
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(driver => driver.activo === isActive);
    }

    setFilteredDrivers(filtered);
  };

  const handleRefresh = () => {
    loadInitialData();
  };

  const handleClearFilters = () => {
    setSelectedCompanyId('');
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Calcular KPIs
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.activo).length;
  const inactiveDrivers = totalDrivers - activeDrivers;
  const companiesWithDrivers = new Set(drivers.map(d => d.id_empresa)).size;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Gestión de Conductores
          </h1>
          <p className="text-gray-600 text-lg">
            Administra y monitorea a todos los conductores del sistema.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="secondary"
            className="flex items-center space-x-2"
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
          </Button>
          
          <Link href="/drivers/register">
            <Button variant="primary" className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nuevo Conductor</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Conductores" 
          value={totalDrivers} 
          icon="users" 
          color="blue"
          subtitle="En el sistema"
        />
        <KpiCard 
          title="Conductores Activos" 
          value={activeDrivers} 
          icon="user" 
          color="green"
          subtitle="Disponibles"
        />
        <KpiCard 
          title="Conductores Inactivos" 
          value={inactiveDrivers} 
          icon="user" 
          color="yellow"
          subtitle="No disponibles"
        />
        <KpiCard 
          title="Empresas con Conductores" 
          value={companiesWithDrivers} 
          icon="star" 
          color="purple"
          subtitle="Activas"
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros de Búsqueda</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda por texto */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Nombre, cédula, email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filtro por empresa */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Empresa
            </label>
            <select
              id="company"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              <option value="">Todas las empresas</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.nombre_empresa}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Solo activos</option>
              <option value="inactive">Solo inactivos</option>
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div className="flex items-end">
            <Button 
              variant="secondary" 
              onClick={handleClearFilters}
              className="w-full"
              disabled={!selectedCompanyId && !searchTerm && statusFilter === 'all'}
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Información de resultados */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredDrivers.length} de {totalDrivers} conductores
            </span>
            {(selectedCompanyId || searchTerm || statusFilter !== 'all') && (
              <span className="text-blue-600">
                Filtros aplicados
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <strong>Error de conexión:</strong> {error}
              <div className="text-sm mt-1">
                Verifica que el backend esté corriendo en {API_ENDPOINTS.drivers.base}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de conductores */}
      <DriversTable 
        drivers={filteredDrivers} 
        companies={companies} 
        loading={loading} 
      />

      {/* Footer con estadísticas */}
      {drivers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Estadístico</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeDrivers}</div>
              <div className="text-sm text-gray-600">Conductores Activos</div>
              <div className="text-xs text-gray-500 mt-1">
                {totalDrivers > 0 ? Math.round((activeDrivers / totalDrivers) * 100) : 0}% del total
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{companies.length}</div>
              <div className="text-sm text-gray-600">Empresas Registradas</div>
              <div className="text-xs text-gray-500 mt-1">
                {companiesWithDrivers} con conductores
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{filteredDrivers.length}</div>
              <div className="text-sm text-gray-600">Resultados Mostrados</div>
              <div className="text-xs text-gray-500 mt-1">
                Después de aplicar filtros
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}