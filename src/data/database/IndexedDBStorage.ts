/**
 * Robust cross-platform IndexedDB storage wrapper with automatic localStorage fallback.
 */
export class IndexedDBStorage {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null = null;
  private isAvailable: boolean = true;

  constructor(dbName: string = 'BibleQuizDB', version: number = 1) {
    this.dbName = dbName;
    this.version = version;
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
    if (!this.isAvailable || !this.db) {
      try {
        localStorage.setItem(`${storeName}_${key}`, JSON.stringify(value));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
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
      } catch (err) {
        // Fallback
        localStorage.setItem(`${storeName}_${key}`, JSON.stringify(value));
        resolve();
      }
    });
  }

  public async get<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.isAvailable || !this.db) {
      const item = localStorage.getItem(`${storeName}_${key}`);
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
          const item = localStorage.getItem(`${storeName}_${key}`);
          resolve(item ? JSON.parse(item) : null);
        };
      } catch {
        const item = localStorage.getItem(`${storeName}_${key}`);
        resolve(item ? JSON.parse(item) : null);
      }
    });
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.isAvailable || !this.db) {
      const results: T[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(`${storeName}_`)) {
          results.push(JSON.parse(localStorage.getItem(k)!));
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
