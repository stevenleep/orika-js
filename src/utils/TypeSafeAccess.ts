export function getProperty<T, K extends PropertyKey>(obj: T, key: K): unknown {
  return (obj as any)[key];
}

export function setProperty<T, K extends PropertyKey>(obj: T, key: K, value: unknown): void {
  (obj as any)[key] = value;
}

export function hasProperty<T>(obj: T, key: PropertyKey): boolean {
  return typeof obj === 'object' && obj !== null && key in obj;
}

export function getPropertyOrDefault<T, K extends PropertyKey, D>(obj: T, key: K, defaultValue: D): unknown | D {
  const value = getProperty(obj, key);
  return value !== undefined ? value : defaultValue;
}

export function getKeys<T>(obj: T): string[] {
  return Object.keys(obj as any);
}

export function getEntries<T>(obj: T): Array<[string, unknown]> {
  return Object.entries(obj as any);
}

export function getValues<T>(obj: T): unknown[] {
  return Object.values(obj as any);
}

