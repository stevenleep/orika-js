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

