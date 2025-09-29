// frontend/src/components/ui/Badge.tsx
import React from 'react'

// Tipos inline del componente
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = ''
}) => {
  // Estilos base
  const baseStyles = 'inline-flex items-center font-medium'
  
  // Variantes de color
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-cyan-100 text-cyan-800'
  }
  
  // Tamaños
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  // Redondeo
  const roundedStyles = rounded ? 'rounded-full' : 'rounded'
  
  const badgeClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${roundedStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <span className={badgeClasses}>
      {children}
    </span>
  )
}