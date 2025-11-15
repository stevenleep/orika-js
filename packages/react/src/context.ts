import { createContext, useContext } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { MapperContextValue } from './types';

/**
 * Mapper Context
 * 用于在 React 组件树中共享 mapper 实例
 */
export const MapperContext = createContext<MapperContextValue | null>(null);

/**
 * 获取 Mapper Context
 * @throws 如果不在 MapperProvider 内部使用会抛出错误
 */
export function useMapperContext(): MapperContextValue {
  const context = useContext(MapperContext);
  
  if (!context) {
    throw new Error(
      'useMapperContext must be used within a MapperProvider. ' +
      'Wrap your component tree with <MapperProvider>.'
    );
  }
  
  return context;
}

/**
 * 创建默认的 Mapper Context 值
 */
export function createMapperContextValue(): MapperContextValue {
  const factory = MapperFactory.getInstance();
  
  return {
    map: (source, sourceClass, destClass, options) => {
      return factory.map(source, sourceClass, destClass, options);
    },
    
    mapArray: (sources, sourceClass, destClass, options) => {
      return factory.mapArray(sources, sourceClass, destClass);
    },
    
    mapAsync: async (source, sourceClass, destClass, options) => {
      return factory.mapAsync(source, sourceClass, destClass, options);
    },
    
    mapArrayAsync: async (sources, sourceClass, destClass, options) => {
      return factory.mapArrayAsync(sources, sourceClass, destClass);
    }
  };
}

