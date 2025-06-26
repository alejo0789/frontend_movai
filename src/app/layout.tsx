// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header'; 
import Sidebar from '@/components/layout/Sidebar'; 

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sistema de Monitoreo de Conductores',
  description: 'Monitoreo en tiempo real de fatiga y distracción de conductores con tecnología avanzada.',
  keywords: 'monitoreo, conductores, fatiga, seguridad, transporte',
  authors: [{ name: 'Sistema de Monitoreo' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="font-sans antialiased overflow-hidden">
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          {/* Sidebar con animación */}
          <div className="animate-slide-in-right">
            <Sidebar />
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header con glassmorphism */}
            <div className="animate-fade-in-up">
              <Header />
            </div>
            
            {/* Main content area */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Elementos decorativos de fondo */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl"></div>
        </div>
      </body>
    </html>
  );
}