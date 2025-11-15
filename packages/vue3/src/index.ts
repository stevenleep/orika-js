export { VueMapperFactory } from './VueMapperFactory';

// 基础映射
export { 
  useMapper, 
  useAsyncMapper,
  useMemoizedMapper 
} from './composables/index';

// 批量处理
export { 
  useBatchMapper,
  useAutoMapper 
} from './composables/index';

// 表单处理
export { 
  useBidirectionalMapper,
  useMapperDiff,
  useMergeMapper 
} from './composables/index';

// 链式转换
export { useMapperChain } from './composables/index';

// 性能优化
export { 
  useMapperStats,
  useConditionalMapper 
} from './composables/index';

// 响应式映射函数
export { mapToReactive, mapToRef, mapToComputed } from './reactive-mapper';

// Pinia 插件
export { createPiniaMapperPlugin } from './pinia-plugin';

// 类型导出
export type { 
  VueMapperOptions, 
  ReactiveMapperOptions,
  UseMappingResult,
  UseAsyncMappingResult,
  UseBidirectionalMapperResult,
  UseMapperDiffResult,
  UseMapperChainResult,
  UseMergeMapperResult,
  UseMapperStatsResult,
  PiniaMapperOptions
} from './types';

