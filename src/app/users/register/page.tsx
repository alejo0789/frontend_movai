// src/app/users/register/page.tsx
import UserRegistrationForm from '@/components/forms/UserRegistrationForm'; // Importa el componente del formulario

export const metadata = {
  title: 'Registrar Usuario - Sistema de Monitoreo',
  description: 'Formulario de registro para nuevos usuarios del sistema.',
};

export default function RegisterUserPage() {
  return (
    <div className="min-h-full py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Registro de Usuarios</h1>
      <UserRegistrationForm />
    </div>
  );
}