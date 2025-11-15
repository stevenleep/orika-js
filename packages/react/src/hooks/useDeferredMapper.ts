import { useMemo, useDeferredValue } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * Hook: React 18 useDeferredValue 集成 - 延迟映射
 * 在高频更新场景下延迟映射，避免性能问题
 * @example
 * const [searchQuery, setSearchQuery] = useState('');
 * const deferredResults = useDeferredMapper(
 *   searchResults,
 *   SearchResult,
 *   SearchResultDTO
 * );
 * // deferredResults 会延迟更新，不会阻塞输入
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

