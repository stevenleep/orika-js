import { useState, useRef, useEffect } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from '../types';

/**
 * @example
 * const [user, setUser] = useState(initialUser);
 * const dto = useAutoMapper(user, User, UserDTO);
 */
export function useAutoMapper<S, D>(
  source: S | null | undefined,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
): D | null {
  const factory = MapperFactory.getInstance();
  const [result, setResult] = useState<D | null>(null);
  const prevSourceRef = useRef<S | null | undefined>(source);

  useEffect(() => {
    if (prevSourceRef.current === source) {
      return;
    }
    
    prevSourceRef.current = source;

    if (source) {
      try {
        const mapped = factory.map(source, sourceClass, destClass, options);
        setResult(mapped);
      } catch (err) {
        console.error('[useAutoMapper] Mapping error:', err);
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [source, sourceClass, destClass, factory, options]);

  return result;
}

