import type { ClassConstructor } from '@orika-js/core';

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
 * Pinia Store 映射器接口
 */
export interface PiniaStoreMapper {
  /**
   * 映射单个对象
   */
  map<S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>
  ): D;
  
  /**
   * 映射数组
   */
  mapArray<S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>
  ): D[];
  
  /**
   * 异步映射
   */
  mapAsync<S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>
  ): Promise<D>;
  
  /**
   * 批量异步映射
   */
  mapArrayAsync<S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>
  ): Promise<D[]>;
  
  /**
   * 合并映射（用于更新现有状态）
   */
  merge<S, D>(
    updates: Partial<S>,
    existing: D,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>
  ): D;
}

