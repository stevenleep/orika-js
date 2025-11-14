import { MappingConfig, FieldMapping, ClassConstructor } from '../types';
import { MapperFactory } from '../core/MapperFactory';
import { ExpressionEvaluator } from '../expression/ExpressionEvaluator';

export class MapperConfigBuilder<S = any, D = any> {
  private config: Partial<MappingConfig<S, D>>;

  constructor(
    sourceClass?: ClassConstructor<S>,
    destinationClass?: ClassConstructor<D>
  ) {
    this.config = {
      sourceClass,
      destinationClass,
      fieldMappings: [],
      excludeFields: [],
      autoMapping: true,
    };
  }

  from(sourceClass: ClassConstructor<S>): MapperConfigBuilder<S, D> {
    this.config.sourceClass = sourceClass;
    return this;
  }

  to(destinationClass: ClassConstructor<D>): MapperConfigBuilder<S, D> {
    this.config.destinationClass = destinationClass;
    return this;
  }

  forMember(
    destination: keyof D | string,
    mapFrom: (source: S) => any
  ): MapperConfigBuilder<S, D> {
    const mapping: FieldMapping<S, D> = {
      source: destination as keyof S,
      destination,
      converter: (_, source) => mapFrom(source),
    };
    this.config.fieldMappings!.push(mapping);
    return this;
  }

  forMemberAsync(
    destination: keyof D | string,
    mapFrom: (source: S) => Promise<any>
  ): MapperConfigBuilder<S, D> {
    const mapping: FieldMapping<S, D> = {
      source: destination as keyof S,
      destination,
      asyncConverter: (_, source) => mapFrom(source),
    };
    this.config.fieldMappings!.push(mapping);
    return this;
  }

  mapField(
    source: keyof S | string,
    destination: keyof D | string,
    converter?: (value: any, source: S) => any
  ): MapperConfigBuilder<S, D> {
    const mapping: FieldMapping<S, D> = {
      source,
      destination,
      converter,
    };
    this.config.fieldMappings!.push(mapping);
    return this;
  }

  exclude(...fields: (keyof D | string)[]): MapperConfigBuilder<S, D> {
    this.config.excludeFields!.push(...fields);
    return this;
  }

  ignoreNull(destination: keyof D | string): MapperConfigBuilder<S, D> {
    const mapping = this.config.fieldMappings!.find(
      m => m.destination === destination
    );
    if (mapping) {
      mapping.ignoreNull = true;
    }
    return this;
  }

  autoMap(enabled: boolean = true): MapperConfigBuilder<S, D> {
    this.config.autoMapping = enabled;
    return this;
  }

  beforeMapping(hook: (source: S) => void): MapperConfigBuilder<S, D> {
    this.config.beforeMapping = hook;
    return this;
  }

  afterMapping(hook: (source: S, destination: D) => void): MapperConfigBuilder<S, D> {
    this.config.afterMapping = hook;
    return this;
  }

  mapFieldWhen(
    source: keyof S | string,
    destination: keyof D | string,
    condition: (source: S) => boolean,
    converter?: (value: any, source: S) => any
  ): MapperConfigBuilder<S, D> {
    const mapping: FieldMapping<S, D> = {
      source,
      destination,
      converter,
      condition,
    };
    this.config.fieldMappings!.push(mapping);
    return this;
  }

  mapFieldWhenAsync(
    source: keyof S | string,
    destination: keyof D | string,
    condition: (source: S) => boolean,
    converter: (value: any, source: S) => Promise<any>
  ): MapperConfigBuilder<S, D> {
    const mapping: FieldMapping<S, D> = {
      source,
      destination,
      asyncConverter: converter,
      condition,
    };
    this.config.fieldMappings!.push(mapping);
    return this;
  }

  validate(validator: (source: S, destination: D) => void | Promise<void>): MapperConfigBuilder<S, D> {
    this.config.validate = validator;
    return this;
  }

  mapExpression(destination: keyof D | string, expression: string): MapperConfigBuilder<S, D> {
    if (!ExpressionEvaluator.isValidExpression(expression)) {
      throw new Error(`Invalid expression: ${expression}`);
    }

    const mapping: FieldMapping<S, D> = {
      source: destination as keyof S,
      destination,
      converter: (_value, source) => ExpressionEvaluator.evaluate(expression, source),
    };
    this.config.fieldMappings!.push(mapping);
    return this;
  }

  withDefault(field: keyof D | string, defaultValue: any): MapperConfigBuilder<S, D> {
    const mapping = this.config.fieldMappings!.find(m => m.destination === field);
    if (mapping) {
      mapping.defaultValue = defaultValue;
    }
    return this;
  }

  withDefaultFactory(field: keyof D | string, factory: () => any): MapperConfigBuilder<S, D> {
    const mapping = this.config.fieldMappings!.find(m => m.destination === field);
    if (mapping) {
      mapping.defaultFactory = factory;
    }
    return this;
  }

  build(): MappingConfig<S, D> {
    if (!this.config.sourceClass || !this.config.destinationClass) {
      throw new Error('Both sourceClass and destinationClass must be set');
    }
    return this.config as MappingConfig<S, D>;
  }

  register(factory?: MapperFactory): MapperFactory {
    const mappingConfig = this.build();
    const mapperFactory = factory || MapperFactory.getInstance();
    return mapperFactory.registerMapping(mappingConfig);
  }
}

export function createMapperBuilder<S, D>(
  sourceClass?: ClassConstructor<S>,
  destinationClass?: ClassConstructor<D>
): MapperConfigBuilder<S, D> {
  return new MapperConfigBuilder<S, D>(sourceClass, destinationClass);
}

