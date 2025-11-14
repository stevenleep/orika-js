import { MetadataStorage } from './metadata';
import { ClassConstructor } from '../types';
import { createMapperBuilder } from '../builder/MapperConfigBuilder';

export function MapTo(targetClass: ClassConstructor<any>): ClassDecorator {
  return function <T extends Function>(constructor: T): T {
    MetadataStorage.setTargetClass(constructor.prototype, targetClass);
    return constructor;
  };
}

export function MapField(destinationField: string): any {
  return function (target: any, propertyKey: any): any {
    const key = String(propertyKey);
    MetadataStorage.addFieldMapping(target, key, {
      source: key,
      destination: destinationField,
    });
  };
}

export function Exclude(): any {
  return function (target: any, propertyKey: any): any {
    const key = String(propertyKey);
    MetadataStorage.addExcludedField(target, key);
  };
}

export function Transform(transformer: (value: any) => any): any {
  return function (target: any, propertyKey: any): any {
    const key = String(propertyKey);
    const existing = MetadataStorage.getMappingMetadata(target).fieldMappings?.get(key);
    
    MetadataStorage.addFieldMapping(target, key, {
      source: key,
      destination: existing?.destination || key,
      transformer,
    });
  };
}

export function createMappingFromDecorators<S, D>(sourceClass: ClassConstructor<S>) {
  const metadata = MetadataStorage.getMappingMetadata(sourceClass.prototype);
  
  if (!metadata.targetClass) {
    throw new Error(`@MapTo decorator not found on ${sourceClass.name}`);
  }

  const builder = createMapperBuilder<S, D>(sourceClass, metadata.targetClass);

  if (metadata.fieldMappings) {
    metadata.fieldMappings.forEach((config, propertyKey) => {
      if (config.exclude) {
        return;
      }

      if (config.transformer) {
        builder.forMember(config.destination, (source: any) => {
          const value = source[propertyKey];
          return config.transformer!(value);
        });
      } else if (config.destination !== propertyKey) {
        builder.mapField(propertyKey, config.destination);
      }
    });
  }

  if (metadata.excludedFields && metadata.excludedFields.size > 0) {
    builder.exclude(...Array.from(metadata.excludedFields));
  }

  return builder;
}

