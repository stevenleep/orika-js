import { ClassConstructor, Mapper } from '@orika-js/core';

/**
 * Zustand Store 映射配置
 */
export interface StoreMapperConfig<State, DTO> {
  /** 源状态类型 */
  sourceClass: ClassConstructor<State>;
  /** 目标 DTO 类型 */
  dtoClass: ClassConstructor<DTO>;
  /** 自定义 mapper（可选） */
  mapper?: Mapper<State, DTO>;
  /** 是否自动映射（默认 true） */
  autoMap?: boolean;
}

/**
 * 映射选择器选项
 */
export interface MapSelectorOptions<State, DTO> {
  /** 是否缓存结果（默认 true） */
  cache?: boolean;
  /** 是否深度比较（默认 false） */
  deepEqual?: boolean;
}

/**
 * Store 切片映射配置
 */
export interface SliceMapperConfig<State, SliceState, DTO> {
  /** 切片选择器 */
  selector: (state: State) => SliceState;
  /** 切片映射配置 */
  mapperConfig: StoreMapperConfig<SliceState, DTO>;
}

