import { ref } from 'vue';
import type { Ref } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import { mapToReactive, mapToRef, mapToComputed } from '../reactive-mapper';
import type { UseMappingResult, VueMapperOptions } from '../types';

/**
 * @example
 * const { map, mapToReactive, isMapping, error } = useMapper(User, UserDTO);
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

