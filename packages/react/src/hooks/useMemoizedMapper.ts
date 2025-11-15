import { useMemo } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * Hook: 记忆化映射 - 使用 useMemo 缓存映射结果
 * @example
 * const dto = useMemoizedMapper(user, User, UserDTO);
 */
export function useMemoizedMapper<S, D>(
  source: S | null | undefined,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions,
  deps?: React.DependencyList
): D | null {
  const factory = MapperFactory.getInstance();

  return useMemo(() => {
    if (!source) {
      return null;
    }

    try {
      return factory.map(source, sourceClass, destClass, options);
    } catch (err) {
      console.error('[useMemoizedMapper] Mapping error:', err);
      return null;
    }
  }, [source, sourceClass, destClass, factory, options, ...(deps || [])]);
}

