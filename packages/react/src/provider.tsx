import React, { useMemo } from 'react';
import { MapperContext, createMapperContextValue } from './context';
import type { ReactMapperOptions } from './types';

/**
 * MapperProvider Props
 */
export interface MapperProviderProps {
  /**
   * 子组件
   */
  children: React.ReactNode;
  
  /**
   * 全局映射选项
   */
  options?: ReactMapperOptions;
}

/**
 * MapperProvider 组件
 * 为整个 React 应用提供 mapper 实例
 * 
 * @example
 * import { MapperProvider } from '@orika-js/react';
 * 
 * function App() {
 *   return (
 *     <MapperProvider>
 *       <YourApp />
 *     </MapperProvider>
 *   );
 * }
 */
export function MapperProvider({ children, options }: MapperProviderProps) {
  const contextValue = useMemo(() => createMapperContextValue(), []);

  return (
    <MapperContext.Provider value={contextValue}>
      {children}
    </MapperContext.Provider>
  );
}

