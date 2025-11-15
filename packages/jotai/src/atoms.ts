import { atom, Atom, WritableAtom } from 'jotai';
import { Mapper, MapperFactory, createMapperBuilder } from '@orika-js/core';
import { AtomMapperConfig, MappedAtom, MappedWritableAtom } from './types';

/**
 * 创建映射 Atom
 * 自动将源 atom 的值映射到 DTO
 * 
 * @example
 * ```typescript
 * const userAtom = atom({ id: 1, name: 'Alice', email: 'alice@example.com' });
 * 
 * const userDTOAtom = mappedAtom(userAtom, {
 *   sourceClass: User,
 *   dtoClass: UserDTO
 * });
 * 
 * // 读取时自动映射
 * const dto = useAtomValue(userDTOAtom);
 * ```
 */
export function mappedAtom<State, DTO>(
  sourceAtom: Atom<State>,
  config: AtomMapperConfig<State, DTO>
): MappedAtom<State, DTO> {
  const mapper = config.mapper || createDefaultMapper(config);

  const derivedAtom = atom((get) => {
    const state = get(sourceAtom);
    return mapper.map(state);
  }) as MappedAtom<State, DTO>;

  // 附加额外属性
  derivedAtom.source = sourceAtom;
  derivedAtom.mapper = mapper;

  return derivedAtom;
}

/**
 * 创建可写映射 Atom
 * 支持双向映射
 * 
 * @example
 * ```typescript
 * const userAtom = atom({ id: 1, name: 'Alice' });
 * 
 * const userDTOAtom = mappedWritableAtom(
 *   userAtom,
 *   {
 *     sourceClass: User,
 *     dtoClass: UserDTO
 *   },
 *   {
 *     sourceClass: UserDTO,
 *     dtoClass: User
 *   }
 * );
 * 
 * // 读取时映射 State -> DTO
 * const dto = useAtomValue(userDTOAtom);
 * 
 * // 写入时映射 DTO -> State
 * setUserDTO(newDTO);
 * ```
 */
export function mappedWritableAtom<State, DTO>(
  sourceAtom: WritableAtom<State, [State], void>,
  forwardConfig: AtomMapperConfig<State, DTO>,
  reverseConfig?: AtomMapperConfig<DTO, State>
): WritableAtom<DTO, [DTO], void> {
  const forwardMapper = forwardConfig.mapper || createDefaultMapper(forwardConfig);
  const reverseMapper = reverseConfig 
    ? (reverseConfig.mapper || createDefaultMapper(reverseConfig))
    : undefined;

  const derivedAtom = atom(
    (get) => {
      const state = get(sourceAtom);
      return forwardMapper.map(state);
    },
    (get, set, update: DTO) => {
      if (reverseMapper) {
        const state = reverseMapper.map(update);
        set(sourceAtom, state);
      } else {
        // 如果没有反向映射器，直接设置（假设类型兼容）
        set(sourceAtom, update as any);
      }
    }
  );

  return derivedAtom;
}

/**
 * 创建映射 Atom Family
 * 
 * @example
 * ```typescript
 * const userAtomFamily = atomFamily((id: number) => 
 *   atom({ id, name: '', email: '' })
 * );
 * 
 * const userDTOFamily = mappedAtomFamily(
 *   userAtomFamily,
 *   { sourceClass: User, dtoClass: UserDTO }
 * );
 * 
 * const user1DTO = useAtomValue(userDTOFamily(1));
 * ```
 */
export function mappedAtomFamily<Param, State, DTO>(
  atomFamily: (param: Param) => Atom<State>,
  config: AtomMapperConfig<State, DTO>
): (param: Param) => MappedAtom<State, DTO> {
  const mapper = config.mapper || createDefaultMapper(config);
  const cache = new Map<Param, MappedAtom<State, DTO>>();

  return (param: Param) => {
    if (cache.has(param)) {
      return cache.get(param)!;
    }

    const sourceAtom = atomFamily(param);
    const mapped = mappedAtom(sourceAtom, { ...config, mapper });
    cache.set(param, mapped);
    return mapped;
  };
}

/**
 * 创建异步映射 Atom
 * 
 * @example
 * ```typescript
 * const asyncUserAtom = atom(async () => {
 *   const response = await fetch('/api/user');
 *   return response.json();
 * });
 * 
 * const userDTOAtom = asyncMappedAtom(asyncUserAtom, {
 *   sourceClass: User,
 *   dtoClass: UserDTO
 * });
 * ```
 */
export function asyncMappedAtom<State, DTO>(
  sourceAtom: Atom<Promise<State>>,
  config: AtomMapperConfig<State, DTO>
): Atom<Promise<DTO>> {
  const mapper = config.mapper || createDefaultMapper(config);

  return atom(async (get) => {
    const state = await get(sourceAtom);
    return mapper.map(state);
  });
}

/**
 * 创建默认的 mapper
 */
function createDefaultMapper<State, DTO>(
  config: AtomMapperConfig<State, DTO>
): Mapper<State, DTO> {
  const factory = MapperFactory.getInstance();
  
  // 检查是否已经注册
  const existing = factory.getMapper(config.sourceClass, config.dtoClass);
  if (existing) {
    return existing;
  }

  // 创建新的 mapper
  const builder = createMapperBuilder<State, DTO>(
    config.sourceClass,
    config.dtoClass
  );

  if (config.autoMap !== false) {
    builder.autoMap(true);
  }

  const mappingConfig = builder.build();
  factory.registerMapping(mappingConfig);
  
  return factory.getMapper(config.sourceClass, config.dtoClass)!;
}

