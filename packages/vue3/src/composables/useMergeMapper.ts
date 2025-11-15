import { ref } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { VueMapperOptions } from '../types';

/**
 * @example
 * const { merge } = useMergeMapper(UserDTO, UserEntity);
 * const updated = merge(changes, existing);
 */
export function useMergeMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: VueMapperOptions
) {
  const factory = MapperFactory.getInstance();
  const isMapping = ref(false);
  const error = ref<Error | null>(null);

  const merge = (source: Partial<S>, destination: D): D => {
    isMapping.value = true;
    error.value = null;
    
    try {
      return factory.merge(source as S, destination, sourceClass, destClass, options) as D;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  const mergeAsync = async (source: Partial<S>, destination: D): Promise<D> => {
    isMapping.value = true;
    error.value = null;
    
    try {
      return await factory.mergeAsync(source as S, destination, sourceClass, destClass, options) as D;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  return {
    merge,
    mergeAsync,
    isMapping,
    error
  };
}

