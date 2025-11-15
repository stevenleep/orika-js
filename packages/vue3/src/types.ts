import type { Ref, ComputedRef, UnwrapRef } from 'vue';
import type { ClassConstructor, MapperOptions } from '@orika-js/core';

/**
 * Vue Mapper 配置选项
 */
export interface VueMapperOptions extends MapperOptions {
  /**
   * 是否自动解包 ref/reactive 对象
   * @default true
   */
  autoUnwrap?: boolean;
  
  /**
   * 是否深度响应式
   * @default true
   */
  deep?: boolean;
  
  /**
   * 是否启用开发模式警告
   * @default true
   */
  devWarnings?: boolean;
}

/**
 * 响应式映射选项
 */
export interface ReactiveMapperOptions {
  /**
   * 是否深度响应式
   * @default true
   */
  deep?: boolean;
  
  /**
   * 是否在映射失败时保留原值
   * @default false
   */
  keepOnError?: boolean;
}

/**
 * useMapper 返回结果
 */
export interface UseMappingResult<S, D> {
  /**
   * 执行映射
   */
  map: (source: S) => UnwrapRef<D>;
  
  /**
   * 映射到响应式对象
   */
  mapToReactive: (source: S) => UnwrapRef<D>;
  
  /**
   * 映射到 ref
   */
  mapToRef: (source: S) => Ref<UnwrapRef<D>>;
  
  /**
   * 映射到计算属性
   */
  mapToComputed: (sourceRef: Ref<S>) => ComputedRef<UnwrapRef<D>>;
  
  /**
   * 批量映射
   */
  mapArray: (sources: S[]) => UnwrapRef<D>[];
  
  /**
   * 是否正在映射
   */
  isMapping: Ref<boolean>;
  
  /**
   * 映射错误
   */
  error: Ref<Error | null>;
}

/**
 * useAsyncMapper 返回结果
 */
export interface UseAsyncMappingResult<S, D> extends UseMappingResult<S, D> {
  /**
   * 异步映射
   */
  mapAsync: (source: S) => Promise<UnwrapRef<D>>;
  
  /**
   * 批量异步映射
   */
  mapArrayAsync: (sources: S[]) => Promise<UnwrapRef<D>[]>;
  
  /**
   * 是否正在加载
   */
  isLoading: Ref<boolean>;
}

/**
 * Pinia 映射插件选项
 */
export interface PiniaMapperOptions {
  /**
   * 是否自动转换 API 响应
   * @default true
   */
  autoTransform?: boolean;
  
  /**
   * 是否缓存映射结果
   * @default true
   */
  cache?: boolean;
  
  /**
   * 是否启用调试日志
   * @default false
   */
  debug?: boolean;
}

/**
 * 双向映射返回结果
 */
export interface UseBidirectionalMapperResult<A, B> {
  /**
   * A → B 映射
   */
  toB: (source: A) => B;
  
  /**
   * B → A 映射
   */
  toA: (source: B) => A;
  
  /**
   * 是否正在映射
   */
  isMapping: Ref<boolean>;
  
  /**
   * 映射错误
   */
  error: Ref<Error | null>;
}

/**
 * 差异检测返回结果
 */
export interface UseMapperDiffResult<T> {
  /**
   * 计算差异
   */
  diff: (obj1: T, obj2: T) => Partial<T>;
  
  /**
   * 检查是否有变更
   */
  hasChanges: (changes: Partial<T>) => boolean;
  
  /**
   * 应用变更
   */
  applyChanges: (changes: Partial<T>, targetClass: ClassConstructor<T>) => T;
}

/**
 * 链式映射返回结果
 */
export interface UseMapperChainResult {
  /**
   * 链式映射
   */
  mapChain: <T>(source: any, ...classes: ClassConstructor<any>[]) => T;
  
  /**
   * 异步链式映射
   */
  mapChainAsync: <T>(source: any, ...classes: ClassConstructor<any>[]) => Promise<T>;
  
  /**
   * 是否正在映射
   */
  isMapping: Ref<boolean>;
  
  /**
   * 映射错误
   */
  error: Ref<Error | null>;
}

/**
 * 合并映射返回结果
 */
export interface UseMergeMapperResult<S, D> {
  /**
   * 合并映射
   */
  merge: (source: Partial<S>, destination: D) => D;
  
  /**
   * 异步合并映射
   */
  mergeAsync: (source: Partial<S>, destination: D) => Promise<D>;
  
  /**
   * 是否正在映射
   */
  isMapping: Ref<boolean>;
  
  /**
   * 映射错误
   */
  error: Ref<Error | null>;
}

/**
 * 性能统计返回结果
 */
export interface UseMapperStatsResult {
  /**
   * 统计信息
   */
  stats: Ref<any>;
  
  /**
   * 刷新统计
   */
  refreshStats: () => void;
  
  /**
   * 重置统计
   */
  resetStats: () => void;
}

