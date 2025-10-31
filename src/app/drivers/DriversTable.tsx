// src/components/drivers/DriversTable.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DriverResponse } from '@/types/driver';
import { EmpresaResponse } from '@/types/company';
import DriverCarnetModal from './DriverCarnetModal';

interface DriversTableProps {
  drivers: DriverResponse[];
  companies: EmpresaResponse[];
  loading?: boolean;
}

const DriversTable: React.FC<DriversTableProps> = ({ drivers, companies, loading = false }) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isCarnetModalOpen, setIsCarnetModalOpen] = useState(false);

  const handleShowCarnet = (driverId: string) => {
    setSelectedDriverId(driverId);
    setIsCarnetModalOpen(true);
  };

  const handleCloseCarnetModal = () => {
    setIsCarnetModalOpen(false);
    setSelectedDriverId(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.nombre_empresa || 'N/A';
  };

  const isLicenseExpired = (expirationDate: string | null) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando conductores...</span>
        </div>
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-600 mb-2">No se encontraron conductores</p>
          <p className="text-gray-500 mb-4">Intenta ajustar los filtros o agregar nuevos conductores al sistema.</p>
          <Link 
            href="/drivers/register"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar Nuevo Conductor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header de la tabla */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Lista de Conductores ({drivers.length})
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Activo</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Inactivo</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Licencia vencida</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Identificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Licencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver, index) => (
                <tr 
                  key={driver.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  {/* Conductor */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {driver.foto_perfil_url ? (
                          <Image
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            src={driver.foto_perfil_url}
                            alt="Foto Conductor"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-2 border-gray-200">
                            <span className="text-white font-semibold text-lg">
                              {driver.nombre_completo.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {driver.nombre_completo}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {driver.id.substring(0, 8)}...
                        </div>
                        {driver.fecha_nacimiento && (
                          <div className="text-xs text-gray-400">
                            Nació: {formatDate(driver.fecha_nacimiento)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  {/* Identificación */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{driver.cedula}</div>
                    {driver.codigo_qr_hash && (
                      <div className="text-xs text-gray-500 font-mono">
                        QR: {driver.codigo_qr_hash.substring(0, 12)}...
                      </div>
                    )}
                  </td>
                  
                  {/* Empresa */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getCompanyName(driver.id_empresa)}
                    </div>
                  </td>
                  
                  {/* Licencia */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {driver.licencia_conduccion || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tipo: {driver.tipo_licencia || 'N/A'}
                    </div>
                    {driver.fecha_expiracion_licencia && (
                      <div className={`text-xs ${
                        isLicenseExpired(driver.fecha_expiracion_licencia) 
                          ? 'text-red-600 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        Vence: {formatDate(driver.fecha_expiracion_licencia)}
                      </div>
                    )}
                  </td>
                  
                  {/* Contacto */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {driver.telefono_contacto || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-32">
                      {driver.email || 'N/A'}
                    </div>
                  </td>
                  
                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        driver.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {driver.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      
                      {/* Indicador de licencia vencida */}
                      {isLicenseExpired(driver.fecha_expiracion_licencia) && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Licencia vencida
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Botón Ver Carnet */}
                      <button
                        onClick={() => handleShowCarnet(driver.id)}
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        title="Ver Carnet de Identificación"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Carnet
                      </button>
                      
                      {/* Botón Ver Detalles */}
                      <Link 
                        href={`/drivers/${driver.id}`}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Detalles
                      </Link>
                      
                      {/* Botón editar (opcional) */}
                      <button
                        onClick={() => {
                          // Implementar función de edición
                          console.log('Editar conductor:', driver.id);
                        }}
                        className="inline-flex items-center px-3 py-2 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                        title="Editar Conductor"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer de la tabla */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Total: {drivers.length} conductores</span>
              <span>•</span>
              <span>Activos: {drivers.filter(d => d.activo).length}</span>
              <span>•</span>
              <span>Inactivos: {drivers.filter(d => !d.activo).length}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              Última actualización: {new Date().toLocaleString('es-CO')}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Carnet */}
      {selectedDriverId && (
        <DriverCarnetModal
          driverId={selectedDriverId}
          isOpen={isCarnetModalOpen}
          onClose={handleCloseCarnetModal}
        />
      )}
    </>
  );
};

export default DriversTable;