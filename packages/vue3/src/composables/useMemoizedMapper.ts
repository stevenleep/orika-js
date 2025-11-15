import { computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { VueMapperOptions } from '../types';

/**
 * @example
 * const userRef = ref(user);
 * const dtoRef = useMemoizedMapper(userRef, User, UserDTO);
 */
export function useMemoizedMapper<S, D>(
  sourceRef: Ref<S | null | undefined>,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: VueMapperOptions
): ComputedRef<D | null> {
  const factory = MapperFactory.getInstance();

  return computed(() => {
    const source = sourceRef.value;
    if (!source) {
      return null;
    }

    try {
      return factory.map(source, sourceClass, destClass, options) as D;
    } catch (err) {
      console.error('[useMemoizedMapper] Mapping error:', err);
      return null;
    }
  });
}

