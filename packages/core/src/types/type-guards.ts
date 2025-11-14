import { ClassConstructor, Converter, AsyncConverter, FieldMapping, MappingConfig } from './index';

export function isConstructor<T>(value: unknown): value is ClassConstructor<T> {
  return typeof value === 'function' && value.prototype !== undefined;
}

export function isAsyncConverter(converter: Converter | AsyncConverter): converter is AsyncConverter {
  return 'convertAsync' in converter;
}

export function isValidMappingConfig<S, D>(config: Partial<MappingConfig<S, D>>): config is MappingConfig<S, D> {
  return (
    config.sourceClass !== undefined &&
    config.destinationClass !== undefined &&
    isConstructor(config.sourceClass) &&
    isConstructor(config.destinationClass)
  );
}

export function hasConverter<S, D>(mapping: FieldMapping<S, D>): mapping is FieldMapping<S, D> & { converter: NonNullable<FieldMapping<S, D>['converter']> } {
  return mapping.converter !== undefined;
}

export function hasAsyncConverter<S, D>(mapping: FieldMapping<S, D>): mapping is FieldMapping<S, D> & { asyncConverter: NonNullable<FieldMapping<S, D>['asyncConverter']> } {
  return mapping.asyncConverter !== undefined;
}

export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise || (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as any).then === 'function'
  );
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function assertType<T>(value: unknown, guard: (v: unknown) => v is T, message?: string): asserts value is T {
  if (!guard(value)) {
    throw new TypeError(message || 'Type assertion failed');
  }
}

export function assertNonNull<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new TypeError(message || 'Value is null or undefined');
  }
}

