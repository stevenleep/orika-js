import { Atom, WritableAtom } from 'jotai';
import { ClassConstructor, Mapper } from '@orika-js/core';

/**
 * Atom 映射配置
 */
export interface AtomMapperConfig<State, DTO> {
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
 * 映射 Atom 类型
 */
export type MappedAtom<State, DTO> = Atom<DTO> & {
  /** 原始 atom */
  source: Atom<State>;
  /** Mapper 实例 */
  mapper: Mapper<State, DTO>;
};

/**
 * 可写映射 Atom 类型
 */
export type MappedWritableAtom<State, DTO> = 
  WritableAtom<DTO, [DTO], void> & {
    /** 原始 atom */
    source: WritableAtom<State, [State], void>;
    /** Mapper 实例 */
    mapper: Mapper<State, DTO>;
    /** 反向 mapper（DTO -> State） */
    reverseMapper?: Mapper<DTO, State>;
  };

