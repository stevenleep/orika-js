import { useMemo } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * Hook: 条件映射
 * @example
 * const dto = useConditionalMapper(
 *   user,
 *   UserEntity,
 *   UserDTO,
 *   (user) => user.role === 'admin'
 * );
 */
export function useConditionalMapper<S, D>(
  source: S | null,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  condition: (source: S) => boolean,
  options?: ReactMapperOptions
): D | null {
  const factory = MapperFactory.getInstance();

  return useMemo(() => {
    if (!source || !condition(source)) {
      return null;
    }

    try {
      return factory.map(source, sourceClass, destClass, options);
    } catch (err) {
      console.error('[useConditionalMapper] Mapping error:', err);
      return null;
    }
  }, [source, sourceClass, destClass, condition, factory, options]);
}

