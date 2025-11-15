import { useState, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * @example
 * const { merge } = useMergeMapper(UserDTO, UserEntity);
 * const updated = merge(changes, existing);
 */
export function useMergeMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
) {
  const factory = MapperFactory.getInstance();
  const [isMapping, setIsMapping] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const merge = useCallback((source: Partial<S>, destination: D): D => {
    setIsMapping(true);
    setError(null);
    
    try {
      return factory.merge(source as S, destination, sourceClass, destClass, options);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [sourceClass, destClass, factory, options]);

  const mergeAsync = useCallback(async (source: Partial<S>, destination: D): Promise<D> => {
    setIsMapping(true);
    setError(null);
    
    try {
      return await factory.mergeAsync(source as S, destination, sourceClass, destClass, options);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [sourceClass, destClass, factory, options]);

  return {
    merge,
    mergeAsync,
    isMapping,
    error
  };
}

