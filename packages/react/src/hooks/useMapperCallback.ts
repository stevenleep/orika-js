import { useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * Hook: 使用 useCallback 包装的映射函数
 * 避免在依赖数组中导致无限循环
 * @example
 * const mapUser = useMapperCallback(UserEntity, UserDTO);
 * 
 * useEffect(() => {
 *   const dto = mapUser(entity);
 *   // mapUser 引用稳定，不会触发重复执行
 * }, [mapUser, entity]);
 */
export function useMapperCallback<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
) {
  const factory = MapperFactory.getInstance();

  return useCallback((source: S): D => {
    return factory.map(source, sourceClass, destClass, options);
  }, [sourceClass, destClass, factory, options]);
}

