export { Mapper } from './core/Mapper';
export { MapperFactory } from './core/MapperFactory';
export { DefaultMappingContext } from './core/MappingContext';

export { MapperConfigBuilder, createMapperBuilder } from './builder/MapperConfigBuilder';

export { 
  AbstractConverter, 
  AbstractAsyncConverter,
  FunctionConverter, 
  AsyncFunctionConverter,
  TypeConverter 
} from './converter/Converter';
export { 
  StringToNumberConverter,
  NumberToStringConverter,
  StringToBooleanConverter,
  StringToDateConverter,
  DateToStringConverter,
  DateToNumberConverter,
  NumberToDateConverter,
  ArrayConverter,
  MapConverter,
  SetConverter,
  getBuiltInConverters
} from './converter/BuiltInConverters';
export { ConverterRegistry } from './converter/ConverterRegistry';

export type {
  FieldMapping,
  MappingConfig,
  Converter,
  AsyncConverter,
  MappingContext,
  MapperOptions,
  ClassConstructor,
  MappingKey,
  ExtractType,
  MappingStats,
  MappingLogger,
  ErrorStrategy,
  TypeConstructor
} from './types';

export type {
  TypeSafeFieldMapping,
  PropertyType,
  NoAny,
  StrictFieldName,
  CommonFields,
  FieldValue,
  FieldTransform,
  AsyncFieldTransform,
  PartialMapping,
  DeepPartial,
  DeepReadonly,
  DeepRequired
} from './types/strict-types';

export type {
  RequireProps,
  OptionalProps,
  ExcludeByType,
  IncludeByType,
  Writable,
  Flatten,
  Merge,
  Nullable,
  NonNullableDeep,
  Awaited,
  SafeAccess,
  KeysOfType,
  Primitive,
  ValidationResult,
  Result
} from './types/utility-types';

export {
  isConstructor,
  isAsyncConverter,
  isValidMappingConfig,
  hasConverter,
  hasAsyncConverter,
  isPromise,
  isNonNullable,
  assertType,
  assertNonNull
} from './types/type-guards';

export type {
  Brand,
  Email,
  Url,
  UUID,
  PositiveNumber,
  NonEmptyString
} from './types/branded-types';
export { BrandedTypeValidators } from './types/branded-types';

export type {
  ClassProperties,
  ClassToInterface,
  ClassToType,
  ClassInstance,
  OmitClassProperties,
  PickClassProperties,
  PartialClass,
  RequiredClass,
  ReadonlyClass,
  ClassPropertiesOfType,
  MockClass
} from './types/class-utilities';
export { 
  asClass, 
  toClassProperties, 
  hasClassProperties 
} from './types/class-utilities';

export { TypeUtils } from './utils/TypeUtils';
export { ConsoleLogger } from './utils/ConsoleLogger';
export { BatchProcessor } from './utils/BatchProcessor';
export type { BatchOptions, BatchProgress } from './utils/BatchProcessor';
export { ErrorHandler } from './utils/ErrorHandler';
export type { ErrorRecoveryOptions } from './utils/ErrorHandler';
export { getProperty, setProperty, hasProperty, getPropertyOrDefault, getKeys, getEntries, getValues } from './utils/TypeSafeAccess';
export { PropertyUtils } from './utils/PropertyUtils';
export type { PropertyDescriptorOptions } from './utils/PropertyUtils';

export { MappingCache } from './cache/MappingCache';
export type { CacheOptions, CacheEntry } from './cache/MappingCache';

export { 
  MapTo, 
  MapField, 
  MapFrom,
  Exclude, 
  Transform, 
  TransformAsync,
  ConvertWith,
  Format,
  IgnoreNull,
  IgnoreUndefined,
  IgnoreNullish,
  MapWhen,
  Default,
  DefaultFactory,
  Nested,
  BeforeMapping,
  AfterMapping,
  createMappingFromDecorators 
} from './decorators';

export { ExpressionEvaluator } from './expression/ExpressionEvaluator';

import { MapperFactory as MF } from './core/MapperFactory';
import { createMapperBuilder as CMB } from './builder/MapperConfigBuilder';
import { ConverterRegistry as CR } from './converter/ConverterRegistry';

export default {
  MapperFactory: MF,
  createMapperBuilder: CMB,
  ConverterRegistry: CR,
};

