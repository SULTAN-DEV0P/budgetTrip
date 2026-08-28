import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config();

const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS) || 86400; // 24 hours

export const cache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: 600,
  useClones: false,
});
