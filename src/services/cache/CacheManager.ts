export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

export interface CacheProvider<T> {
  get(key: string): Promise<CacheEntry<T> | null> | CacheEntry<T> | null;
  set(key: string, data: CacheEntry<T>): Promise<void> | void;
  remove(key: string): Promise<void> | void;
  clear(): Promise<void> | void;
}

export class CacheManager<T> {
  private providers: CacheProvider<T>[] = [];
  private readonly ttl: number;

  constructor(ttl: number = 5 * 60 * 1000) {
    this.ttl = ttl;
  }

  addProvider(provider: CacheProvider<T>): void {
    this.providers.push(provider);
  }

  private isValid(entry: CacheEntry<T> | null): boolean {
    if (!entry) return false;
    const currentTime = Date.now();
    return currentTime - entry.timestamp < this.ttl;
  }

  async get(key: string): Promise<T | null> {
    // Intentar con cada provider en orden
    for (const provider of this.providers) {
      try {
        const entry = await provider.get(key);
        if (this.isValid(entry)) {
          console.log(`✅ Cache hit en provider para key: ${key}`);
          // Propagar a providers anteriores si es necesario
          await this.propagateToFasterProviders(key, entry!, provider);
          return entry!.data;
        }
      } catch (error) {
        console.warn(`⚠️ Error en cache provider para ${key}:`, error);
      }
    }

    console.log(`❌ Cache miss para key: ${key}`);
    return null;
  }

  async set(key: string, data: T): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: "1.0",
    };

    // Guardar en todos los providers
    const promises = this.providers.map(async (provider) => {
      try {
        await provider.set(key, entry);
      } catch (error) {
        console.warn(
          `⚠️ Error guardando en cache provider para ${key}:`,
          error
        );
      }
    });

    await Promise.allSettled(promises);
    console.log(`💾 Datos guardados en cache para key: ${key}`);
  }

  private async propagateToFasterProviders(
    key: string,
    entry: CacheEntry<T>,
    sourceProvider: CacheProvider<T>
  ): Promise<void> {
    const sourceIndex = this.providers.indexOf(sourceProvider);
    if (sourceIndex <= 0) return;

    // Propagar a providers más rápidos (anteriores en la lista)
    const fasterProviders = this.providers.slice(0, sourceIndex);
    const promises = fasterProviders.map((provider) =>
      provider.set(key, entry)
    );
    await Promise.allSettled(promises);
  }

  async invalidate(key: string): Promise<void> {
    const promises = this.providers.map((provider) => provider.remove(key));
    await Promise.allSettled(promises);
    console.log(`🗑️ Cache invalidado para key: ${key}`);
  }

  async clear(): Promise<void> {
    const promises = this.providers.map((provider) => provider.clear());
    await Promise.allSettled(promises);
    console.log("🗑️ Todo el cache limpiado");
  }

  getStatus(): any {
    return {
      providers: this.providers.length,
      ttl: this.ttl,
    };
  }
}
