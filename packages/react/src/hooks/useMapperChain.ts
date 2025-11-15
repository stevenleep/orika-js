import { useState, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';

/**
 * Hook: 链式映射 - 支持多步骤转换 A→B→C
 * @example
 * const { mapChain } = useMapperChain();
 * 
 * // Entity → DTO → ViewModel
 * const viewModel = mapChain(entity, UserEntity, UserDTO, UserViewModel);
 */
export function useMapperChain() {
  const factory = MapperFactory.getInstance();
  const [isMapping, setIsMapping] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mapChain = useCallback(<T>(
    source: any,
    ...classes: ClassConstructor<any>[]
  ): T => {
    setIsMapping(true);
    setError(null);
    
    try {
      return factory.mapChain<T>(source, ...classes);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [factory]);

  const mapChainAsync = useCallback(async <T>(
    source: any,
    ...classes: ClassConstructor<any>[]
  ): Promise<T> => {
    setIsMapping(true);
    setError(null);
    
    try {
      return await factory.mapChainAsync<T>(source, ...classes);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [factory]);

  return {
    mapChain,
    mapChainAsync,
    isMapping,
    error
  };
}

