import { useState, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions, UseMappingResult } from '../types';

/**
 * Hook: 提供基础的同步映射能力
 * @example
 * const { map, mapArray, isMapping, error } = useMapper(User, UserDTO);
 * 
 * const user = { id: 1, name: 'Alice' };
 * const dto = map(user);
 */
export function useMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
): UseMappingResult<S, D> {
  const factory = MapperFactory.getInstance();
  const [isMapping, setIsMapping] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const map = useCallback((source: S): D => {
    setIsMapping(true);
    setError(null);
    
    try {
      const result = factory.map(source, sourceClass, destClass, options);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [sourceClass, destClass, factory, options]);

  const mapArray = useCallback((sources: S[]): D[] => {
    setIsMapping(true);
    setError(null);
    
    try {
      const results = factory.mapArray(sources, sourceClass, destClass);
      return results;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [sourceClass, destClass, factory]);

  return {
    map,
    mapArray,
    isMapping,
    error
  };
}

