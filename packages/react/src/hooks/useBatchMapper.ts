import { useState, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions, UseBatchMappingResult } from '../types';

/**
 * Hook: 批量映射处理
 * @example
 * const { mapBatch, progress, isPending } = useBatchMapper(User, UserDTO);
 * 
 * const dtos = await mapBatch(users, { batchSize: 10 });
 */
export function useBatchMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
): UseBatchMappingResult<S, D> {
  const factory = MapperFactory.getInstance();
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const mapBatch = useCallback(async (
    sources: S[],
    batchOptions?: { batchSize?: number; onProgress?: (progress: number) => void }
  ): Promise<D[]> => {
    setIsPending(true);
    setProgress(0);
    setError(null);

    try {
      const batchSize = batchOptions?.batchSize || 10;
      const results: D[] = [];
      
      for (let i = 0; i < sources.length; i += batchSize) {
        const batch = sources.slice(i, i + batchSize);
        const batchResults = await factory.mapArrayAsync(
          batch,
          sourceClass,
          destClass
        );
        results.push(...batchResults);
        
        const currentProgress = Math.min(100, Math.round(((i + batch.length) / sources.length) * 100));
        setProgress(currentProgress);
        
        if (batchOptions?.onProgress) {
          batchOptions.onProgress(currentProgress);
        }
      }
      
      return results;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  }, [sourceClass, destClass, factory]);

  return {
    mapBatch,
    isPending,
    progress,
    error
  };
}

