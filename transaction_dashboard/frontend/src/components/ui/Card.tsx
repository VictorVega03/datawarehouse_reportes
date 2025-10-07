// frontend/src/components/ui/Card.tsx
import React from 'react'

// Tipos inline del componente
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray'
  bg?: string // Permite pasar clase de fondo personalizada
  border?: string // Permite pasar clase de borde personalizada
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

// Componente principal Card
export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>
  Body: React.FC<CardBodyProps>
  Footer: React.FC<CardFooterProps>
} = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  onClick,
  color,
  bg,
  border
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  }

  // Colores base para métricas
  const colorBg = color ? {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
    gray: 'bg-gray-50'
  }[color] : ''
  const colorBorder = color ? {
    blue: 'border border-blue-200',
    green: 'border border-green-200',
    orange: 'border border-orange-200',
    purple: 'border border-purple-200',
    red: 'border border-red-200',
    gray: 'border border-gray-200'
  }[color] : ''

  const baseStyles = 'rounded-lg shadow-sm'
  const hoverStyles = hover ? 'hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer' : ''
  const clickStyles = onClick ? 'cursor-pointer' : ''
  const bgClass = bg || colorBg || 'bg-white'
  const borderClass = border || colorBorder || ''

  const cardClasses = `
    ${baseStyles}
    ${bgClass}
    ${borderClass}
    ${paddingStyles[padding]}
    ${hoverStyles}
    ${clickStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ')

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  )
}

// Subcomponente Header
Card.Header = ({ children, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
      {children}
    </div>
  )
}

// Subcomponente Body
Card.Body = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Subcomponente Footer
Card.Footer = ({ children, className = '' }) => {
  return (
    <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
      {children}
    </div>
  )
}