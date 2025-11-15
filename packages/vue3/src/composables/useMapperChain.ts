import { ref } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';

/**
 * @example
 * const { mapChain } = useMapperChain();
 * const viewModel = mapChain(entity, Entity, DTO, ViewModel);
 */
export function useMapperChain() {
  const factory = MapperFactory.getInstance();
  const isMapping = ref(false);
  const error = ref<Error | null>(null);

  const mapChain = <T>(
    source: any,
    ...classes: ClassConstructor<any>[]
  ): T => {
    isMapping.value = true;
    error.value = null;
    
    try {
      return factory.mapChain<T>(source, ...classes);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  const mapChainAsync = async <T>(
    source: any,
    ...classes: ClassConstructor<any>[]
  ): Promise<T> => {
    isMapping.value = true;
    error.value = null;
    
    try {
      return await factory.mapChainAsync<T>(source, ...classes);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  return {
    mapChain,
    mapChainAsync,
    isMapping,
    error
  };
}

