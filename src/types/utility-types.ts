export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ExcludeByType<T, ExcludeType> = {
  [K in keyof T as T[K] extends ExcludeType ? never : K]: T[K];
};

export type IncludeByType<T, IncludeType> = {
  [K in keyof T as T[K] extends IncludeType ? K : never]: T[K];
};

export type Parameters<T> = T extends (...args: infer P) => any ? P : never;

export type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Flatten<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type Merge<A, B> = Flatten<Omit<A, keyof B> & B>;

export type Nullable<T> = T | null | undefined;

export type NonNullableDeep<T> = T extends object
  ? { [K in keyof T]: NonNullableDeep<NonNullable<T[K]>> }
  : NonNullable<T>;

export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type SafeAccess<T, K> = K extends keyof T ? T[K] : never;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type IsPrimitive<T> = T extends Primitive ? true : false;

export type IsObject<T> = T extends object ? true : false;

export type Brand<T, B> = T & { __brand: B };

export type ValidationResult<T> = 
  | { success: true; value: T }
  | { success: false; error: Error };

export type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

