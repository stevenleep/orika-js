import { useState, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * Hook: 合并映射 - 更新现有对象而不是创建新对象
 * 适用于表单更新、部分数据更新等场景
 * @example
 * const { merge, mergeAsync } = useMergeMapper(UserDTO, UserEntity);
 * 
 * // 只更新变化的字段
 * const updated = merge(changes, existingUser);
 */
export function useMergeMapper<S, D>(
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
) {
  const factory = MapperFactory.getInstance();
  const [isMapping, setIsMapping] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const merge = useCallback((source: Partial<S>, destination: D): D => {
    setIsMapping(true);
    setError(null);
    
    try {
      return factory.merge(source as S, destination, sourceClass, destClass, options);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [sourceClass, destClass, factory, options]);

  const mergeAsync = useCallback(async (source: Partial<S>, destination: D): Promise<D> => {
    setIsMapping(true);
    setError(null);
    
    try {
      return await factory.mergeAsync(source as S, destination, sourceClass, destClass, options);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [sourceClass, destClass, factory, options]);

  return {
    merge,
    mergeAsync,
    isMapping,
    error
  };
}

