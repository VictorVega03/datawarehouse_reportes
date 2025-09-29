// frontend/src/components/ui/Card.tsx
import React from 'react'

// Tipos inline del componente
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  onClick?: () => void
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
  onClick 
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const baseStyles = 'bg-white rounded-lg shadow-md'
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : ''
  const clickStyles = onClick ? 'cursor-pointer' : ''
  
  const cardClasses = `
    ${baseStyles}
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