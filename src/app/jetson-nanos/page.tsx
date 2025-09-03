// src/app/jetson-nanos/page.tsx
import JetsonNanosList from '@/components/jetson/JetsonNanosList';

export const metadata = {
  title: 'Monitoreo Jetson Nanos - Sistema de Monitoreo',
  description: 'Monitor y gestiona todos los dispositivos Jetson Nano de la flota en tiempo real.',
};

export default function JetsonNanosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            Monitoreo Jetson Nanos
          </h1>
          <p className="text-gray-600 text-lg">
            Estado en tiempo real de todos los dispositivos Jetson Nano en la flota
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"></div>
            <span>Sistema activo</span>
            <span className="mx-2">•</span>
            <span>Monitoreo en tiempo real</span>
          </div>
        </div>
      </div>

      {/* Lista de Jetson Nanos */}
      <JetsonNanosList />
    </div>
  );
}