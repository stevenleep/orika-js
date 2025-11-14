import { MappingConfig, MappingContext, MapperOptions } from '../types';
import { TypeUtils } from '../utils/TypeUtils';
import { DefaultMappingContext } from './MappingContext';
import { ConverterRegistry } from '../converter/ConverterRegistry';
import { getProperty, setProperty, getKeys } from '../utils/TypeSafeAccess';
import { PropertyUtils } from '../utils/PropertyUtils';

export class Mapper<S = any, D = any> {
  private config: Required<MappingConfig<S, D>>;
  private converterRegistry: ConverterRegistry;

  constructor(config: MappingConfig<S, D>) {
    this.config = {
      sourceClass: config.sourceClass || (Object as any),
      destinationClass: config.destinationClass || (Object as any),
      fieldMappings: config.fieldMappings || [],
      excludeFields: config.excludeFields || [],
      autoMapping: config.autoMapping !== false,
      beforeMapping: config.beforeMapping || (() => {}),
      afterMapping: config.afterMapping || (() => {}),
      validate: config.validate || (() => {}),
    };
    
    this.converterRegistry = ConverterRegistry.getInstance();
  }

  map(source: S, context?: MappingContext, options?: MapperOptions): D {
    if (source === null || source === undefined) {
      return source as any;
    }

    const ctx = context || new DefaultMappingContext();

    if (ctx.hasMapped(source)) {
      return ctx.getMapped<D>(source)!;
    }

    ctx.increaseDepth();

    try {
      this.config.beforeMapping(source);

      const destination = this.createDestination();
      ctx.setMapped(source, destination);

      this.mapFields(source, destination, ctx, options);

      this.config.afterMapping(source, destination);

      if (this.config.validate && !(this.config.validate as any).constructor.name.includes('Async')) {
        (this.config.validate as any)(source, destination);
      }

      ctx.decreaseDepth();
      return destination;
    } catch (error) {
      ctx.decreaseDepth();
      throw error;
    }
  }

  merge(source: S, destination: D, context?: MappingContext, options?: MapperOptions): D {
    if (source === null || source === undefined) {
      return destination;
    }

    const ctx = context || new DefaultMappingContext();
    const mergeOptions = { ...options, merge: true };

    this.config.beforeMapping(source);
    this.mapFields(source, destination, ctx, mergeOptions);
    this.config.afterMapping(source, destination);

    return destination;
  }

  mapArray(sources: S[], context?: MappingContext): D[] {
    if (!Array.isArray(sources)) {
      throw new Error('Source must be an array');
    }

    const ctx = context || new DefaultMappingContext();
    return sources.map(source => this.map(source, ctx));
  }

  async mapAsync(source: S, context?: MappingContext, options?: MapperOptions): Promise<D> {
    if (source === null || source === undefined) {
      return source as any;
    }

    const ctx = context || new DefaultMappingContext();

    if (ctx.hasMapped(source)) {
      return ctx.getMapped<D>(source)!;
    }

    ctx.increaseDepth();

    try {
      await this.config.beforeMapping(source);

      const destination = this.createDestination();
      ctx.setMapped(source, destination);

      await this.mapFieldsAsync(source, destination, ctx, options);

      await this.config.afterMapping(source, destination);

      if (this.config.validate) {
        await this.config.validate(source, destination);
      }

      ctx.decreaseDepth();
      return destination;
    } catch (error) {
      ctx.decreaseDepth();
      throw error;
    }
  }

  async mergeAsync(source: S, destination: D, context?: MappingContext, options?: MapperOptions): Promise<D> {
    if (source === null || source === undefined) {
      return destination;
    }

    const ctx = context || new DefaultMappingContext();
    const mergeOptions = { ...options, merge: true };

    await this.config.beforeMapping(source);
    await this.mapFieldsAsync(source, destination, ctx, mergeOptions);
    await this.config.afterMapping(source, destination);

    return destination;
  }

  async mapArrayAsync(sources: S[], context?: MappingContext): Promise<D[]> {
    if (!Array.isArray(sources)) {
      throw new Error('Source must be an array');
    }

    const ctx = context || new DefaultMappingContext();
    return await Promise.all(sources.map(source => this.mapAsync(source, ctx)));
  }

  private createDestination(): D {
    try {
      return new this.config.destinationClass();
    } catch (error) {
      return {} as D;
    }
  }

  private mapFields(source: S, destination: D, context: MappingContext, options?: MapperOptions): void {
    const pick = options?.pick ? new Set(options.pick) : null;
    const omit = options?.omit ? new Set(options.omit) : null;
    const isMergeMode = options?.merge || false;
    const skipNullish = options?.skipNullish || false;

    // 显式字段映射
    this.config.fieldMappings.forEach(mapping => {
      const destField = String(mapping.destination);
      
      if (pick && !pick.has(destField)) return;
      if (omit && omit.has(destField)) return;
      
      this.mapField(source, destination, mapping, context, isMergeMode, skipNullish);
    });

    // 自动映射同名字段
    if (this.config.autoMapping) {
      this.autoMapFields(source, destination, context, pick, omit, isMergeMode, skipNullish, options);
    }
  }

  private mapField(
    source: S,
    destination: D,
    mapping: any,
    context: MappingContext,
    isMergeMode: boolean = false,
    skipNullish: boolean = false
  ): void {
    if (mapping.condition && !mapping.condition(source)) {
      return;
    }

    let sourceValue = getProperty(source, mapping.source);

    if ((sourceValue === null || sourceValue === undefined)) {
      if (mapping.defaultValue !== undefined) {
        sourceValue = mapping.defaultValue;
      } else if (mapping.defaultFactory) {
        sourceValue = mapping.defaultFactory();
      } else if (mapping.ignoreNull || skipNullish) {
        return;
      }
    }

    if (isMergeMode && getProperty(destination, mapping.destination) !== undefined) {
      return;
    }

    let destinationValue: unknown;

    try {
      if (mapping.converter) {
        destinationValue = mapping.converter(sourceValue, source);
      } else {
        destinationValue = this.convertValue(sourceValue, context);
      }
    } catch (error) {
      if (mapping.defaultValue !== undefined) {
        destinationValue = mapping.defaultValue;
      } else if (mapping.defaultFactory) {
        destinationValue = mapping.defaultFactory();
      } else {
        throw error;
      }
    }

    setProperty(destination, mapping.destination, destinationValue);
  }

  private autoMapFields(
    source: S, 
    destination: D, 
    context: MappingContext,
    pick: Set<string> | null = null,
    omit: Set<string> | null = null,
    isMergeMode: boolean = false,
    skipNullish: boolean = false,
    options?: MapperOptions
  ): void {
    const sourceKeys = this.getPropertyKeys(source, options);
    const mappedSourceFields = new Set(
      this.config.fieldMappings.map(m => String(m.source))
    );
    const excludedFields = new Set(
      this.config.excludeFields.map(f => String(f))
    );

    sourceKeys.forEach(key => {
      const keyStr = String(key);
      
      if (mappedSourceFields.has(keyStr) || excludedFields.has(keyStr)) {
        return;
      }

      if (pick && !pick.has(keyStr)) return;
      if (omit && omit.has(keyStr)) return;

      const sourceValue = getProperty(source, key);

      if (skipNullish && (sourceValue === null || sourceValue === undefined)) {
        return;
      }

      if (isMergeMode && getProperty(destination, key) !== undefined) {
        return;
      }

      let destinationValue: unknown;
      
      if (options?.deep === false) {
        destinationValue = sourceValue;
      } else if (options?.preserveDescriptors) {
        PropertyUtils.copyProperty(source, destination, key);
        return;
      } else {
        destinationValue = this.convertValue(sourceValue, context);
      }

      setProperty(destination, key, destinationValue);
    });
  }

  private getPropertyKeys(obj: any, options?: MapperOptions): PropertyKey[] {
    if (options?.includeSymbols || options?.includeInherited || options?.includeNonEnumerable) {
      return PropertyUtils.getAllKeys(obj, {
        includeSymbols: options.includeSymbols,
        includeInherited: options.includeInherited,
        includeNonEnumerable: options.includeNonEnumerable
      });
    }

    return getKeys(obj);
  }

  private convertValue(value: unknown, context: MappingContext): unknown {
    if (value === null || value === undefined) return value;
    if (TypeUtils.isPrimitive(value)) return value;
    if (TypeUtils.isDate(value)) return new Date((value as Date).getTime());
    if (TypeUtils.isSet(value)) return this.convertSet(value as Set<unknown>, context);
    if (TypeUtils.isMap(value)) return this.convertMap(value as Map<unknown, unknown>, context);
    if (TypeUtils.isArray(value)) return (value as unknown[]).map((item: unknown) => this.convertValue(item, context));
    if (TypeUtils.isPlainObject(value)) return this.deepMapObject(value as object, context);

    if (TypeUtils.isClassInstance(value)) {
      const converter = this.converterRegistry.findConverter(
        value.constructor,
        this.config.destinationClass
      );
      
      if (converter) {
        return converter.convert(value, this.config.destinationClass);
      }
      
      return value;
    }

    return value;
  }

  private convertSet(sourceSet: Set<unknown>, context: MappingContext): Set<unknown> {
    const result = new Set<unknown>();
    sourceSet.forEach(item => result.add(this.convertValue(item, context)));
    return result;
  }

  private convertMap(sourceMap: Map<unknown, unknown>, context: MappingContext): Map<unknown, unknown> {
    const result = new Map<unknown, unknown>();
    sourceMap.forEach((value, key) => {
      const newKey = this.convertValue(key, context);
      const newValue = this.convertValue(value, context);
      result.set(newKey, newValue);
    });
    return result;
  }

  private deepMapObject(obj: object, context: MappingContext): Record<string, unknown> {
    if (context.hasMapped(obj)) {
      return context.getMapped(obj) as Record<string, unknown>;
    }

    const result: Record<string, unknown> = {};
    context.setMapped(obj, result);

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = this.convertValue(getProperty(obj, key), context);
      }
    }

    return result;
  }

  getConfig(): Readonly<MappingConfig<S, D>> {
    return this.config;
  }

  private async mapFieldsAsync(source: S, destination: D, context: MappingContext, options?: MapperOptions): Promise<void> {
    const pick = options?.pick ? new Set(options.pick) : null;
    const omit = options?.omit ? new Set(options.omit) : null;
    const isMergeMode = options?.merge || false;
    const skipNullish = options?.skipNullish || false;

    for (const mapping of this.config.fieldMappings) {
      const destField = String(mapping.destination);
      
      if (pick && !pick.has(destField)) continue;
      if (omit && omit.has(destField)) continue;
      
      await this.mapFieldAsync(source, destination, mapping, context, isMergeMode, skipNullish);
    }

    if (this.config.autoMapping) {
      await this.autoMapFieldsAsync(source, destination, context, pick, omit, isMergeMode, skipNullish, options);
    }
  }

  private async mapFieldAsync(
    source: S,
    destination: D,
    mapping: any,
    context: MappingContext,
    isMergeMode: boolean = false,
    skipNullish: boolean = false
  ): Promise<void> {
    if (mapping.condition && !mapping.condition(source)) {
      return;
    }

    const sourceValue = getProperty(source, mapping.source);

    if (mapping.ignoreNull && (sourceValue === null || sourceValue === undefined)) {
      return;
    }

    if (skipNullish && (sourceValue === null || sourceValue === undefined)) {
      return;
    }

    if (isMergeMode && getProperty(destination, mapping.destination) !== undefined) {
      return;
    }

    let destinationValue: unknown;

    if (mapping.asyncConverter) {
      destinationValue = await mapping.asyncConverter(sourceValue, source);
    } else if (mapping.converter) {
      destinationValue = mapping.converter(sourceValue, source);
    } else {
      destinationValue = await this.convertValueAsync(sourceValue, context);
    }

    setProperty(destination, mapping.destination, destinationValue);
  }

  private async autoMapFieldsAsync(
    source: S, 
    destination: D, 
    context: MappingContext,
    pick: Set<string> | null = null,
    omit: Set<string> | null = null,
    isMergeMode: boolean = false,
    skipNullish: boolean = false,
    options?: MapperOptions
  ): Promise<void> {
    const sourceKeys = this.getPropertyKeys(source, options);
    const mappedSourceFields = new Set(
      this.config.fieldMappings.map(m => String(m.source))
    );
    const excludedFields = new Set(
      this.config.excludeFields.map(f => String(f))
    );

    for (const key of sourceKeys) {
      const keyStr = String(key);
      
      if (mappedSourceFields.has(keyStr) || excludedFields.has(keyStr)) {
        continue;
      }

      if (pick && !pick.has(keyStr)) continue;
      if (omit && omit.has(keyStr)) continue;

      const sourceValue = getProperty(source, key);

      if (skipNullish && (sourceValue === null || sourceValue === undefined)) {
        continue;
      }

      if (isMergeMode && getProperty(destination, key) !== undefined) {
        continue;
      }

      let destinationValue: unknown;
      
      if (options?.deep === false) {
        destinationValue = sourceValue;
      } else if (options?.preserveDescriptors) {
        PropertyUtils.copyProperty(source, destination, key);
        continue;
      } else {
        destinationValue = await this.convertValueAsync(sourceValue, context);
      }

      setProperty(destination, key, destinationValue);
    }
  }

  private async convertValueAsync(value: unknown, context: MappingContext): Promise<unknown> {
    if (value === null || value === undefined) return value;
    if (TypeUtils.isPrimitive(value)) return value;
    if (TypeUtils.isDate(value)) return new Date((value as Date).getTime());
    if (TypeUtils.isSet(value)) return await this.convertSetAsync(value as Set<unknown>, context);
    if (TypeUtils.isMap(value)) return await this.convertMapAsync(value as Map<unknown, unknown>, context);
    if (TypeUtils.isArray(value)) return await Promise.all((value as unknown[]).map((item: unknown) => this.convertValueAsync(item, context)));
    if (TypeUtils.isPlainObject(value)) return await this.deepMapObjectAsync(value as object, context);

    if (TypeUtils.isClassInstance(value)) {
      const asyncConverter = this.converterRegistry.findAsyncConverter(
        value.constructor,
        this.config.destinationClass
      );
      
      if (asyncConverter) {
        return await asyncConverter.convertAsync(value, this.config.destinationClass);
      }

      const converter = this.converterRegistry.findConverter(
        value.constructor,
        this.config.destinationClass
      );
      
      if (converter) {
        return converter.convert(value, this.config.destinationClass);
      }
      
      return value;
    }

    return value;
  }

  private async convertSetAsync(sourceSet: Set<unknown>, context: MappingContext): Promise<Set<unknown>> {
    const result = new Set<unknown>();
    for (const item of sourceSet) {
      result.add(await this.convertValueAsync(item, context));
    }
    return result;
  }

  private async convertMapAsync(sourceMap: Map<unknown, unknown>, context: MappingContext): Promise<Map<unknown, unknown>> {
    const result = new Map<unknown, unknown>();
    for (const [key, value] of sourceMap.entries()) {
      const newKey = await this.convertValueAsync(key, context);
      const newValue = await this.convertValueAsync(value, context);
      result.set(newKey, newValue);
    }
    return result;
  }

  private async deepMapObjectAsync(obj: object, context: MappingContext): Promise<Record<string, unknown>> {
    if (context.hasMapped(obj)) {
      return context.getMapped(obj) as Record<string, unknown>;
    }

    const result: Record<string, unknown> = {};
    context.setMapped(obj, result);

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = await this.convertValueAsync(getProperty(obj, key), context);
      }
    }

    return result;
  }
}

