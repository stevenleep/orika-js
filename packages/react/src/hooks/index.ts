/**
 * React Hooks for orika-js
 * 按功能分类组织的映射 Hooks
 */

// ============================================
// 基础映射 Hooks
// ============================================
export { useMapper } from './useMapper';
export { useAsyncMapper } from './useAsyncMapper';
export { useMemoizedMapper } from './useMemoizedMapper';

// ============================================
// 批量处理 Hooks
// ============================================
export { useBatchMapper } from './useBatchMapper';
export { useAutoMapper } from './useAutoMapper';

// ============================================
// 表单处理 Hooks
// ============================================
export { useMergeMapper } from './useMergeMapper';
export { useBidirectionalMapper } from './useBidirectionalMapper';
export { useMapperDiff } from './useMapperDiff';

// ============================================
// 链式转换 Hooks
// ============================================
export { useMapperChain } from './useMapperChain';

// ============================================
// 性能优化 Hooks
// ============================================
export { useMapperCallback } from './useMapperCallback';
export { useMapperStats } from './useMapperStats';

// ============================================
// React 18 特性 Hooks
// ============================================
export { useTransitionMapper } from './useTransitionMapper';
export { useDeferredMapper } from './useDeferredMapper';

// ============================================
// 条件映射 Hooks
// ============================================
export { useConditionalMapper } from './useConditionalMapper';

