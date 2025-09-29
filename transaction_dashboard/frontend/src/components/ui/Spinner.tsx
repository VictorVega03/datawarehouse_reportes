// frontend/src/components/ui/Spinner.tsx
import React from 'react'

// Tipos inline del componente
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white'
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  // Tamaños
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  
  // Colores
  const colorStyles = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white'
  }
  
  const spinnerClasses = `
    animate-spin
    ${sizeStyles[size]}
    ${colorStyles[color]}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <svg
      className={spinnerClasses}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// Componente de pantalla completa de carga
interface LoadingScreenProps {
  message?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Cargando...' 
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="xl" color="primary" />
        <p className="mt-4 text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}