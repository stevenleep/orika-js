import type { PiniaPluginContext } from 'pinia';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { PiniaMapperOptions } from './types';

/**
 * Pinia 映射插件
 * 为 Pinia Store 添加对象映射能力
 * 
 * @example
 * import { createPinia } from 'pinia';
 * import { createPiniaMapperPlugin } from '@orika-js/vue3';
 * 
 * const pinia = createPinia();
 * pinia.use(createPiniaMapperPlugin());
 */
export function createPiniaMapperPlugin(options: PiniaMapperOptions = {}) {
  const {
    autoTransform = true,
    cache = true,
    debug = false
  } = options;

  return (context: PiniaPluginContext) => {
    const factory = MapperFactory.getInstance();
    
    // 为 store 添加映射方法
    context.store.$mapper = {
      /**
       * 映射单个对象
       */
      map<S, D>(
        source: S,
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): D {
        if (debug) {
          console.log('[Pinia Mapper] Mapping:', sourceClass.name, '→', destClass.name);
        }
        return factory.map(source, sourceClass, destClass);
      },

      /**
       * 映射数组
       */
      mapArray<S, D>(
        sources: S[],
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): D[] {
        if (debug) {
          console.log('[Pinia Mapper] Mapping array:', sources.length, 'items');
        }
        return factory.mapArray(sources, sourceClass, destClass);
      },

      /**
       * 异步映射
       */
      async mapAsync<S, D>(
        source: S,
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): Promise<D> {
        if (debug) {
          console.log('[Pinia Mapper] Async mapping:', sourceClass.name, '→', destClass.name);
        }
        return factory.mapAsync(source, sourceClass, destClass);
      },

      /**
       * 批量异步映射
       */
      async mapArrayAsync<S, D>(
        sources: S[],
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): Promise<D[]> {
        if (debug) {
          console.log('[Pinia Mapper] Async mapping array:', sources.length, 'items');
        }
        return factory.mapArrayAsync(sources, sourceClass, destClass);
      },

      /**
       * 合并映射（用于更新现有状态）
       */
      merge<S, D>(
        updates: Partial<S>,
        existing: D,
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): D {
        if (debug) {
          console.log('[Pinia Mapper] Merging updates into existing object');
        }
        return factory.merge(updates, existing, sourceClass, destClass);
      }
    };

    if (debug) {
      console.log('[Pinia Mapper] Plugin initialized for store:', context.store.$id);
    }
  };
}

/**
 * 扩展 Pinia Store 类型
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    $mapper: {
      map<S, D>(
        source: S,
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): D;
      
      mapArray<S, D>(
        sources: S[],
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): D[];
      
      mapAsync<S, D>(
        source: S,
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): Promise<D>;
      
      mapArrayAsync<S, D>(
        sources: S[],
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): Promise<D[]>;
      
      merge<S, D>(
        updates: Partial<S>,
        existing: D,
        sourceClass: ClassConstructor<S>,
        destClass: ClassConstructor<D>
      ): D;
    };
  }
}

