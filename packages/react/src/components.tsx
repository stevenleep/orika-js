import React, { useMemo, Suspense } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from './types';

/**
 * Mapper 组件属性
 */
export interface MapperProps<S, D> {
  /**
   * 源数据
   */
  source: S | S[];
  
  /**
   * 源类
   */
  sourceClass: ClassConstructor<S>;
  
  /**
   * 目标类
   */
  destClass: ClassConstructor<D>;
  
  /**
   * 映射选项
   */
  options?: ReactMapperOptions;
  
  /**
   * Render props
   */
  children: (result: D | D[], isMapping: boolean, error: Error | null) => React.ReactNode;
  
  /**
   * 错误回退
   */
  fallback?: React.ReactNode;
}

/**
 * Mapper 组件 - Render Props 模式
 * 
 * @example
 * <Mapper 
 *   source={user} 
 *   sourceClass={UserEntity} 
 *   destClass={UserDTO}
 * >
 *   {(dto, isMapping, error) => (
 *     error ? <Error /> : 
 *     isMapping ? <Loading /> : 
 *     <UserProfile data={dto} />
 *   )}
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

/**
 * AsyncMapper 组件属性
 */
export interface AsyncMapperProps<S, D> {
  /**
   * 源数据
   */
  source: S | S[];
  
  /**
   * 源类
   */
  sourceClass: ClassConstructor<S>;
  
  /**
   * 目标类
   */
  destClass: ClassConstructor<D>;
  
  /**
   * 映射选项
   */
  options?: ReactMapperOptions;
  
  /**
   * Render props
   */
  children: (result: D | D[]) => React.ReactNode;
  
  /**
   * 加载中组件
   */
  fallback?: React.ReactNode;
}

/**
 * 异步映射资源 - 用于 Suspense
 */
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
 * AsyncMapper 组件 - 配合 Suspense 使用
 * 
 * @example
 * <Suspense fallback={<Loading />}>
 *   <AsyncMapper 
 *     source={user} 
 *     sourceClass={UserEntity} 
 *     destClass={UserDTO}
 *   >
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

/**
 * AsyncMapper 内容组件
 */
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

/**
 * MapperList 组件属性
 */
export interface MapperListProps<S, D> {
  /**
   * 源数据数组
   */
  sources: S[];
  
  /**
   * 源类
   */
  sourceClass: ClassConstructor<S>;
  
  /**
   * 目标类
   */
  destClass: ClassConstructor<D>;
  
  /**
   * 映射选项
   */
  options?: ReactMapperOptions;
  
  /**
   * 渲染每一项
   */
  renderItem: (item: D, index: number) => React.ReactNode;
  
  /**
   * 列表 key 提取器
   */
  keyExtractor?: (item: D, index: number) => string | number;
  
  /**
   * 空列表组件
   */
  emptyComponent?: React.ReactNode;
}

/**
 * MapperList 组件 - 列表映射渲染
 * 
 * @example
 * <MapperList
 *   sources={users}
 *   sourceClass={UserEntity}
 *   destClass={UserDTO}
 *   renderItem={(dto, index) => (
 *     <UserCard key={dto.id} user={dto} />
 *   )}
 *   keyExtractor={(dto) => dto.id}
 *   emptyComponent={<EmptyState />}
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

