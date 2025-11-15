import React, { ComponentType, useMemo } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';
import type { ReactMapperOptions } from './types';

/**
 * withMapper HOC 配置
 */
export interface WithMapperConfig<S, D> {
  /**
   * 源类
   */
  sourceClass: ClassConstructor<S>;
  
  /**
   * 目标类
   */
  destClass: ClassConstructor<D>;
  
  /**
   * 源数据的 prop 名称
   */
  sourceProp: string;
  
  /**
   * 映射结果的 prop 名称
   */
  destProp: string;
  
  /**
   * 映射选项
   */
  options?: ReactMapperOptions;
  
  /**
   * 是否数组映射
   */
  isArray?: boolean;
}

/**
 * withMapper - 高阶组件，自动映射 props
 * 
 * @example
 * // 自动将 userEntity 映射为 userDTO
 * const UserProfileWithMapper = withMapper({
 *   sourceClass: UserEntity,
 *   destClass: UserDTO,
 *   sourceProp: 'userEntity',
 *   destProp: 'userDTO'
 * })(UserProfile);
 * 
 * // 使用
 * <UserProfileWithMapper userEntity={entity} />
 * // UserProfile 会收到 userDTO prop
 */
export function withMapper<S, D, P extends Record<string, any>>(
  config: WithMapperConfig<S, D>
) {
  return function (Component: ComponentType<P & Record<string, D | D[]>>) {
    const WithMapperComponent = (props: P & Record<string, S | S[]>) => {
      const factory = MapperFactory.getInstance();
      const { sourceClass, destClass, sourceProp, destProp, options, isArray } = config;
      
      const source = props[sourceProp];
      
      const mapped = useMemo(() => {
        if (!source) {
          return null;
        }
        
        try {
          if (isArray || Array.isArray(source)) {
            return factory.mapArray(source as S[], sourceClass, destClass);
          } else {
            return factory.map(source as S, sourceClass, destClass, options);
          }
        } catch (err) {
          console.error('[withMapper] Mapping error:', err);
          return null;
        }
      }, [source, factory]);
      
      const newProps = {
        ...props,
        [destProp]: mapped
      } as P & Record<string, D | D[]>;
      
      return <Component {...newProps} />;
    };
    
    WithMapperComponent.displayName = `withMapper(${Component.displayName || Component.name || 'Component'})`;
    
    return WithMapperComponent;
  };
}

/**
 * withBidirectionalMapper HOC 配置
 */
export interface WithBidirectionalMapperConfig<A, B> {
  /**
   * 类 A
   */
  classA: ClassConstructor<A>;
  
  /**
   * 类 B
   */
  classB: ClassConstructor<B>;
  
  /**
   * 数据的 prop 名称
   */
  dataProp: string;
  
  /**
   * 提供给组件的映射函数名称
   */
  mapperProp?: string;
  
  /**
   * 映射选项
   */
  options?: ReactMapperOptions;
}

/**
 * withBidirectionalMapper - 提供双向映射函数的 HOC
 * 
 * @example
 * const UserFormWithMapper = withBidirectionalMapper({
 *   classA: UserEntity,
 *   classB: UserDTO,
 *   dataProp: 'user',
 *   mapperProp: 'mapper'
 * })(UserForm);
 * 
 * // UserForm 会收到 mapper.toDTO 和 mapper.toEntity
 */
export function withBidirectionalMapper<A, B, P extends Record<string, any>>(
  config: WithBidirectionalMapperConfig<A, B>
) {
  return function (Component: ComponentType<P>) {
    const WithBidirectionalMapperComponent = (props: P) => {
      const factory = MapperFactory.getInstance();
      const { classA, classB, mapperProp = 'mapper', options } = config;
      
      const mapper = useMemo(() => ({
        toB: (source: A) => factory.map(source, classA, classB, options),
        toA: (source: B) => factory.map(source, classB, classA, options),
        toBAsync: async (source: A) => factory.mapAsync(source, classA, classB, options),
        toAAsync: async (source: B) => factory.mapAsync(source, classB, classA, options),
      }), [factory]);
      
      const newProps = {
        ...props,
        [mapperProp]: mapper
      } as P;
      
      return <Component {...newProps} />;
    };
    
    WithBidirectionalMapperComponent.displayName = 
      `withBidirectionalMapper(${Component.displayName || Component.name || 'Component'})`;
    
    return WithBidirectionalMapperComponent;
  };
}

/**
 * withAutoMapper - 自动映射多个 props
 * 
 * @example
 * const MyComponent = withAutoMapper([
 *   { sourceClass: UserEntity, destClass: UserDTO, sourceProp: 'user', destProp: 'userDTO' },
 *   { sourceClass: PostEntity, destClass: PostDTO, sourceProp: 'post', destProp: 'postDTO' }
 * ])(Component);
 */
export function withAutoMapper<P extends Record<string, any>>(
  configs: WithMapperConfig<any, any>[]
) {
  return function (Component: ComponentType<P>) {
    const WithAutoMapperComponent = (props: P) => {
      const factory = MapperFactory.getInstance();
      
      const mappedProps = useMemo(() => {
        const result: Record<string, any> = {};
        
        for (const config of configs) {
          const { sourceClass, destClass, sourceProp, destProp, options, isArray } = config;
          const source = props[sourceProp];
          
          if (!source) {
            result[destProp] = null;
            continue;
          }
          
          try {
            if (isArray || Array.isArray(source)) {
              result[destProp] = factory.mapArray(source, sourceClass, destClass);
            } else {
              result[destProp] = factory.map(source, sourceClass, destClass, options);
            }
          } catch (err) {
            console.error(`[withAutoMapper] Mapping error for ${sourceProp}:`, err);
            result[destProp] = null;
          }
        }
        
        return result;
      }, [props, factory]);
      
      const newProps = {
        ...props,
        ...mappedProps
      } as P;
      
      return <Component {...newProps} />;
    };
    
    WithAutoMapperComponent.displayName = 
      `withAutoMapper(${Component.displayName || Component.name || 'Component'})`;
    
    return WithAutoMapperComponent;
  };
}

