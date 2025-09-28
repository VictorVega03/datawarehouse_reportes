/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/src/**/*.{js,ts,jsx,tsx}", // Include shared components
  ],
  
  theme: {
    extend: {
      // Colors matching the dashboard design
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0', 
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d', 
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171', 
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },

        // Dashboard specific colors
        chart: {
          blue: '#3b82f6',
          purple: '#8b5cf6', 
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          indigo: '#6366f1',
          pink: '#ec4899',
          teal: '#14b8a6',
        },
      },

      // Custom font family
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system', 
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'Monaco',
          '"Cascadia Code"',
          '"Roboto Mono"',
          'Consolas',
          '"Courier New"',
          'monospace',
        ],
      },

      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Custom border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // Custom shadows matching dashboard style
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
        'strong': '0 10px 40px 0 rgba(0, 0, 0, 0.1)',
        'colored': '0 10px 30px 0 rgba(59, 130, 246, 0.3)',
        'success': '0 10px 30px 0 rgba(16, 185, 129, 0.3)',
        'warning': '0 10px 30px 0 rgba(245, 158, 11, 0.3)',
        'danger': '0 10px 30px 0 rgba(239, 68, 68, 0.3)',
      },

      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Custom screens for responsive design
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },

      // Custom z-index values
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // Custom typography
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },

      // Custom gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-success': 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
        'gradient-danger': 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)',
        'gradient-info': 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
        'dashboard-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  
  plugins: [
    // Form plugin for better form styling
    require('@tailwindcss/forms'),
    
    // Typography plugin for rich text
    require('@tailwindcss/typography'),
    
    // Aspect ratio plugin for responsive media
    require('@tailwindcss/aspect-ratio'),
    
    // Container queries (experimental)
    // require('@tailwindcss/container-queries'),
    
    // Custom plugin for dashboard utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom utilities
      addUtilities({
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0,0,0,0.10)',
        },
        '.text-shadow-md': {
          'text-shadow': '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.07)',
        },
        '.text-shadow-none': {
          'text-shadow': 'none',
        },
      })

      // Custom components
      addComponents({
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.soft'),
        },
        '.card-header': {
          marginBottom: theme('spacing.4'),
          paddingBottom: theme('spacing.4'),
          borderBottomWidth: '1px',
          borderBottomColor: theme('colors.gray.200'),
        },
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          borderRadius: theme('borderRadius.md'),
          transition: 'all 0.2s',
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme('colors.blue.500')}40`,
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.blue.600'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.blue.700'),
          },
        },
        '.gradient-text': {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      })
    },
  ],
  
  // Dark mode support (para futuro)
  darkMode: 'class',
}