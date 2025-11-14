import { ref, computed, watch } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor, MapperOptions } from '@orika-js/core';
import { mapToReactive, mapToRef, mapToComputed } from './reactive-mapper';
import type { UseMappingResult, UseAsyncMappingResult, VueMapperOptions } from './types';

/**
 * 组合式函数：提供完整的映射能力
 * @example
 * const { map, mapToReactive, isMapping, error } = useMapper(User, UserDTO);
 * 
 * const user = { id: 1, name: 'Alice' };
 * const dto = mapToReactive(user);
 */
export function useMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: VueMapperOptions
): UseMappingResult<S, D> {
  const factory = MapperFactory.getInstance();
  const isMapping = ref(false);
  const error = ref<Error | null>(null);

  const map = (source: S) => {
    isMapping.value = true;
    error.value = null;
    
    try {
      const result = factory.map(source, sourceClass, destClass, options);
      return result as any;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  const toReactive = (source: S) => {
    isMapping.value = true;
    error.value = null;
    
    try {
      return mapToReactive(source, sourceClass, destClass, options);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  const toRef = (source: S) => {
    isMapping.value = true;
    error.value = null;
    
    try {
      return mapToRef(source, sourceClass, destClass, options);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  const toComputed = (sourceRef: Ref<S>) => {
    return mapToComputed(sourceRef, sourceClass, destClass, options);
  };

  const mapArray = (sources: S[]) => {
    isMapping.value = true;
    error.value = null;
    
    try {
      const results = factory.mapArray(sources, sourceClass, destClass);
      return results as any;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  return {
    map,
    mapToReactive: toReactive,
    mapToRef: toRef,
    mapToComputed: toComputed,
    mapArray,
    isMapping,
    error
  };
}

/**
 * 组合式函数：异步映射
 * @example
 * const { mapAsync, isLoading, error } = useAsyncMapper(User, UserDTO);
 * 
 * const dto = await mapAsync(user);
 */
export function useAsyncMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: VueMapperOptions
): UseAsyncMappingResult<S, D> {
  const factory = MapperFactory.getInstance();
  const baseMapper = useMapper(sourceClass, destClass, options);
  const isLoading = ref(false);

  const mapAsync = async (source: S) => {
    isLoading.value = true;
    baseMapper.error.value = null;
    
    try {
      const result = await factory.mapAsync(source, sourceClass, destClass, options);
      return result as any;
    } catch (err) {
      baseMapper.error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const mapArrayAsync = async (sources: S[]) => {
    isLoading.value = true;
    baseMapper.error.value = null;
    
    try {
      const results = await factory.mapArrayAsync(sources, sourceClass, destClass);
      return results as any;
    } catch (err) {
      baseMapper.error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    ...baseMapper,
    mapAsync,
    mapArrayAsync,
    isLoading
  };
}

/**
 * 组合式函数：批量映射处理
 * @example
 * const { mapBatch, progress, isPending } = useBatchMapper(User, UserDTO);
 * 
 * const dtos = await mapBatch(users, { batchSize: 10 });
 */
export function useBatchMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: VueMapperOptions
) {
  const factory = MapperFactory.getInstance();
  const isPending = ref(false);
  const progress = ref(0);
  const error = ref<Error | null>(null);

  const mapBatch = async (
    sources: S[],
    batchOptions?: { batchSize?: number; onProgress?: (progress: number) => void }
  ) => {
    isPending.value = true;
    progress.value = 0;
    error.value = null;

    try {
      const batchSize = batchOptions?.batchSize || 10;
      const results: D[] = [];
      
      for (let i = 0; i < sources.length; i += batchSize) {
        const batch = sources.slice(i, i + batchSize);
        const batchResults = await factory.mapArrayAsync(
          batch,
          sourceClass,
          destClass
        );
        results.push(...batchResults);
        
        progress.value = Math.min(100, Math.round(((i + batch.length) / sources.length) * 100));
        
        if (batchOptions?.onProgress) {
          batchOptions.onProgress(progress.value);
        }
      }
      
      return results;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isPending.value = false;
    }
  };

  return {
    mapBatch,
    isPending,
    progress,
    error
  };
}

/**
 * 组合式函数：监听源对象变化并自动映射
 * @example
 * const userRef = ref(user);
 * const dtoRef = useAutoMapper(userRef, User, UserDTO);
 * // dtoRef 会自动随 userRef 更新
 */
export function useAutoMapper<S, D>(
  sourceRef: Ref<S>,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: VueMapperOptions & { immediate?: boolean }
): Ref<D | null> {
  const factory = MapperFactory.getInstance();
  const result = ref<D | null>(null);

  watch(
    sourceRef,
    (newSource) => {
      if (newSource) {
        try {
          result.value = factory.map(newSource, sourceClass, destClass, options);
        } catch (err) {
          console.error('[useAutoMapper] Mapping error:', err);
          result.value = null;
        }
      } else {
        result.value = null;
      }
    },
    { immediate: options?.immediate ?? true, deep: true }
  );

  return result as Ref<D | null>;
}

