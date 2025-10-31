// src/components/drivers/DriverCarnetModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi, fetchImageApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/appConfig';
import { DriverResponse } from '@/types/driver';
import DriverIdCard from '@/components/drivers/DriverIdCard';
import Button from '@/components/common/Button';
interface DriverCarnetModalProps {
  driverId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DriverCarnetModal: React.FC<DriverCarnetModalProps> = ({ driverId, isOpen, onClose }) => {
  const [driver, setDriver] = useState<DriverResponse | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && driverId && !driver) {
      loadDriverData();
    }
  }, [isOpen, driverId]);

  const loadDriverData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos del conductor
      const driverResponse = await fetchApi<DriverResponse>(`${API_ENDPOINTS.drivers.base}${driverId}`);
      
      if (driverResponse.success && driverResponse.data) {
        setDriver(driverResponse.data);
        
        // Cargar QR del conductor
        const qrResponse = await fetchImageApi(API_ENDPOINTS.drivers.qr(driverId));
        if (qrResponse.success && qrResponse.data) {
          setQrImageUrl(qrResponse.data);
        } else {
          setError('Error al cargar el código QR');
        }
      } else {
        setError('Error al cargar los datos del conductor');
      }
    } catch (err: any) {
      console.error('Error loading driver data:', err);
      setError('Error de red al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Limpiar datos al cerrar para evitar mostrar datos obsoletos
    setTimeout(() => {
      setDriver(null);
      setQrImageUrl(null);
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Carnet de Identificación</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Generando carnet...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <Button
                variant="secondary"
                onClick={loadDriverData}
                className="mt-4"
              >
                Reintentar
              </Button>
            </div>
          ) : driver && qrImageUrl ? (
            <>
              {/* Carnet del conductor */}
              <DriverIdCard driver={driver} qrImageUrl={qrImageUrl} />
              
              {/* Botones de descarga */}
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
              
              {/* Información adicional */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center text-sm text-gray-600">
                  <p>Este carnet digital incluye toda la información</p>
                  <p>del conductor y su código QR único para identificación.</p>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DriverCarnetModal;