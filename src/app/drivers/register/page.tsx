// src/app/drivers/register/page.tsx
import DriverRegistrationForm from '@/components/forms/DriverRegistrationForm'; 

export const metadata = {
  title: 'Registrar Conductor - Sistema de Monitoreo',
  description: 'Formulario de registro para nuevos conductores del sistema, incluyendo QR y video de entrenamiento.',
};

export default function RegisterDriverPage() {
  return (
    <div className="min-h-full py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Registro de Conductores</h1>
      <DriverRegistrationForm />
    </div>
  );
}