import * as dotenv from 'dotenv';
import { app } from './app';
import { logger } from './utils/logger';

// Cargar variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
  logger.info(`📊 Dashboard API v${process.env.API_VERSION || 'v1'}`);
  logger.info(`🗄️  Base de datos: ${process.env.DATABASE_URL ? 'Conectada' : 'No configurada'}`);
  logger.info(`📱 CORS habilitado para: ${process.env.CORS_ORIGIN}`);
});

// Manejo de errores no capturados - comentado temporalmente
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   process.exit(1);
// });

// process.on('uncaughtException', (error) => {
//   logger.error('Uncaught Exception thrown:', error);
//   process.exit(1);
// });