export interface FieldMapping<S = any, D = any> {
  source: keyof S | string;
  destination: keyof D | string;
  converter?: (value: unknown, source: S) => unknown;
  asyncConverter?: (value: unknown, source: S) => Promise<unknown>;
  ignoreNull?: boolean;
  condition?: (source: S) => boolean;
  defaultValue?: unknown;
  defaultFactory?: () => unknown;
}

export interface MappingConfig<S = any, D = any> {
  sourceClass?: new (...args: any[]) => S;
  destinationClass?: new (...args: any[]) => D;
  fieldMappings?: FieldMapping<S, D>[];
  excludeFields?: (keyof D | string)[];
  autoMapping?: boolean;
  beforeMapping?: (source: S) => void | Promise<void>;
  afterMapping?: (source: S, destination: D) => void | Promise<void>;
  validate?: (source: S, destination: D) => void | Promise<void>;
}

export type TypeConstructor = Function | (new (...args: any[]) => any);

export interface Converter<S = unknown, D = unknown> {
  canConvert(sourceType: TypeConstructor, destinationType: TypeConstructor): boolean;
  convert(source: S, destinationType?: new (...args: any[]) => D): D;
}

export interface AsyncConverter<S = unknown, D = unknown> {
  canConvert(sourceType: TypeConstructor, destinationType: TypeConstructor): boolean;
  convertAsync(source: S, destinationType?: new (...args: any[]) => D): Promise<D>;
}

export interface MappingContext {
  mappedObjects: WeakMap<object, unknown>;
  depth: number;
  maxDepth: number;
  hasMapped(source: object): boolean;
  getMapped<T = unknown>(source: object): T | undefined;
  setMapped(source: object, destination: unknown): void;
  increaseDepth(): void;
  decreaseDepth(): void;
}

export type ErrorStrategy = 'throw' | 'skip' | 'default';

export interface MapperOptions {
  maxDepth?: number;
  strict?: boolean;
  throwOnError?: boolean;
  pick?: ReadonlyArray<string>;
  omit?: ReadonlyArray<string>;
  merge?: boolean;
  skipNullish?: boolean;
  onError?: ErrorStrategy;
  errorHandler?: <S = unknown>(error: Error, source: S, field?: string) => unknown;
  deep?: boolean;
  includeSymbols?: boolean;
  includeInherited?: boolean;
  includeNonEnumerable?: boolean;
  preserveDescriptors?: boolean;
}

export type ClassConstructor<T = any> = new (...args: any[]) => T;

export type MappingKey = string;

export type ExtractType<T> = T extends new (...args: any[]) => infer R ? R : never;

export interface MappingStats {
  totalMappings: number;
  totalTime: number;
  averageTime: number;
  lastMappingTime: number;
  errorCount: number;
  lastError?: Error;
}

export interface MappingLogger {
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void;
}

