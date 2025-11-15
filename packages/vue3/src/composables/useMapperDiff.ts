import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';

/**
 * @example
 * const { diff, hasChanges } = useMapperDiff<User>();
 * const changes = diff(original, modified);
 * if (hasChanges(changes)) await update(changes);
 */
export function useMapperDiff<T extends Record<string, any>>() {
  const factory = MapperFactory.getInstance();

  const diff = (obj1: T, obj2: T): Partial<T> => {
    return factory.diff(obj1, obj2) as Partial<T>;
  };

  const hasChanges = (changes: Partial<T>): boolean => {
    return Object.keys(changes).length > 0;
  };

  const applyChanges = (
    changes: Partial<T>,
    targetClass: ClassConstructor<T>
  ): T => {
    return factory.applyChanges(changes, targetClass) as T;
  };

  return {
    diff,
    hasChanges,
    applyChanges
  };
}

