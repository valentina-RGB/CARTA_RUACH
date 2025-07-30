import type { CacheProvider, CacheEntry } from './CacheManager';

export class MemoryCache<T> implements CacheProvider<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly name: string;

  constructor(name: string = 'Memory') {
    this.name = name;
  }

  get(key: string): CacheEntry<T> | null {
    const entry = this.cache.get(key);
    if (entry) {
      console.log(`⚡ ${this.name} cache hit: ${key}`);
      return entry;
    }
    return null;
  }

  set(key: string, entry: CacheEntry<T>): void {
    this.cache.set(key, entry);
    console.log(`💾 ${this.name} cache set: ${key}`);
  }

  remove(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ ${this.name} cache removed: ${key}`);
  }

  clear(): void {
    this.cache.clear();
    console.log(`🗑️ ${this.name} cache cleared`);
  }

  getSize(): number {
    return this.cache.size;
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}