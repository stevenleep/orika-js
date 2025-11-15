import React, { useMemo, Suspense } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from './types';

export interface MapperProps<S, D> {
  source: S | S[];
  sourceClass: ClassConstructor<S>;
  destClass: ClassConstructor<D>;
  options?: ReactMapperOptions;
  children: (result: D | D[], isMapping: boolean, error: Error | null) => React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * @example
 * <Mapper source={user} sourceClass={User} destClass={UserDTO}>
 *   {(dto, isMapping, error) => <UserProfile data={dto} />}
 * </Mapper>
 */
export function Mapper<S, D>({
  source,
  sourceClass,
  destClass,
  options,
  children,
  fallback
}: MapperProps<S, D>) {
  const factory = MapperFactory.getInstance();
  const [error, setError] = React.useState<Error | null>(null);

  const result = useMemo(() => {
    setError(null);
    
    try {
      if (Array.isArray(source)) {
        return factory.mapArray(source, sourceClass, destClass);
      } else {
        return factory.map(source, sourceClass, destClass, options);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      if (fallback) {
        return null;
      }
      
      throw error;
    }
  }, [source, sourceClass, destClass, factory, options]);

  if (error && fallback) {
    return <>{fallback}</>;
  }

  if (!result) {
    return null;
  }

  return <>{children(result, false, error)}</>;
}

export interface AsyncMapperProps<S, D> {
  source: S | S[];
  sourceClass: ClassConstructor<S>;
  destClass: ClassConstructor<D>;
  options?: ReactMapperOptions;
  children: (result: D | D[]) => React.ReactNode;
  fallback?: React.ReactNode;
}

function createMapperResource<S, D>(
  source: S | S[],
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactMapperOptions
) {
  const factory = MapperFactory.getInstance();
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: D | D[];
  let error: Error;

  const suspender = (async () => {
    try {
      if (Array.isArray(source)) {
        result = await factory.mapArrayAsync(source, sourceClass, destClass);
      } else {
        result = await factory.mapAsync(source, sourceClass, destClass, options);
      }
      status = 'success';
    } catch (err) {
      status = 'error';
      error = err as Error;
    }
  })();

  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      }
      return result;
    }
  };
}

/**
 * @example
 * <Suspense fallback={<Loading />}>
 *   <AsyncMapper source={user} sourceClass={User} destClass={UserDTO}>
 *     {(dto) => <UserProfile data={dto} />}
 *   </AsyncMapper>
 * </Suspense>
 */
export function AsyncMapper<S, D>({
  source,
  sourceClass,
  destClass,
  options,
  children,
  fallback = <div>Loading...</div>
}: AsyncMapperProps<S, D>) {
  const resource = useMemo(
    () => createMapperResource(source, sourceClass, destClass, options),
    [source, sourceClass, destClass, options]
  );

  return (
    <Suspense fallback={fallback}>
      <AsyncMapperContent resource={resource} children={children} />
    </Suspense>
  );
}

function AsyncMapperContent<D>({
  resource,
  children
}: {
  resource: { read: () => D | D[] };
  children: (result: D | D[]) => React.ReactNode;
}) {
  const result = resource.read();
  return <>{children(result)}</>;
}

export interface MapperListProps<S, D> {
  sources: S[];
  sourceClass: ClassConstructor<S>;
  destClass: ClassConstructor<D>;
  options?: ReactMapperOptions;
  renderItem: (item: D, index: number) => React.ReactNode;
  keyExtractor?: (item: D, index: number) => string | number;
  emptyComponent?: React.ReactNode;
}

/**
 * @example
 * <MapperList
 *   sources={users}
 *   sourceClass={User}
 *   destClass={UserDTO}
 *   renderItem={(dto) => <UserCard user={dto} />}
 *   keyExtractor={(dto) => dto.id}
 * />
 */
export function MapperList<S, D>({
  sources,
  sourceClass,
  destClass,
  options,
  renderItem,
  keyExtractor,
  emptyComponent
}: MapperListProps<S, D>) {
  const factory = MapperFactory.getInstance();

  const mappedItems = useMemo(() => {
    try {
      return factory.mapArray(sources, sourceClass, destClass);
    } catch (err) {
      console.error('[MapperList] Mapping error:', err);
      return [];
    }
  }, [sources, sourceClass, destClass, factory]);

  if (mappedItems.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return (
    <>
      {mappedItems.map((item: D, index: number) => (
        <React.Fragment key={keyExtractor ? keyExtractor(item, index) : index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </>
  );
}

