export type PropertyType<T, K extends keyof T> = T[K];

export type NoAny<T> = 0 extends (1 & T) ? never : T;

export type StrictFieldName<T> = keyof T & string;

export type CommonFields<S, D> = Extract<keyof S, keyof D>;

export type FieldValue<T, K> = K extends keyof T ? T[K] : unknown;

export type FieldTransform<S, SK extends keyof S, D, DK extends keyof D> = {
  source: SK;
  destination: DK;
  converter: (value: S[SK], source: S) => D[DK];
};

export type AsyncFieldTransform<S, SK extends keyof S, D, DK extends keyof D> = {
  source: SK;
  destination: DK;
  converter: (value: S[SK], source: S) => Promise<D[DK]>;
};

export interface TypeSafeFieldMapping<S, D, SK extends keyof S = keyof S, DK extends keyof D = keyof D> {
  source: SK;
  destination: DK;
  converter?: (value: S[SK], source: S) => D[DK];
  asyncConverter?: (value: S[SK], source: S) => Promise<D[DK]>;
  ignoreNull?: boolean;
  condition?: (source: S) => boolean;
  defaultValue?: D[DK];
  defaultFactory?: () => D[DK];
}

export type PartialMapping<T> = {
  [P in keyof T]?: T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type TypeGuard<T> = (value: unknown) => value is T;

export type EnsureConstructor<T> = T extends new (...args: any[]) => any ? T : never;

export type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : never;

export type MappedResult<S, D> = {
  [K in keyof D]: K extends keyof S ? S[K] : D[K];
};

export type PickByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

export type OmitByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? never : K]: T[K];
};

