import { useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * @example
 * const mapUser = useMapperCallback(User, UserDTO);
 * const dto = mapUser(entity);
 */
export function useMapperCallback<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
) {
  const factory = MapperFactory.getInstance();

  return useCallback((source: S): D => {
    return factory.map(source, sourceClass, destClass, options);
  }, [sourceClass, destClass, factory, options]);
}

