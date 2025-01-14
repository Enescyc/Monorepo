import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { AI_CACHE_TTL } from '../constants/ai.constants';

export const getCacheConfig = (
  _configService: ConfigService,
): CacheModuleOptions => {
  return {
    ttl: AI_CACHE_TTL,
    max: 100, // Maximum number of items in cache
  };
}; 