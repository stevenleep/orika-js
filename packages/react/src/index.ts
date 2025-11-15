/**
 * React Adapter for orika-js
 * 为 orika-js 提供 React Hooks 和组件
 */

// Context & Provider
export { MapperProvider } from './provider';
export { MapperContext, useMapperContext, createMapperContextValue } from './context';

export {
  // 基础映射
  useMapper,
  useAsyncMapper,
  useMemoizedMapper,
  
  // 批量处理
  useBatchMapper,
  useAutoMapper,
  
  // 表单处理
  useMergeMapper,
  useBidirectionalMapper,
  useMapperDiff,
  
  // 链式转换
  useMapperChain,
  
  // 性能优化
  useMapperCallback,
  useMapperStats,
  
  // React 18 特性
  useTransitionMapper,
  useDeferredMapper,
  
  // 条件映射
  useConditionalMapper
} from './hooks';

// Components
export {
  Mapper,
  AsyncMapper,
  MapperList
} from './components';
export type {
  MapperProps,
  AsyncMapperProps,
  MapperListProps
} from './components';

// Higher Order Components
export {
  withMapper,
  withBidirectionalMapper,
  withAutoMapper
} from './hoc';
export type {
  WithMapperConfig,
  WithBidirectionalMapperConfig
} from './hoc';

// Types
export type {
  ReactMapperOptions,
  UseMappingResult,
  UseAsyncMappingResult,
  UseBatchMappingResult,
  MapperContextValue
} from './types';
