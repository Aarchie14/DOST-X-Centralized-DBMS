export const readStorageJson = <T,>(storage: Storage, key: string, fallback: T): T => {
  try {
    const saved = storage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStorageJson = (storage: Storage, key: string, value: unknown): void => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Fail silently to keep application responsive
  }
};