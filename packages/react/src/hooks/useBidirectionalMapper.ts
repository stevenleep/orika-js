import { useState, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * @example
 * const { toB, toA } = useBidirectionalMapper(UserEntity, UserDTO);
 * const dto = toB(entity);
 * const entity = toA(dto);
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

