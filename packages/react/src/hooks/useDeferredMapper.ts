import { useMemo, useDeferredValue } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * @example
 * const deferredResults = useDeferredMapper(searchResults, SearchResult, SearchResultDTO);
 */
export function useDeferredMapper<S, D>(
  source: S | S[] | null,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
): D | D[] | null {
  const factory = MapperFactory.getInstance();
  const deferredSource = useDeferredValue(source);

  return useMemo(() => {
    if (!deferredSource) {
      return null;
    }

    try {
      if (Array.isArray(deferredSource)) {
        return factory.mapArray(deferredSource, sourceClass, destClass);
      } else {
        return factory.map(deferredSource, sourceClass, destClass, options);
      }
    } catch (err) {
      console.error('[useDeferredMapper] Mapping error:', err);
      return null;
    }
  }, [deferredSource, sourceClass, destClass, factory, options]);
}

