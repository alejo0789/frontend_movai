'use client'; 

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DriverResponse } from '@/types/driver';
import { EmpresaResponse } from '@/types/company';
import { fetchApi } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/appConfig';

interface DriverIdCardProps {
  driver: DriverResponse;
  qrImageUrl: string;
}

const DriverIdCard: React.FC<DriverIdCardProps> = ({ driver, qrImageUrl }) => {
  const [empresa, setEmpresa] = useState<EmpresaResponse | null>(null);

  useEffect(() => {
    const loadEmpresa = async () => {
      if (driver.id_empresa) {
        const response = await fetchApi<EmpresaResponse>(`${API_ENDPOINTS.companies}${driver.id_empresa}`);
        if (response.success && response.data) {
          setEmpresa(response.data);
        } else {
          console.error('Error al cargar datos de la empresa para el carnet:', response.message);
        }
      }
    };
    loadEmpresa();
  }, [driver.id_empresa]);

  return (
    <div className="card-modern p-6 md:p-8 max-w-sm mx-auto my-6 bg-white text-black shadow-lg rounded-2xl overflow-hidden relative border border-gray-200">
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo de la empresa */}
        <div className="mb-4 text-center">
          <p className="text-xl font-bold text-gray-800">
            {empresa ? empresa.nombre_empresa : 'Empresa de Transporte'}
          </p>
        </div>

        {/* Foto del conductor */}
        {driver.foto_perfil_url ? (
          <Image 
            src={driver.foto_perfil_url} 
            alt="Foto del Conductor" 
            width={120} 
            height={120} 
            className="rounded-full border-4 border-gray-300 shadow mb-4" 
          />
        ) : (
          <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center mb-4 border-4 border-gray-300 shadow">
            <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Nombre */}
        <h2 className="text-2xl font-extrabold text-black text-center mb-2">
          {driver.nombre_completo}
        </h2>

        {/* Cédula */}
        <p className="text-lg font-medium text-gray-800 mb-4">
          Cédula: {driver.cedula}
        </p>

        {/* Código QR */}
        {qrImageUrl && (
          <div className="bg-gray-100 p-2 rounded-lg shadow-sm mb-4">
            <Image src={qrImageUrl} alt="Código QR de Identificación" width={150} height={150} />
          </div>
        )}

        {/* Información adicional */}
        <div className="text-sm text-gray-700 text-center space-y-1">
          <p>Licencia: {driver.licencia_conduccion || 'N/A'}</p>
          <p>Tipo: {driver.tipo_licencia || 'N/A'}</p>
          <p>Teléfono: {driver.telefono_contacto || 'N/A'}</p>
          <p className="mt-2 text-xs text-gray-500">Sistema de Monitoreo MovAi</p>
        </div>
      </div>
    </div>
  );
};

export default DriverIdCard;
