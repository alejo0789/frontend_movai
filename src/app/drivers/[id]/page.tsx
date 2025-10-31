// src/app/drivers/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi, fetchImageApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/appConfig';
import { DriverResponse } from '@/types/driver';
import { EmpresaResponse } from '@/types/company';
import DriverIdCard from '@/components/drivers/DriverIdCard';
import Button from '@/components/common/Button';
import Image from 'next/image';

export default function DriverDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.id as string;

  const [driver, setDriver] = useState<DriverResponse | null>(null);
  const [empresa, setEmpresa] = useState<EmpresaResponse | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQr, setLoadingQr] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCarnet, setShowCarnet] = useState(false);

  useEffect(() => {
    const loadDriverDetails = async () => {
      if (!driverId) return;

      try {
        setLoading(true);
        setError(null);

        // Obtener detalles del conductor
        const driverResponse = await fetchApi<DriverResponse>(`${API_ENDPOINTS.drivers.base}${driverId}`);
        
        if (driverResponse.success && driverResponse.data) {
          setDriver(driverResponse.data);

          // Obtener detalles de la empresa
          if (driverResponse.data.id_empresa) {
            const empresaResponse = await fetchApi<EmpresaResponse>(`${API_ENDPOINTS.companies}${driverResponse.data.id_empresa}`);
            if (empresaResponse.success && empresaResponse.data) {
              setEmpresa(empresaResponse.data);
            }
          }
        } else {
          setError(driverResponse.message || 'Error al cargar los detalles del conductor');
        }
      } catch (err: any) {
        console.error('Error loading driver details:', err);
        setError('Error de red al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadDriverDetails();
  }, [driverId]);

  const handleShowCarnet = async () => {
    if (!driver || qrImageUrl) {
      setShowCarnet(true);
      return;
    }

    try {
      setLoadingQr(true);
      
      // Obtener el QR del conductor
      const qrResponse = await fetchImageApi(API_ENDPOINTS.drivers.qr(driver.id));
      
      if (qrResponse.success && qrResponse.data) {
        setQrImageUrl(qrResponse.data);
        setShowCarnet(true);
      } else {
        setError('Error al cargar el código QR del conductor');
      }
    } catch (err: any) {
      console.error('Error loading QR:', err);
      setError('Error de red al cargar el QR');
    } finally {
      setLoadingQr(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (activo: boolean) => {
    return activo 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del conductor...</p>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p>{error || 'Conductor no encontrado'}</p>
            <Button 
              variant="secondary" 
              className="mt-4"
              onClick={() => router.push('/drivers')}
            >
              Volver a la lista
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => router.push('/drivers')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a Conductores
              </button>
              
              <h1 className="text-3xl font-bold text-gray-900">{driver.nombre_completo}</h1>
              <p className="text-gray-600">Cédula: {driver.cedula}</p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={handleShowCarnet}
                disabled={loadingQr}
                className="flex items-center space-x-2"
              >
                {loadingQr ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Ver Carnet</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información personal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Completo</label>
                  <p className="text-lg text-gray-900">{driver.nombre_completo}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cédula</label>
                  <p className="text-lg text-gray-900">{driver.cedula}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Nacimiento</label>
                  <p className="text-lg text-gray-900">{formatDate(driver.fecha_nacimiento)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono</label>
                  <p className="text-lg text-gray-900">{driver.telefono_contacto || 'No especificado'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-lg text-gray-900">{driver.email || 'No especificado'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(driver.activo)}`}>
                    {driver.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de licencia */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Licencia</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Número de Licencia</label>
                  <p className="text-lg text-gray-900">{driver.licencia_conduccion || 'No especificado'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Licencia</label>
                  <p className="text-lg text-gray-900">{driver.tipo_licencia || 'No especificado'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Expiración</label>
                  <p className="text-lg text-gray-900">{formatDate(driver.fecha_expiracion_licencia)}</p>
                </div>
              </div>
            </div>

            {/* Información de la empresa */}
            {empresa && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Empresa</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nombre de la Empresa</label>
                    <p className="text-lg text-gray-900">{empresa.nombre_empresa}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">NIT</label>
                    <p className="text-lg text-gray-900">{empresa.nit}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Foto del conductor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Foto del Conductor</h3>
              
              <div className="flex justify-center">
                {driver.foto_perfil_url ? (
                  <Image
                    src={driver.foto_perfil_url}
                    alt="Foto del conductor"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-sm border border-gray-200"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-300">
                    <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hash QR:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {driver.codigo_qr_hash ? driver.codigo_qr_hash.substring(0, 20) + '...' : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Última actualización:</span>
                  <span className="text-gray-900">{formatDate(driver.last_updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal/Sección del carnet */}
        {showCarnet && driver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Carnet de Identificación</h3>
                <button
                  onClick={() => setShowCarnet(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {qrImageUrl ? (
                  <>
                    <DriverIdCard driver={driver} qrImageUrl={qrImageUrl} />
                    
                    <div className="mt-6 flex justify-center space-x-4">
                      <a 
                        href={qrImageUrl} 
                        download={`carnet_${driver.cedula}.png`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar Carnet
                      </a>
                      
                      <a 
                        href={qrImageUrl} 
                        download={`qr_${driver.cedula}.png`}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Solo QR
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Error al cargar el código QR</p>
                    <Button
                      variant="secondary"
                      onClick={handleShowCarnet}
                      className="mt-4"
                    >
                      Reintentar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}