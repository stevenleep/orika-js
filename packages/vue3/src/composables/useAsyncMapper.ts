import { ref } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import { useMapper } from './useMapper';
import type { UseAsyncMappingResult, VueMapperOptions } from '../types';

/**
 * @example
 * const { mapAsync, isLoading } = useAsyncMapper(User, UserDTO);
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

