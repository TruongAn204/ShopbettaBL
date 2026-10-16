/**
 * Configuration Factory
 * Loads and validates environment variables
 */

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/shop_db?schema=public',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-shop-betta-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origins: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*',
  },
});
