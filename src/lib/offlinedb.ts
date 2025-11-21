/* eslint-disable @typescript-eslint/no-explicit-any */
const DB_NAME = "BirdAppOfflineDB";
const DB_VERSION = 1;
interface OfflinePrediction {
  id?: string;
  type: "image" | "audio";
  data: Blob;
  timestamp: number;
  result?: any;
  synced: boolean;
  userId?: string;
}

interface OfflineQueueItem {
  id?: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  timestamp: number;
  synced: boolean;
}

class OfflineDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("predictions")) {
          const predictions = db.createObjectStore("predictions", {
            keyPath: "id",
            autoIncrement: true,
          });
          predictions.createIndex("timestamp", "timestamp", { unique: false });
          predictions.createIndex("synced", "synced", { unique: false });
          predictions.createIndex("userId", "userId", { unique: false });
        }

        if (!db.objectStoreNames.contains("syncQueue")) {
          const syncQueue = db.createObjectStore("syncQueue", {
            keyPath: "id",
            autoIncrement: true,
          });
          syncQueue.createIndex("timestamp", "timestamp", { unique: false });
          syncQueue.createIndex("synced", "synced", { unique: false });
        }

        if (!db.objectStoreNames.contains("apiCache")) {
          const apiCache = db.createObjectStore("apiCache", {
            keyPath: "url",
          });
          apiCache.createIndex("timestamp", "timestamp", { unique: false });
          apiCache.createIndex("ttl", "ttl", { unique: false });
        }

        if (!db.objectStoreNames.contains("userData")) {
          db.createObjectStore("userData", { keyPath: "key" });
        }
      };
    });
  }

  async savePrediction(
    prediction: OfflinePrediction
  ): Promise<number | string> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["predictions"], "readwrite");
      const store = transaction.objectStore("predictions");
      const request = store.add({
        ...prediction,
        timestamp: Date.now(),
        synced: false,
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as number);
    });
  }

  async getUnsyncedPredictions(): Promise<OfflinePrediction[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["predictions"], "readonly");
      const store = transaction.objectStore("predictions");
      const index = store.index("synced");
      const request = index.getAll(false as unknown as IDBValidKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async markPredictionAsSynced(id: number | string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["predictions"], "readwrite");
      const store = transaction.objectStore("predictions");
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const prediction = request.result;
        if (prediction) {
          prediction.synced = true;
          const updateRequest = store.put(prediction);
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => resolve();
        }
      };
    });
  }

  async addToSyncQueue(item: OfflineQueueItem): Promise<number | string> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["syncQueue"], "readwrite");
      const store = transaction.objectStore("syncQueue");
      const request = store.add({
        ...item,
        timestamp: Date.now(),
        synced: false,
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as number);
    });
  }

  async getUnsyncedQueue(): Promise<OfflineQueueItem[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["syncQueue"], "readonly");
      const store = transaction.objectStore("syncQueue");
      const index = store.index("synced");
      const request = index.getAll(false as unknown as IDBValidKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async markQueueItemAsSynced(id: number | string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["syncQueue"], "readwrite");
      const store = transaction.objectStore("syncQueue");
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const item = request.result;
        if (item) {
          item.synced = true;
          const updateRequest = store.put(item);
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => resolve();
        }
      };
    });
  }

  async cacheAPIResponse(
    url: string,
    data: any,
    ttlSeconds: number = 3600
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["apiCache"], "readwrite");
      const store = transaction.objectStore("apiCache");
      const request = store.put({
        url,
        data,
        timestamp: Date.now(),
        ttl: Date.now() + ttlSeconds * 1000,
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getFromAPICache(url: string): Promise<any | null> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["apiCache"], "readonly");
      const store = transaction.objectStore("apiCache");
      const request = store.get(url);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.ttl > Date.now()) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
    });
  }

  async cleanExpiredCache(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["apiCache"], "readwrite");
      const store = transaction.objectStore("apiCache");
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const items = request.result;
        const now = Date.now();

        items.forEach((item) => {
          if (item.ttl <= now) {
            store.delete(item.url);
          }
        });

        resolve();
      };
    });
  }

  async getStats(): Promise<{
    predictions: number;
    unsynced: number;
    queueSize: number;
    cacheSize: number;
  }> {
    if (!this.db) throw new Error("Database not initialized");

    const [predictions, unsynced, queueSize, cacheSize] = await Promise.all([
      this.countStore("predictions"),
      this.countUnsyncedPredictions(),
      this.countStore("syncQueue"),
      this.countStore("apiCache"),
    ]);

    return {
      predictions,
      unsynced,
      queueSize,
      cacheSize,
    };
  }

  private countStore(storeName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error("Database not initialized");

      const transaction = this.db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private countUnsyncedPredictions(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error("Database not initialized");

      const transaction = this.db.transaction(["predictions"], "readonly");
      const store = transaction.objectStore("predictions");
      const index = store.index("synced");
      const request = index.count(false as unknown as IDBValidKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async clear(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const stores = ["predictions", "syncQueue", "apiCache", "userData"];
      const transaction = this.db!.transaction(stores, "readwrite");

      stores.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        store.clear();
      });

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

let instance: OfflineDatabase | null = null;

export async function getOfflineDB(): Promise<OfflineDatabase> {
  if (!instance) {
    instance = new OfflineDatabase();
    await instance.init();
  }
  return instance;
}

export type { OfflinePrediction, OfflineQueueItem };
