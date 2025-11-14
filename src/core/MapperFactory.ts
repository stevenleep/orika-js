import { Mapper } from './Mapper';
import { MappingConfig, ClassConstructor, MapperOptions, MappingKey, AsyncConverter, MappingStats, MappingLogger } from '../types';
import { TypeUtils } from '../utils/TypeUtils';
import { ConverterRegistry } from '../converter/ConverterRegistry';
import { Converter } from '../types';
import { createMapperBuilder } from '../builder/MapperConfigBuilder';
import { BatchProcessor } from '../utils/BatchProcessor';

export class MapperFactory {
  private static instance: MapperFactory;
  private mappers: Map<MappingKey, Mapper<any, any>>;
  private converterRegistry: ConverterRegistry;
  private options: MapperOptions;
  private stats: Map<MappingKey, MappingStats>;
  private logger?: MappingLogger;
  private enableStats: boolean;

  private constructor(options: MapperOptions = {}) {
    this.mappers = new Map();
    this.converterRegistry = ConverterRegistry.getInstance();
    this.stats = new Map();
    this.enableStats = false;
    this.options = {
      maxDepth: options.maxDepth || 10,
      strict: options.strict !== false,
      throwOnError: options.throwOnError !== false,
    };
  }

  static getInstance(options?: MapperOptions): MapperFactory {
    if (!MapperFactory.instance) {
      MapperFactory.instance = new MapperFactory(options);
    }
    return MapperFactory.instance;
  }

  registerMapping<S, D>(config: MappingConfig<S, D>): MapperFactory {
    if (!config.sourceClass || !config.destinationClass) {
      throw new Error('Both sourceClass and destinationClass must be provided');
    }

    const key = TypeUtils.getMappingKey(config.sourceClass, config.destinationClass);
    const mapper = new Mapper<S, D>(config);
    this.mappers.set(key, mapper);

    return this;
  }

  getMapper<S, D>(
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>
  ): Mapper<S, D> | null {
    const key = TypeUtils.getMappingKey(sourceClass, destinationClass);
    return this.mappers.get(key) || null;
  }

  map<S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>,
    options?: MapperOptions
  ): D {
    const startTime = this.enableStats ? Date.now() : 0;
    const key = TypeUtils.getMappingKey(sourceClass, destinationClass);
    
    try {
      this.logger?.log('debug', `Mapping ${key}`, { source });

      const mapper = this.getMapper(sourceClass, destinationClass);
      
      if (!mapper) {
        if (this.options.throwOnError) {
          throw new Error(
            `No mapper registered for ${TypeUtils.getClassName(sourceClass)} -> ${TypeUtils.getClassName(destinationClass)}`
          );
        }
        
        const tempMapper = new Mapper<S, D>({
          sourceClass,
          destinationClass,
          autoMapping: true,
        });
        const result = tempMapper.map(source, undefined, options);
        this.recordStats(key, startTime, false);
        return result;
      }

      const result = mapper.map(source, undefined, options);
      this.recordStats(key, startTime, false);
      this.logger?.log('debug', `Mapping completed ${key}`);
      return result;
    } catch (error) {
      this.recordStats(key, startTime, true, error as Error);
      this.logger?.log('error', `Mapping failed ${key}`, { error });
      throw error;
    }
  }

  merge<S, D>(
    source: S,
    destination: D,
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>,
    options?: MapperOptions
  ): D {
    const mapper = this.getMapper(sourceClass, destinationClass);
    
    if (!mapper) {
      throw new Error(
        `No mapper registered for ${TypeUtils.getClassName(sourceClass)} -> ${TypeUtils.getClassName(destinationClass)}`
      );
    }

    return mapper.merge(source, destination, undefined, options);
  }

  mapChain<T>(source: any, ...classes: ClassConstructor<any>[]): T {
    if (classes.length < 2) {
      throw new Error('mapChain requires at least 2 classes');
    }

    let result: any = source;
    let currentClass: ClassConstructor<any> = source.constructor;

    for (const targetClass of classes) {
      result = this.map(result, currentClass, targetClass);
      currentClass = targetClass;
    }

    return result as T;
  }

  mapArray<S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>
  ): D[] {
    const mapper = this.getMapper(sourceClass, destinationClass);
    
    if (!mapper) {
      if (this.options.throwOnError) {
        throw new Error(
          `No mapper registered for ${TypeUtils.getClassName(sourceClass)} -> ${TypeUtils.getClassName(destinationClass)}`
        );
      }
      
      const tempMapper = new Mapper<S, D>({
        sourceClass,
        destinationClass,
        autoMapping: true,
      });
      return tempMapper.mapArray(sources);
    }

    return mapper.mapArray(sources);
  }

  registerConverter(converter: Converter): MapperFactory {
    this.converterRegistry.register(converter);
    return this;
  }

  unregisterConverter(converter: Converter): MapperFactory {
    this.converterRegistry.unregister(converter);
    return this;
  }

  clear(): void {
    this.mappers.clear();
  }

  getAllMappers(): Map<MappingKey, Mapper<any, any>> {
    return new Map(this.mappers);
  }

  hasMapping<S, D>(
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>
  ): boolean {
    const key = TypeUtils.getMappingKey(sourceClass, destinationClass);
    return this.mappers.has(key);
  }

  getOptions(): Readonly<MapperOptions> {
    return { ...this.options };
  }

  async mapAsync<S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>,
    options?: MapperOptions
  ): Promise<D> {
    const mapper = this.getMapper(sourceClass, destinationClass);
    
    if (!mapper) {
      if (this.options.throwOnError) {
        throw new Error(
          `No mapper registered for ${TypeUtils.getClassName(sourceClass)} -> ${TypeUtils.getClassName(destinationClass)}`
        );
      }
      
      const tempMapper = new Mapper<S, D>({
        sourceClass,
        destinationClass,
        autoMapping: true,
      });
      return await tempMapper.mapAsync(source, undefined, options);
    }

    return await mapper.mapAsync(source, undefined, options);
  }

  async mergeAsync<S, D>(
    source: S,
    destination: D,
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>,
    options?: MapperOptions
  ): Promise<D> {
    const mapper = this.getMapper(sourceClass, destinationClass);
    
    if (!mapper) {
      throw new Error(
        `No mapper registered for ${TypeUtils.getClassName(sourceClass)} -> ${TypeUtils.getClassName(destinationClass)}`
      );
    }

    return await mapper.mergeAsync(source, destination, undefined, options);
  }

  async mapArrayAsync<S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>
  ): Promise<D[]> {
    const mapper = this.getMapper(sourceClass, destinationClass);
    
    if (!mapper) {
      if (this.options.throwOnError) {
        throw new Error(
          `No mapper registered for ${TypeUtils.getClassName(sourceClass)} -> ${TypeUtils.getClassName(destinationClass)}`
        );
      }
      
      const tempMapper = new Mapper<S, D>({
        sourceClass,
        destinationClass,
        autoMapping: true,
      });
      return await tempMapper.mapArrayAsync(sources);
    }

    return await mapper.mapArrayAsync(sources);
  }

  async mapChainAsync<T>(source: any, ...classes: ClassConstructor<any>[]): Promise<T> {
    if (classes.length < 2) {
      throw new Error('mapChainAsync requires at least 2 classes');
    }

    let result: any = source;
    let currentClass: ClassConstructor<any> = source.constructor;

    for (const targetClass of classes) {
      result = await this.mapAsync(result, currentClass, targetClass);
      currentClass = targetClass;
    }

    return result as T;
  }

  registerAsyncConverter(converter: AsyncConverter): MapperFactory {
    this.converterRegistry.registerAsync(converter);
    return this;
  }

  unregisterAsyncConverter(converter: AsyncConverter): MapperFactory {
    this.converterRegistry.unregisterAsync(converter);
    return this;
  }

  bidirectional<A, B>(
    classA: ClassConstructor<A>,
    classB: ClassConstructor<B>,
    configA2B?: (builder: any) => void,
    configB2A?: (builder: any) => void
  ): MapperFactory {
    const builderA2B = createMapperBuilder<A, B>(classA, classB);
    if (configA2B) configA2B(builderA2B);
    builderA2B.register(this);

    const builderB2A = createMapperBuilder<B, A>(classB, classA);
    if (configB2A) configB2A(builderB2A);
    builderB2A.register(this);

    this.logger?.log('info', `Bidirectional mapping registered: ${TypeUtils.getClassName(classA)} <-> ${TypeUtils.getClassName(classB)}`);
    return this;
  }

  enableStatistics(enable: boolean = true): MapperFactory {
    this.enableStats = enable;
    return this;
  }

  setLogger(logger: MappingLogger): MapperFactory {
    this.logger = logger;
    return this;
  }

  getStats(sourceClass?: ClassConstructor<any>, destClass?: ClassConstructor<any>): MappingStats | Map<MappingKey, MappingStats> {
    if (sourceClass && destClass) {
      const key = TypeUtils.getMappingKey(sourceClass, destClass);
      return this.stats.get(key) || this.createEmptyStats();
    }
    return new Map(this.stats);
  }

  resetStats(): void {
    this.stats.clear();
  }

  private recordStats(key: MappingKey, startTime: number, isError: boolean, error?: Error): void {
    if (!this.enableStats) return;

    const elapsed = Date.now() - startTime;
    let stats = this.stats.get(key);

    if (!stats) {
      stats = this.createEmptyStats();
      this.stats.set(key, stats);
    }

    stats.totalMappings++;
    stats.totalTime += elapsed;
    stats.averageTime = stats.totalTime / stats.totalMappings;
    stats.lastMappingTime = elapsed;

    if (isError) {
      stats.errorCount++;
      stats.lastError = error;
    }
  }

  private createEmptyStats(): MappingStats {
    return {
      totalMappings: 0,
      totalTime: 0,
      averageTime: 0,
      lastMappingTime: 0,
      errorCount: 0,
    };
  }

  async mapArrayInBatches<S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destinationClass: ClassConstructor<D>,
    options?: {
      batchSize?: number;
      parallel?: boolean;
      onProgress?: (progress: any) => void;
    }
  ): Promise<D[]> {
    const mapper = this.getMapper(sourceClass, destinationClass);
    if (!mapper) {
      throw new Error(
        `No mapper registered for ${TypeUtils.getClassName(sourceClass)} -> ${TypeUtils.getClassName(destinationClass)}`
      );
    }

    return await BatchProcessor.processBatch(
      sources,
      (item: S) => mapper.mapAsync(item),
      options
    );
  }

  applyChanges<T>(
    changes: Partial<T>,
    targetClass: ClassConstructor<T>
  ): T {
    const changedFields = Object.keys(changes) as Array<keyof T>;
    
    return this.map(changes as T, targetClass, targetClass, {
      pick: changedFields.map(k => String(k)),
      merge: true
    }) as T;
  }

  diff<T extends Record<string, any>>(
    obj1: T,
    obj2: T
  ): Partial<T> {
    const changes: Partial<T> = {};
    const keys = Object.keys(obj1 as object) as Array<keyof T>;

    for (const key of keys) {
      if (obj1[key] !== obj2[key]) {
        changes[key] = obj2[key];
      }
    }

    return changes;
  }
}

