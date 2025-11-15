import { useState, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions, UseAsyncMappingResult } from '../types';
import { useMapper } from './useMapper';

/**
 * Hook: 异步映射
 * @example
 * const { mapAsync, mapArrayAsync, isLoading, error } = useAsyncMapper(User, UserDTO);
 * 
 * const dto = await mapAsync(user);
 */
export function useAsyncMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
): UseAsyncMappingResult<S, D> {
  const factory = MapperFactory.getInstance();
  const baseMapper = useMapper(sourceClass, destClass, options);
  const [isLoading, setIsLoading] = useState(false);

  const mapAsync = useCallback(async (source: S): Promise<D> => {
    setIsLoading(true);
    
    try {
      const result = await factory.mapAsync(source, sourceClass, destClass, options);
      return result;
    } catch (err) {
      const error = err as Error;
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sourceClass, destClass, factory, options]);

  const mapArrayAsync = useCallback(async (sources: S[]): Promise<D[]> => {
    setIsLoading(true);
    
    try {
      const results = await factory.mapArrayAsync(sources, sourceClass, destClass);
      return results;
    } catch (err) {
      const error = err as Error;
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sourceClass, destClass, factory]);

  return {
    map: baseMapper.map,
    mapArray: baseMapper.mapArray,
    isMapping: baseMapper.isMapping,
    error: baseMapper.error,
    mapAsync,
    mapArrayAsync,
    isLoading
  };
}

