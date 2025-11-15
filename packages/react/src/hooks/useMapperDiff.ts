import { useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';

/**
 * Hook: 对象差异检测
 * @example
 * const { diff, hasChanges } = useMapperDiff();
 * 
 * const changes = diff(originalUser, modifiedUser);
 * if (hasChanges(changes)) {
 *   // 只提交变更的字段
 *   await updateUser(changes);
 * }
 */
export function useMapperDiff<T extends Record<string, any>>() {
  const factory = MapperFactory.getInstance();

  const diff = useCallback((obj1: T, obj2: T): Partial<T> => {
    return factory.diff(obj1, obj2);
  }, [factory]);

  const hasChanges = useCallback((changes: Partial<T>): boolean => {
    return Object.keys(changes).length > 0;
  }, []);

  const applyChanges = useCallback((
    changes: Partial<T>,
    targetClass: ClassConstructor<T>
  ): T => {
    return factory.applyChanges(changes, targetClass);
  }, [factory]);

  return {
    diff,
    hasChanges,
    applyChanges
  };
}

