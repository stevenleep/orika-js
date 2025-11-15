import { ref } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { VueMapperOptions } from '../types';

/**
 * @example
 * const { toB, toA } = useBidirectionalMapper(UserEntity, UserDTO);
 * const dto = toB(entity);
 * const entity = toA(dto);
 */
export function useBidirectionalMapper<A, B>(
  classA: ClassConstructor<A>,
  classB: ClassConstructor<B>,
  options?: VueMapperOptions
) {
  const factory = MapperFactory.getInstance();
  const isMapping = ref(false);
  const error = ref<Error | null>(null);

  const toB = (source: A): B => {
    isMapping.value = true;
    error.value = null;
    
    try {
      return factory.map(source, classA, classB, options) as B;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  const toA = (source: B): A => {
    isMapping.value = true;
    error.value = null;
    
    try {
      return factory.map(source, classB, classA, options) as A;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isMapping.value = false;
    }
  };

  return {
    toB,
    toA,
    isMapping,
    error
  };
}

