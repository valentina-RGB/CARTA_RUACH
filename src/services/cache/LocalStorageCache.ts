import type { CacheProvider, CacheEntry } from './CacheManager';

export class LocalStorageCache<T> implements CacheProvider<T> {
  private readonly prefix: string;
  private readonly name: string;

  constructor(prefix: string = 'ruach', name: string = 'localStorage') {
    this.prefix = prefix;
    this.name = name;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}_${key}`;
  }

  get(key: string): CacheEntry<T> | null {
    try {
      const fullKey = this.getFullKey(key);
      const stored = localStorage.getItem(fullKey);
      
      if (!stored) return null;

      const entry = JSON.parse(stored) as CacheEntry<T>;
      console.log(`💾 ${this.name} cache hit: ${key}`);
      return entry;
    } catch (error) {
      console.error(`❌ Error reading from ${this.name} cache:`, error);
      this.remove(key);
      return null;
    }
  }

  set(key: string, entry: CacheEntry<T>): void {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.setItem(fullKey, JSON.stringify(entry));
      console.log(`💾 ${this.name} cache set: ${key}`);
    } catch (error) {
      console.error(`❌ Error writing to ${this.name} cache:`, error);
    }
  }

  remove(key: string): void {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
      console.log(`🗑️ ${this.name} cache removed: ${key}`);
    } catch (error) {
      console.error(`❌ Error removing from ${this.name} cache:`, error);
    }
  }

  clear(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`🗑️ ${this.name} cache cleared (${keysToRemove.length} items)`);
    } catch (error) {
      console.error(`❌ Error clearing ${this.name} cache:`, error);
    }
  }

  getSize(): number {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        count++;
      }
    }
    return count;
  }
}