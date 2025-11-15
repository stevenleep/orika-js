import { useState, useCallback, useTransition } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * @example
 * const { mapWithTransition, isPending } = useTransitionMapper(User, UserDTO);
 * mapWithTransition(largeArray, setMappedData);
 */
export function useTransitionMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
) {
  const factory = MapperFactory.getInstance();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  const mapWithTransition = useCallback((
    source: S | S[],
    onComplete: (result: D | D[]) => void
  ) => {
    setError(null);
    
    startTransition(() => {
      try {
        if (Array.isArray(source)) {
          const result = factory.mapArray(source, sourceClass, destClass);
          onComplete(result);
        } else {
          const result = factory.map(source, sourceClass, destClass, options);
          onComplete(result);
        }
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      }
    });
  }, [sourceClass, destClass, factory, options]);

  return {
    mapWithTransition,
    isPending,
    error
  };
}

