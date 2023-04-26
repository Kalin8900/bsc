import { RedisClientOptions } from 'redis';

export default (): { redis: RedisClientOptions } => ({
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  }
});
