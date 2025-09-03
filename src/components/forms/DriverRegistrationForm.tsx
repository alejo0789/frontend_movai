'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postApi, fetchApi, uploadFileApi, fetchImageApi } from '@/lib/api'; 
import { API_ENDPOINTS } from '@/constants/appConfig'; 
import { DriverData, DriverResponse, QrResponse, VideoTrainingResponse } from '@/types/driver'; 
import { EmpresaResponse } from '@/types/company'; 
import Button from '@/components/common/Button'; 
import Image from 'next/image'; 

// Importar el componente DriverIdCard
import DriverIdCard from '@/components/drivers/DriverIdCard'; 


const DriverRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<DriverData>({
    cedula: '',
    nombre_completo: '',
    id_empresa: '', 
    fecha_nacimiento: '',
    telefono_contacto: '',
    email: '',
    licencia_conduccion: '',
    tipo_licencia: '',
    fecha_expiracion_licencia: '',
    activo: true,
  });
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(false);
  const [currentDriverId, setCurrentDriverId] = useState<string | null>(null); 
  const [currentDriverData, setCurrentDriverData] = useState<DriverResponse | null>(null); 
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null); 
  const [videoFile, setVideoFile] = useState<File | null>(null); 
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [videoProcessingMessage, setVideoProcessingMessage] = useState<string | null>(null);
  const [showVideoUploadSection, setShowVideoUploadSection] = useState<boolean>(false); 

  useEffect(() => {
    const loadEmpresas = async () => {
      const response = await fetchApi<EmpresaResponse[]>(API_ENDPOINTS.companies);
      if (response.success && response.data) {
        setEmpresas(response.data);
      } else {
        setError(response.message || 'Error al cargar empresas.');
      }
    };
    loadEmpresas();
  }, []);

  // Corregimos la función handleChange para manejar de forma segura los diferentes tipos de input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue;
    
    // Verificamos si el target es un input de tipo checkbox para usar su propiedad 'checked'
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      newValue = e.target.checked;
    } else {
      newValue = value;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    } else {
      setVideoFile(null);
    }
  };

  const handleDriverRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);         
    setSuccessMessage(null);    
    setLoading(true);
    setCurrentDriverId(null); 
    setCurrentDriverData(null); 
    setQrImageUrl(null);      
    setVideoFile(null);      
    setVideoUploadProgress(0);
    setVideoProcessingMessage(null);
    setShowVideoUploadSection(false); 

    try {
      const dataToSend: DriverData = { ...formData };
      if (dataToSend.id_empresa === '') { 
        setError('Por favor, seleccione una empresa para el conductor.');
        setLoading(false);
        return;
      }

      const response = await postApi<DriverResponse>(API_ENDPOINTS.drivers.base, dataToSend); 

      if (response.success && response.data) {
        setSuccessMessage(`Conductor ${response.data.nombre_completo} registrado exitosamente. Generando QR y carnet...`);
        setCurrentDriverId(response.data.id); 
        setCurrentDriverData(response.data); 
        
        const qrResponse = await fetchImageApi(API_ENDPOINTS.drivers.qr(response.data.id));
        if (qrResponse.success && qrResponse.data) {
          setQrImageUrl(qrResponse.data); 
          setSuccessMessage(prev => `${prev} QR generado y carnet listo.`);
        } else {
          setError(qrResponse.message || 'Error al generar el código QR.');
        }

      } else {
        setError(response.message || 'Fallo al registrar el conductor.');
      }
    } catch (err) {
      console.error('Error durante el registro del conductor:', err);
      setError('Error de red o servidor al intentar registrar el conductor.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!currentDriverId || !videoFile) {
      setError('Primero registre el conductor y seleccione un archivo de video.');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoProcessingMessage('Subiendo y procesando video...');
    setVideoUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('conductor_id', currentDriverId);
      formData.append('video_file', videoFile);

      const response = await uploadFileApi<VideoTrainingResponse>(API_ENDPOINTS.trainingData.videos, formData);

      if (response.success && response.data) {
        setVideoProcessingMessage(`Video subido y procesado. Estado: ${response.data.estado_procesamiento}`);
        setVideoUploadProgress(100); 
        setSuccessMessage(prev => `${prev} Video de entrenamiento procesado.`);

        const updatedDriverResponse = await fetchApi<DriverResponse>(`${API_ENDPOINTS.drivers.base}/${currentDriverId}`);
        if (updatedDriverResponse.success && updatedDriverResponse.data) {
            setCurrentDriverData(updatedDriverResponse.data);
        }

      } else {
        setError(response.message || 'Fallo al subir y procesar el video.');
      }
    } catch (err) {
      console.error('Error durante la subida/procesamiento del video:', err);
      setError('Error de red o servidor al intentar subir el video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-modern p-8 max-w-3xl mx-auto my-10 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Registro de Conductores</h2>
      
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-center font-medium shadow-sm">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center font-medium shadow-sm">
          {error}
        </div>
      )}
      {videoProcessingMessage && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded-md mb-4 text-center font-medium shadow-sm">
          {videoProcessingMessage} {videoUploadProgress > 0 && `(${videoUploadProgress}%)`}
        </div>
      )}

      {/* Sección 1: Formulario de Datos del Conductor */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">1. Datos del Conductor</h3>
      <form onSubmit={handleDriverRegistration} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Cédula */}
          <div>
            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700 mb-1">
              Cédula: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.cedula}
              onChange={handleChange}
              required
              disabled={loading || currentDriverId !== null} 
            />
          </div>

          {/* Campo Nombre Completo */}
          <div>
            <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre_completo"
              name="nombre_completo"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
              disabled={loading || currentDriverId !== null}
            />
          </div>

          {/* Selector de Empresa */}
          <div>
            <label htmlFor="id_empresa" className="block text-sm font-medium text-gray-700 mb-1">
              Empresa: <span className="text-red-500">*</span>
            </label>
            <select
              id="id_empresa"
              name="id_empresa"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={formData.id_empresa}
              onChange={handleChange}
              required
              disabled={loading || currentDriverId !== null}
            >
              <option value="">-- Seleccione Empresa --</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre_empresa}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Fecha Nacimiento */}
          <div>
            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento:
            </label>
            <input
              type="date" 
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              disabled={loading || currentDriverId !== null}
            />
          </div>

          {/* Campo Teléfono */}
          <div>
            <label htmlFor="telefono_contacto" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de Contacto:
            </label>
            <input
              type="tel" 
              id="telefono_contacto"
              name="telefono_contacto"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.telefono_contacto}
              onChange={handleChange}
              disabled={loading || currentDriverId !== null}
            />
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || currentDriverId !== null}
            />
          </div>

          {/* Campo Licencia Conducción */}
          <div>
            <label htmlFor="licencia_conduccion" className="block text-sm font-medium text-gray-700 mb-1">
              Licencia de Conducción:
            </label>
            <input
              type="text"
              id="licencia_conduccion"
              name="licencia_conduccion"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.licencia_conduccion}
              onChange={handleChange}
              disabled={loading || currentDriverId !== null}
            />
          </div>

          {/* Campo Tipo Licencia */}
          <div>
            <label htmlFor="tipo_licencia" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Licencia:
            </label>
            <input
              type="text"
              id="tipo_licencia"
              name="tipo_licencia"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.tipo_licencia}
              onChange={handleChange}
              disabled={loading || currentDriverId !== null}
            />
          </div>

          {/* Campo Fecha Expiración Licencia */}
          <div>
            <label htmlFor="fecha_expiracion_licencia" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Exp. Licencia:
            </label>
            <input
              type="date"
              id="fecha_expiracion_licencia"
              name="fecha_expiracion_licencia"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.fecha_expiracion_licencia}
              onChange={handleChange}
              disabled={loading || currentDriverId !== null}
            />
          </div>

          {/* Checkbox Activo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              checked={formData.activo}
              onChange={handleChange}
              disabled={loading || currentDriverId !== null}
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
              Activo
            </label>
          </div>
        </div>

        {/* Botón de Registro de Conductor (deshabilitado si ya se registró) */}
        <Button 
          type="submit" 
          className="w-full" 
          variant="primary" 
          disabled={loading || currentDriverId !== null}
        >
          {currentDriverId ? 'Conductor Registrado' : (loading ? 'Registrando...' : 'Registrar Conductor')}
        </Button>
      </form>

      {/* Sección 2: Carnet de Identificación y QR (solo visible si el conductor se registró) */}
      {qrImageUrl && currentDriverData && ( 
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Carnet de Identificación del Conductor</h3>
          <p className="text-gray-600 mb-4 text-center">Este es el carnet de identificación digital del conductor. Puede descargarlo e imprimirlo.</p>
          
          <DriverIdCard driver={currentDriverData} qrImageUrl={qrImageUrl} /> 

          <div className="mt-4 flex justify-center space-x-4">
            <a href={qrImageUrl} download={`qr_${formData.cedula}.png`} className="btn-modern bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300">
              Descargar QR (solo imagen)
            </a>
          </div>
          {/* Botón para pasar a la siguiente sección (subida de video) */}
          <div className="mt-6 text-center">
            <Button 
              type="button" 
              variant="primary" 
              onClick={() => setShowVideoUploadSection(true)} 
              disabled={loading} 
            >
              Continuar a Subir Video de Entrenamiento
            </Button>
          </div>
        </div>
      )}

      {/* Sección 3: Subida de Video de Entrenamiento (solo visible si showVideoUploadSection es true) */}
      {showVideoUploadSection && currentDriverId && ( 
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">3. Video de Entrenamiento para Reconocimiento Facial</h3>
          <p className="text-gray-600 mb-4">Por favor, suba un video corto del conductor para el entrenamiento del modelo de reconocimiento facial.</p>
          
          <div className="mb-4">
            <label htmlFor="video_file" className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Archivo de Video:
            </label>
            <input
              type="file"
              id="video_file"
              name="video_file"
              accept="video/*" 
              className="w-full text-gray-700 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={handleVideoFileChange}
              disabled={loading}
            />
          </div>
          
          <Button 
            type="button" 
            className="w-full" 
            variant="primary" 
            onClick={handleVideoUpload} 
            disabled={loading || !videoFile}
          >
            {loading ? 'Subiendo y procesando...' : 'Subir Video de Entrenamiento'}
          </Button>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Asegúrese de que el video muestre el rostro del conductor claramente en diferentes ángulos y expresiones.
          </p>
        </div>
      )}
    </div>
  );
};

export default DriverRegistrationForm;
