import { MetadataStorage, FieldDecoratorMetadata } from './metadata';
import { ClassConstructor } from '../types';
import { createMapperBuilder } from '../builder/MapperConfigBuilder';
import { Mapper } from '../core/Mapper';

// ========== 辅助函数 ==========

/**
 * 合并装饰器配置的辅助函数
 * 只合并在 newConfig 中明确提供的字段
 */
function mergeDecoratorConfig(
  target: any,
  propertyKey: string,
  newConfig: Partial<FieldDecoratorMetadata>
): FieldDecoratorMetadata {
  const metadata = MetadataStorage.getMappingMetadata(target);
  const existing = metadata.fieldMappings?.get(propertyKey);
  
  // 构建合并后的配置，优先使用 newConfig 中提供的值，其次使用 existing 的值
  const merged: FieldDecoratorMetadata = {
    source: existing?.source ?? propertyKey,
    destination: existing?.destination ?? propertyKey,
  };
  
  // 只有当新配置中有这个键时才覆盖
  if ('source' in newConfig) merged.source = newConfig.source!;
  if ('destination' in newConfig) merged.destination = newConfig.destination!;
  if ('transformer' in newConfig || existing?.transformer) {
    merged.transformer = newConfig.transformer ?? existing?.transformer;
  }
  if ('asyncTransformer' in newConfig || existing?.asyncTransformer) {
    merged.asyncTransformer = newConfig.asyncTransformer ?? existing?.asyncTransformer;
  }
  if ('exclude' in newConfig || existing?.exclude) {
    merged.exclude = newConfig.exclude ?? existing?.exclude;
  }
  if ('ignoreNull' in newConfig || existing?.ignoreNull) {
    merged.ignoreNull = newConfig.ignoreNull ?? existing?.ignoreNull;
  }
  if ('ignoreUndefined' in newConfig || existing?.ignoreUndefined) {
    merged.ignoreUndefined = newConfig.ignoreUndefined ?? existing?.ignoreUndefined;
  }
  if ('condition' in newConfig || existing?.condition) {
    merged.condition = newConfig.condition ?? existing?.condition;
  }
  if ('defaultValue' in newConfig || existing?.defaultValue !== undefined) {
    merged.defaultValue = newConfig.defaultValue ?? existing?.defaultValue;
  }
  if ('defaultFactory' in newConfig || existing?.defaultFactory) {
    merged.defaultFactory = newConfig.defaultFactory ?? existing?.defaultFactory;
  }
  if ('converter' in newConfig || existing?.converter) {
    merged.converter = newConfig.converter ?? existing?.converter;
  }
  if ('format' in newConfig || existing?.format) {
    merged.format = newConfig.format ?? existing?.format;
  }
  if ('nested' in newConfig || existing?.nested) {
    merged.nested = newConfig.nested ?? existing?.nested;
  }
  if ('nestedClass' in newConfig || existing?.nestedClass) {
    merged.nestedClass = newConfig.nestedClass ?? existing?.nestedClass;
  }
  
  return merged;
}

// ========== 基础装饰器 ==========

/**
 * 标记目标类，用于映射
 * @param targetClass 目标类构造函数
 */
export function MapTo(targetClass: ClassConstructor<any>): ClassDecorator {
  return function <T extends Function>(constructor: T): T {
    MetadataStorage.setTargetClass(constructor.prototype, targetClass);
    return constructor;
  };
}

/**
 * 字段映射装饰器，支持完整的映射选项
 * @param destinationFieldOrOptions 目标字段名或完整配置对象
 */
export function MapField(
  destinationFieldOrOptions: string | Omit<FieldDecoratorMetadata, 'source'>
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    
    let newConfig: Partial<FieldDecoratorMetadata>;
    if (typeof destinationFieldOrOptions === 'string') {
      newConfig = {
        destination: destinationFieldOrOptions,
      };
    } else {
      newConfig = destinationFieldOrOptions;
    }
    
    // 使用合并逻辑，保留之前装饰器设置的配置
    const config = mergeDecoratorConfig(target, key, newConfig);
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 从指定源字段映射（用于反向映射或不同字段名）
 * @param sourceField 源字段名
 */
export function MapFrom(sourceField: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { source: sourceField });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 排除字段，不参与映射
 */
export function Exclude(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    MetadataStorage.addExcludedField(target, key);
  };
}

// ========== 转换装饰器 ==========

/**
 * 自定义转换函数
 * @param transformer 转换函数
 */
export function Transform(transformer: (value: any, source?: any) => any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { transformer });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 异步转换函数
 * @param asyncTransformer 异步转换函数
 */
export function TransformAsync(
  asyncTransformer: (value: any, source?: any) => Promise<any>
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { asyncTransformer });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 使用指定转换器
 * @param converterName 转换器名称
 */
export function ConvertWith(converterName: string): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { converter: converterName });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 格式化值
 * @param format 格式化字符串或函数
 */
export function Format(format: string | ((value: any) => any)): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { format });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

// ========== 条件装饰器 ==========

/**
 * 忽略 null 值
 */
export function IgnoreNull(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { ignoreNull: true });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 忽略 undefined 值
 */
export function IgnoreUndefined(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { ignoreUndefined: true });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 忽略 null 和 undefined 值
 */
export function IgnoreNullish(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { 
      ignoreNull: true,
      ignoreUndefined: true,
    });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 条件映射
 * @param condition 条件函数
 */
export function MapWhen(condition: (source: any) => boolean): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { condition });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

// ========== 默认值装饰器 ==========

/**
 * 设置默认值
 * @param value 默认值
 */
export function Default(value: any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { defaultValue: value });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

/**
 * 使用工厂函数生成默认值
 * @param factory 工厂函数
 */
export function DefaultFactory(factory: () => any): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { defaultFactory: factory });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

// ========== 嵌套映射装饰器 ==========

/**
 * 嵌套对象映射
 * @param nestedClass 嵌套对象的类构造函数
 */
export function Nested(nestedClass?: ClassConstructor<any>): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): any {
    const key = String(propertyKey);
    const config = mergeDecoratorConfig(target, key, { 
      nested: true,
      nestedClass,
    });
    MetadataStorage.addFieldMapping(target, key, config);
  };
}

// ========== 类级别装饰器 ==========

/**
 * 映射前钩子
 * @param fn 钩子函数
 */
export function BeforeMapping(fn: (source: any) => void | Promise<void>): ClassDecorator {
  return function <T extends Function>(constructor: T): T {
    const metadata = MetadataStorage.getMappingMetadata(constructor.prototype);
    metadata.beforeMapping = fn;
    return constructor;
  };
}

/**
 * 映射后钩子
 * @param fn 钩子函数
 */
export function AfterMapping(
  fn: (source: any, destination: any) => void | Promise<void>
): ClassDecorator {
  return function <T extends Function>(constructor: T): T {
    const metadata = MetadataStorage.getMappingMetadata(constructor.prototype);
    metadata.afterMapping = fn;
    return constructor;
  };
}

/**
 * 从装饰器创建 Mapper 实例
 * @param sourceClass 源类构造函数
 * @param autoMapping 是否启用自动映射（默认为 false，让装饰器完全控制映射）
 * @returns Mapper 实例
 */
export function createMappingFromDecorators<S, D>(
  sourceClass: ClassConstructor<S>,
  autoMapping: boolean = false
): Mapper<S, D> {
  const metadata = MetadataStorage.getMappingMetadata(sourceClass.prototype);
  
  if (!metadata.targetClass) {
    throw new Error(`@MapTo decorator not found on ${sourceClass.name}`);
  }

  const builder = createMapperBuilder<S, D>(sourceClass, metadata.targetClass);
  
  // 禁用自动映射，让装饰器完全控制
  builder.autoMap(autoMapping);

  // 处理字段映射
  if (metadata.fieldMappings) {
    metadata.fieldMappings.forEach((config, propertyKey) => {
      if (config.exclude) {
        return;
      }

      const sourceField = config.source || propertyKey;

      // 构建转换函数
      builder.forMember(config.destination, (source: any) => {
        let value = source[sourceField];

        // 应用条件
        if (config.condition && !config.condition(source)) {
          return undefined;
        }

        // 检查 null/undefined
        if (config.ignoreNull && value === null) {
          return undefined;
        }
        if (config.ignoreUndefined && value === undefined) {
          return undefined;
        }

        // 应用默认值
        if ((value === null || value === undefined)) {
          if (config.defaultFactory) {
            value = config.defaultFactory();
          } else if (config.defaultValue !== undefined) {
            value = config.defaultValue;
          }
        }

        // 应用格式化
        if (config.format && value !== null && value !== undefined) {
          if (typeof config.format === 'function') {
            value = config.format(value);
          } else if (typeof config.format === 'string') {
            // 可以在这里实现字符串格式化逻辑
            // 例如日期格式化、数字格式化等
            value = formatValue(value, config.format);
          }
        }

        // 应用转换器
        if (config.transformer) {
          value = config.transformer(value, source);
        }

        // 处理嵌套映射
        if (config.nested && config.nestedClass && value) {
          // 这里可以递归调用映射逻辑
          // 但需要确保有正确的映射配置
        }

        return value;
      });
    });
  }

  // 处理排除的字段
  if (metadata.excludedFields && metadata.excludedFields.size > 0) {
    builder.exclude(...Array.from(metadata.excludedFields));
  }

  // 处理生命周期钩子
  if (metadata.beforeMapping) {
    builder.beforeMapping(metadata.beforeMapping);
  }

  if (metadata.afterMapping) {
    builder.afterMapping(metadata.afterMapping);
  }

  // 构建配置并创建 Mapper 实例
  const config = builder.build();
  return new Mapper<S, D>(config);
}

/**
 * 格式化值的辅助函数
 */
function formatValue(value: any, format: string): any {
  // 实现常见的格式化逻辑
  if (value instanceof Date) {
    // 日期格式化
    switch (format.toLowerCase()) {
      case 'iso':
      case 'iso8601':
        return value.toISOString();
      case 'date':
        return value.toLocaleDateString();
      case 'time':
        return value.toLocaleTimeString();
      case 'datetime':
        return value.toLocaleString();
      case 'timestamp':
        return value.getTime();
      default:
        return value.toISOString();
    }
  }
  
  if (typeof value === 'number') {
    // 数字格式化
    switch (format.toLowerCase()) {
      case 'currency':
      case 'money':
        return value.toFixed(2);
      case 'percent':
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      case 'integer':
      case 'int':
        return Math.round(value);
      default:
        return value;
    }
  }

  if (typeof value === 'string') {
    // 字符串格式化
    switch (format.toLowerCase()) {
      case 'uppercase':
      case 'upper':
        return value.toUpperCase();
      case 'lowercase':
      case 'lower':
        return value.toLowerCase();
      case 'trim':
        return value.trim();
      case 'capitalize':
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      default:
        return value;
    }
  }

  return value;
}

