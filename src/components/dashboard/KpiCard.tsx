// src/components/dashboard/KpiCard.tsx
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-600',
};

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  icon,
  color = 'blue',
}) => {
  const getIconSvg = (iconName: string) => {
    const iconClass = 'w-6 h-6';
    const icons: { [key: string]: JSX.Element } = {
      bus: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10M7.5 17A1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 14 1.5 1.5 0 019 15.5 1.5 1.5 0 017.5 17m9 0A1.5 1.5 0 0115 15.5 1.5 1.5 0 0116.5 14 1.5 1.5 0 0118 15.5 1.5 1.5 0 0116.5 17M5 11V6h14v5H5z" />
        </svg>
      ),
      user: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      alert: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.487 0l7.964 14.172c.766 1.36-.191 3.06-1.743 3.06H2.035c-1.552 0-2.509-1.7-1.743-3.06L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      star: (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-500 font-medium mb-2">{title}</h3>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-extrabold text-gray-900">{value}</span>
            {unit && <span className="text-lg text-gray-400">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className={`rounded-full p-3 ${colorMap[color]} shadow-sm`}>
            {getIconSvg(icon)}
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
