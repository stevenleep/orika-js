import { ref } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { VueMapperOptions } from '../types';

/**
 * @example
 * const { mapBatch, progress } = useBatchMapper(User, UserDTO);
 * const dtos = await mapBatch(users, { batchSize: 10 });
 */
export function useBatchMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: VueMapperOptions
) {
  const factory = MapperFactory.getInstance();
  const isPending = ref(false);
  const progress = ref(0);
  const error = ref<Error | null>(null);

  const mapBatch = async (
    sources: S[],
    batchOptions?: { batchSize?: number; onProgress?: (progress: number) => void }
  ) => {
    isPending.value = true;
    progress.value = 0;
    error.value = null;

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
        
        progress.value = Math.min(100, Math.round(((i + batch.length) / sources.length) * 100));
        
        if (batchOptions?.onProgress) {
          batchOptions.onProgress(progress.value);
        }
      }
      
      return results;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isPending.value = false;
    }
  };

  return {
    mapBatch,
    isPending,
    progress,
    error
  };
}

