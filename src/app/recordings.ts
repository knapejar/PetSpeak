export type StoredRecording = {
  id: number;
  createdAt: number;
  blob: Blob;
};

const DB_NAME = "petspeak";
const DB_VERSION = 1;
const STORE_NAME = "recordings";
const UPDATE_EVENT = "petspeak:recordings-updated";

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this browser."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open recordings database."));
    };
  });
};

const runTransaction = async <T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore, resolve: (value: T) => void, reject: (error: unknown) => void) => void
): Promise<T> => {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);

    action(store, resolve, reject);

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onerror = () => {
      reject(transaction.error ?? new Error("Recording transaction failed."));
    };
  });
};

export const saveRecordingToGallery = async (blob: Blob): Promise<void> => {
  await runTransaction<void>("readwrite", (store, resolve, reject) => {
    const request = store.add({
      createdAt: Date.now(),
      blob,
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("Unable to save recording."));
  });

  window.dispatchEvent(new Event(UPDATE_EVENT));
};

export const listRecordingsFromGallery = async (): Promise<StoredRecording[]> => {
  return runTransaction<StoredRecording[]>("readonly", (store, resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      const results = (request.result as StoredRecording[]).sort(
        (left, right) => right.createdAt - left.createdAt
      );
      resolve(results);
    };

    request.onerror = () => reject(request.error ?? new Error("Unable to read recordings."));
  });
};

export const recordingsUpdatedEvent = UPDATE_EVENT;
