const winston = require('winston');
const path = require('path');

// Configuración de niveles de log
const logLevel = process.env.LOG_LEVEL || 'info';

// Formato personalizado para los logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }: { level: string; message: string; timestamp: string; stack?: string }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
  })
);

// Crear logger
export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // Consola - para desarrollo
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }: { level: string; message: string; timestamp: string }) => {
          return `🕐 ${timestamp} ${level}: ${message}`;
        })
      )
    }),
    
    // Archivo - todos los logs
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Archivo - solo errores
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Función helper para logs estructurados
export const logRequest = (req: any, duration?: number) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    duration: duration ? `${duration}ms` : undefined
  });
};

export default logger;