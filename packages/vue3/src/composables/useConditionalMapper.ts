import { computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { VueMapperOptions } from '../types';

/**
 * @example
 * const userRef = ref(user);
 * const dto = useConditionalMapper(userRef, User, UserDTO, u => u.isActive);
 */
export function useConditionalMapper<S, D>(
  sourceRef: Ref<S | null>,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  condition: (source: S) => boolean,
  options?: VueMapperOptions
): ComputedRef<D | null> {
  const factory = MapperFactory.getInstance();

  return computed(() => {
    const source = sourceRef.value;
    if (!source || !condition(source)) {
      return null;
    }

    try {
      return factory.map(source, sourceClass, destClass, options) as D;
    } catch (err) {
      console.error('[useConditionalMapper] Mapping error:', err);
      return null;
    }
  });
}

