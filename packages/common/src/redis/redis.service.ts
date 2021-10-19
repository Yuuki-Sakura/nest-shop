import { Injectable, Inject } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { KeyType, Ok, Redis } from 'ioredis';
import { RedisClient, RedisClientError } from './redis-client.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  getClient(name?: string): Redis {
    if (!name) {
      name = this.redisClient.defaultKey;
    }
    if (!this.redisClient.clients.has(name)) {
      throw new RedisClientError(`client ${name} does not exist`);
    }
    return this.redisClient.clients.get(name);
  }

  getClients(): Map<string, Redis> {
    return this.redisClient.clients;
  }

  async get<T>(key: KeyType, name?: string) {
    return ((value) => {
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        return value as unknown as T;
      }
    })(await this.getClient(name).get(key));
  }

  set<T>(
    key: KeyType,
    value: T,
    options: {
      expiryMode?: string | any[];
      time?: number | string;
      setMode?: number | string;
      name?: string;
    } = {},
  ): Promise<Ok | null> {
    const { expiryMode, time, setMode } = options;
    if (expiryMode)
      return this.getClient(options?.name).set(
        key,
        JSON.stringify(value),
        expiryMode,
        time,
        setMode,
      );
    return this.getClient(options?.name).set(key, JSON.stringify(value));
  }

  del(key: KeyType, name?: string) {
    return this.getClient(name).del(key);
  }
}
