import { useState, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * Hook: 双向映射 - 适用于表单编辑场景
 * Entity ↔ DTO 双向转换
 * @example
 * const { toDTO, toEntity } = useBidirectionalMapper(UserEntity, UserDTO);
 * 
 * // 加载时: Entity → DTO
 * const formData = toDTO(userEntity);
 * 
 * // 提交时: DTO → Entity
 * const updated = toEntity(formData);
 */
export function useBidirectionalMapper<A, B>(
  classA: ClassConstructor<A>,
  classB: ClassConstructor<B>,
  options?: ReactMapperOptions
) {
  const factory = MapperFactory.getInstance();
  const [isMapping, setIsMapping] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toB = useCallback((source: A): B => {
    setIsMapping(true);
    setError(null);
    
    try {
      return factory.map(source, classA, classB, options);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [classA, classB, factory, options]);

  const toA = useCallback((source: B): A => {
    setIsMapping(true);
    setError(null);
    
    try {
      return factory.map(source, classB, classA, options);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsMapping(false);
    }
  }, [classA, classB, factory, options]);

  return {
    toB,
    toA,
    isMapping,
    error
  };
}

