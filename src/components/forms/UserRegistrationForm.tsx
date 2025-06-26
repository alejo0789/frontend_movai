// src/components/forms/UserRegistrationForm.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postApi, fetchApi } from '@/lib/api'; 
import { API_ENDPOINTS } from '@/constants/appConfig'; 
import { UserData, UserResponse } from '@/types/user'; 
import { EmpresaResponse } from '@/types/company'; 
import Button from '@/components/common/Button'; 

const UserRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<UserData>({
    username: '',
    password: '',
    email: '',
    rol: 'Supervisor', 
    activo: true,
    id_empresa: null,
  });
  const [empresas, setEmpresas] = useState<EmpresaResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // <<<<<<< NUEVO ESTADO
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); 

  const roles = [
    'Administrador Global',
    'Administrador Empresa',
    'Supervisor',
    'Operador',
  ];

  // Cargar lista de empresas al montar el componente (para el selector)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);           // Limpiar errores anteriores
    setSuccessMessage(null);  // Limpiar mensajes de éxito anteriores
    setLoading(true);

    try {
      const dataToSend: UserData = { ...formData };
      if (dataToSend.id_empresa === '') { 
        dataToSend.id_empresa = null;
      }

      const response = await postApi<UserResponse>(API_ENDPOINTS.users.base, dataToSend); 

      if (response.success && response.data) {
        setSuccessMessage(`Usuario ${response.data.username} registrado exitosamente.`); // <<<<<<< MENSAJE DE ÉXITO
        setFormData({ // Limpiar formulario después del éxito
          username: '',
          password: '',
          email: '',
          rol: 'Supervisor',
          activo: true,
          id_empresa: null,
        });
      } else {
        setError(response.message || 'Fallo al registrar el usuario.'); // <<<<<<< MENSAJE DE ERROR
      }
    } catch (err) {
      console.error('Error durante el registro de usuario:', err);
      setError('Error de red o servidor al intentar registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-modern p-8 max-w-2xl mx-auto my-10 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Registrar Nuevo Usuario</h2>
      
      {/* <<<<<<< MOSTRAR MENSAJES DE ÉXITO O ERROR AQUI <<<<<<< */}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña: <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email: <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* Selector de Rol */}
          <div>
            <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
              Rol: <span className="text-red-500">*</span>
            </label>
            <select
              id="rol"
              name="rol"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={formData.rol}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {roles.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Empresa */}
          <div>
            <label htmlFor="id_empresa" className="block text-sm font-medium text-gray-700 mb-1">
              Empresa (opcional, para roles de empresa):
            </label>
            <select
              id="id_empresa"
              name="id_empresa"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={formData.id_empresa || ''}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">-- Seleccione Empresa (Administrador Global) --</option>
              {empresas.map((empresa) => (
                <option key={empresa.id} value={empresa.id}>
                  {empresa.nombre_empresa}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox Activo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" // Usando blue-600 por defecto
              checked={formData.activo}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-900">
              Activo
            </label>
          </div>
        </div>

        {/* Botón de Registro */}
        <Button 
          type="submit" 
          className="w-full py-2.5 px-4" 
          variant="primary" // Usa la variante 'primary' de tu Button.tsx
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Usuario'}
        </Button>
      </form>
    </div>
  );
};

export default UserRegistrationForm;