import { useAtom, useAtomValue, useSetAtom, Atom, WritableAtom } from 'jotai';
import { useMemo } from 'react';
import { Mapper } from '@orika-js/core';
import { AtomMapperConfig } from './types';
import { mappedAtom, mappedWritableAtom } from './atoms';

/**
 * 使用映射后的 Atom 值
 * 
 * @example
 * ```typescript
 * const userDTO = useMappedAtomValue(userAtom, {
 *   sourceClass: User,
 *   dtoClass: UserDTO
 * });
 * ```
 */
export function useMappedAtomValue<State, DTO>(
  sourceAtom: Atom<State>,
  config: AtomMapperConfig<State, DTO>
): DTO {
  const mapped = useMemo(
    () => mappedAtom(sourceAtom, config),
    [sourceAtom, config.sourceClass, config.dtoClass]
  );
  
  return useAtomValue(mapped);
}

/**
 * 使用可写映射 Atom
 * 
 * @example
 * ```typescript
 * const [userDTO, setUserDTO] = useMappedAtom(
 *   userAtom,
 *   { sourceClass: User, dtoClass: UserDTO },
 *   { sourceClass: UserDTO, dtoClass: User }
 * );
 * ```
 */
export function useMappedAtom<State, DTO>(
  sourceAtom: WritableAtom<State, [State], void>,
  forwardConfig: AtomMapperConfig<State, DTO>,
  reverseConfig?: AtomMapperConfig<DTO, State>
): [DTO, (update: DTO) => void] {
  const mapped = useMemo(
    () => mappedWritableAtom(sourceAtom, forwardConfig, reverseConfig),
    [sourceAtom, forwardConfig.sourceClass, forwardConfig.dtoClass]
  );
  
  return useAtom(mapped);
}

/**
 * 使用映射 Atom 的 setter
 * 
 * @example
 * ```typescript
 * const setUserDTO = useSetMappedAtom(userAtom, {
 *   sourceClass: UserDTO,
 *   dtoClass: User
 * });
 * 
 * setUserDTO(newDTO);
 * ```
 */
export function useSetMappedAtom<State, DTO>(
  sourceAtom: WritableAtom<State, [State], void>,
  reverseConfig: AtomMapperConfig<DTO, State>
): (update: DTO) => void {
  const setSource = useSetAtom(sourceAtom);
  const mapper = useMemo(
    () => reverseConfig.mapper || createDefaultMapper(reverseConfig),
    [reverseConfig]
  );

  return useMemo(
    () => (update: DTO) => {
      const state = mapper.map(update);
      setSource(state);
    },
    [mapper, setSource]
  );
}

/**
 * 使用自定义 mapper 映射 Atom
 * 
 * @example
 * ```typescript
 * const userDTO = useAtomWithMapper(userAtom, myCustomMapper);
 * ```
 */
export function useAtomWithMapper<State, DTO>(
  sourceAtom: Atom<State>,
  mapper: Mapper<State, DTO>
): DTO {
  const state = useAtomValue(sourceAtom);
  return useMemo(() => mapper.map(state), [state, mapper]);
}

/**
 * 使用派生映射 Atom
 * 从源 atom 派生出映射后的值
 * 
 * @example
 * ```typescript
 * const userName = useDerivedMappedAtom(
 *   userAtom,
 *   (user) => user.name,
 *   nameMapper
 * );
 * ```
 */
export function useDerivedMappedAtom<State, Derived, DTO>(
  sourceAtom: Atom<State>,
  selector: (state: State) => Derived,
  mapper: Mapper<Derived, DTO>
): DTO {
  const state = useAtomValue(sourceAtom);
  const derived = useMemo(() => selector(state), [state, selector]);
  return useMemo(() => mapper.map(derived), [derived, mapper]);
}

/**
 * 创建默认的 mapper（辅助函数）
 */
function createDefaultMapper<State, DTO>(
  config: AtomMapperConfig<State, DTO>
): Mapper<State, DTO> {
  // 这里复用 atoms.ts 中的逻辑
  const { MapperFactory, createMapperBuilder } = require('@orika-js/core');
  
  const factory = MapperFactory.getInstance();
  const existing = factory.getMapper(config.sourceClass, config.dtoClass);
  if (existing) return existing;

  const builder = createMapperBuilder(config.sourceClass, config.dtoClass);
  if (config.autoMap !== false) builder.autoMap(true);
  
  const mappingConfig = builder.build();
  factory.registerMapping(mappingConfig);
  
  return factory.getMapper(config.sourceClass, config.dtoClass)!;
}

