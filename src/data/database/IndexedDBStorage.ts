/**
 * Robust cross-platform IndexedDB storage wrapper with automatic localStorage and in-memory fallback.
 */
export class IndexedDBStorage {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private isAvailable: boolean = true;
  private memoryFallback: Map<string, string> = new Map();

  constructor(dbName: string = 'BibleQuizDB', version: number = 1) {
    this.dbName = dbName;
    this.version = version;
  }

  private hasLocalStorage(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  public async init(): Promise<void> {
    if (typeof indexedDB === 'undefined') {
      this.isAvailable = false;
      return;
    }

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('questions')) {
            db.createObjectStore('questions', { keyPath: 'questionId' });
          }
          if (!db.objectStoreNames.contains('results')) {
            db.createObjectStore('results', { keyPath: 'resultId' });
          }
          if (!db.objectStoreNames.contains('kv')) {
            db.createObjectStore('kv', { keyPath: 'key' });
          }
        };

        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };

        request.onerror = () => {
          this.isAvailable = false;
          resolve();
        };
      } catch {
        this.isAvailable = false;
        resolve();
      }
    });
  }

  public async set<T>(storeName: string, key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    const storageKey = `${storeName}_${key}`;

    if (!this.isAvailable || !this.db) {
      if (this.hasLocalStorage()) {
        try {
          window.localStorage.setItem(storageKey, serialized);
        } catch {
          this.memoryFallback.set(storageKey, serialized);
        }
      } else {
        this.memoryFallback.set(storageKey, serialized);
      }
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const item = storeName === 'kv' ? { key, value } : value;
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch {
        // Fallback
        if (this.hasLocalStorage()) {
          try {
            window.localStorage.setItem(storageKey, serialized);
          } catch {
            this.memoryFallback.set(storageKey, serialized);
          }
        } else {
          this.memoryFallback.set(storageKey, serialized);
        }
        resolve();
      }
    });
  }

  public async get<T>(storeName: string, key: string): Promise<T | null> {
    const storageKey = `${storeName}_${key}`;

    if (!this.isAvailable || !this.db) {
      if (this.hasLocalStorage()) {
        try {
          const item = window.localStorage.getItem(storageKey);
          return item ? JSON.parse(item) : null;
        } catch {
          const item = this.memoryFallback.get(storageKey);
          return item ? JSON.parse(item) : null;
        }
      }
      const item = this.memoryFallback.get(storageKey);
      return item ? JSON.parse(item) : null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          if (request.result) {
            resolve(storeName === 'kv' ? request.result.value : request.result);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          if (this.hasLocalStorage()) {
            const item = window.localStorage.getItem(storageKey);
            resolve(item ? JSON.parse(item) : null);
          } else {
            const item = this.memoryFallback.get(storageKey);
            resolve(item ? JSON.parse(item) : null);
          }
        };
      } catch {
        if (this.hasLocalStorage()) {
          const item = window.localStorage.getItem(storageKey);
          resolve(item ? JSON.parse(item) : null);
        } else {
          const item = this.memoryFallback.get(storageKey);
          resolve(item ? JSON.parse(item) : null);
        }
      }
    });
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.isAvailable || !this.db) {
      const results: T[] = [];
      if (this.hasLocalStorage()) {
        try {
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && k.startsWith(`${storeName}_`)) {
              results.push(JSON.parse(window.localStorage.getItem(k)!));
            }
          }
        } catch {}
      } else {
        for (const [k, v] of this.memoryFallback.entries()) {
          if (k.startsWith(`${storeName}_`)) {
            results.push(JSON.parse(v));
          }
        }
      }
      return results;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      } catch {
        resolve([]);
      }
    });
  }
}
