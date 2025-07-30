export class NetworkDetector {
  private static instance: NetworkDetector;
  private listeners: Array<(online: boolean) => void> = [];
  private _isOnline: boolean = navigator.onLine;

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): NetworkDetector {
    if (!NetworkDetector.instance) {
      NetworkDetector.instance = new NetworkDetector();
    }
    return NetworkDetector.instance;
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this._isOnline = true;
      this.notifyListeners(true);
      console.log('🌐 Conexión restaurada');
    });

    window.addEventListener('offline', () => {
      this._isOnline = false;
      this.notifyListeners(false);
      console.log('🔌 Conexión perdida');
    });
  }

  async isOnline(): Promise<boolean> {
    // Verificación rápida del navegador
    if (!navigator.onLine) {
      this._isOnline = false;
      return false;
    }

    try {
      // Verificación más robusta con ping
       await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(3000) // 3 segundos timeout
      });
      
      this._isOnline = true;
      return true;
    } catch {
      this._isOnline = false;
      return false;
    }
  }

  get isOnlineSync(): boolean {
    return this._isOnline;
  }

  onStatusChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback);
    
    // Retornar función de cleanup
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(online: boolean): void {
    this.listeners.forEach(callback => {
      try {
        callback(online);
      } catch (error) {
        console.error('Error en listener de network status:', error);
      }
    });
  }
}

// Export singleton instance
export const networkDetector = NetworkDetector.getInstance();