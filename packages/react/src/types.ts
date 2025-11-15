import type { ClassConstructor, MapperOptions } from '@orika-js/core';

/**
 * React Mapper 配置选项
 */
export interface ReactMapperOptions extends MapperOptions {
  /**
   * 是否启用开发模式警告
   * @default true
   */
  devWarnings?: boolean;
  
  /**
   * 是否自动记忆化结果
   * @default true
   */
  memoize?: boolean;
}

/**
 * useMapper 返回结果
 */
export interface UseMappingResult<S, D> {
  /**
   * 执行映射
   */
  map: (source: S) => D;
  
  /**
   * 批量映射
   */
  mapArray: (sources: S[]) => D[];
  
  /**
   * 是否正在映射
   */
  isMapping: boolean;
  
  /**
   * 映射错误
   */
  error: Error | null;
}

/**
 * useAsyncMapper 返回结果
 */
export interface UseAsyncMappingResult<S, D> extends UseMappingResult<S, D> {
  /**
   * 异步映射
   */
  mapAsync: (source: S) => Promise<D>;
  
  /**
   * 批量异步映射
   */
  mapArrayAsync: (sources: S[]) => Promise<D[]>;
  
  /**
   * 是否正在加载
   */
  isLoading: boolean;
}

/**
 * useBatchMapper 返回结果
 */
export interface UseBatchMappingResult<S, D> {
  /**
   * 批量映射
   */
  mapBatch: (
    sources: S[],
    options?: { batchSize?: number; onProgress?: (progress: number) => void }
  ) => Promise<D[]>;
  
  /**
   * 是否正在处理
   */
  isPending: boolean;
  
  /**
   * 进度 (0-100)
   */
  progress: number;
  
  /**
   * 映射错误
   */
  error: Error | null;
}

/**
 * Mapper Context 值
 */
export interface MapperContextValue {
  /**
   * 映射单个对象
   */
  map: <S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: ReactMapperOptions
  ) => D;
  
  /**
   * 映射数组
   */
  mapArray: <S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: ReactMapperOptions
  ) => D[];
  
  /**
   * 异步映射
   */
  mapAsync: <S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: ReactMapperOptions
  ) => Promise<D>;
  
  /**
   * 批量异步映射
   */
  mapArrayAsync: <S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: ReactMapperOptions
  ) => Promise<D[]>;
}

