import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { VueMapperOptions } from '../types';

/**
 * @example
 * const userRef = ref(user);
 * const dtoRef = useAutoMapper(userRef, User, UserDTO);
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

