export interface CacheOptions {
  enabled?: boolean;
  maxSize?: number;
  ttl?: number;
  strategy?: 'lru' | 'fifo';
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
}

export class MappingCache<K = any, V = any> {
  private cache: Map<string, CacheEntry<V>>;
  private options: Required<CacheOptions>;
  private accessOrder: string[];

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.accessOrder = [];
    this.options = {
      enabled: options.enabled !== false,
      maxSize: options.maxSize || 1000,
      ttl: options.ttl || 60000,
      strategy: options.strategy || 'lru',
    };
  }

  get(key: K): V | undefined {
    if (!this.options.enabled) {
      return undefined;
    }

    const cacheKey = this.serializeKey(key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return undefined;
    }

    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.cache.delete(cacheKey);
      return undefined;
    }

    if (this.options.strategy === 'lru') {
      const index = this.accessOrder.indexOf(cacheKey);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.accessOrder.push(cacheKey);
    }

    entry.hits++;
    return entry.value;
  }

  set(key: K, value: V): void {
    if (!this.options.enabled) {
      return;
    }

    const cacheKey = this.serializeKey(key);

    if (this.cache.size >= this.options.maxSize && !this.cache.has(cacheKey)) {
      this.evict();
    }

    this.cache.set(cacheKey, {
      value,
      timestamp: Date.now(),
      hits: 0,
    });

    this.accessOrder.push(cacheKey);
  }

  has(key: K): boolean {
    if (!this.options.enabled) {
      return false;
    }

    const cacheKey = this.serializeKey(key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return false;
    }

    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.cache.delete(cacheKey);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  getStats() {
    let totalHits = 0;
    this.cache.forEach(entry => {
      totalHits += entry.hits;
    });

    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      totalHits,
      averageHits: this.cache.size > 0 ? totalHits / this.cache.size : 0,
    };
  }

  private serializeKey(key: K): string {
    if (typeof key === 'string') {
      return key;
    }
    try {
      return JSON.stringify(key);
    } catch {
      return String(key);
    }
  }

  private evict(): void {
    if (this.cache.size === 0) {
      return;
    }

    if (this.options.strategy === 'lru') {
      const lruKey = this.accessOrder.shift();
      if (lruKey) {
        this.cache.delete(lruKey);
      }
    } else {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }
}

