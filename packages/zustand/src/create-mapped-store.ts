import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { Mapper, MapperFactory, createMapperBuilder } from '@orika-js/core';
import { StoreMapperConfig } from './types';

/**
 * 创建带映射功能的 Zustand Store
 * 
 * @example
 * ```typescript
 * class UserState {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 * 
 * class UserDTO {
 *   userId: number;
 *   displayName: string;
 *   contact: string;
 * }
 * 
 * const useUserStore = createMappedStore<UserState, UserDTO>({
 *   sourceClass: UserState,
 *   dtoClass: UserDTO,
 * })((set) => ({
 *   id: 0,
 *   name: '',
 *   email: ''
 * }));
 * 
 * // 使用 mapper
 * const dto = useUserStore.mapper.map(useUserStore.getState());
 * ```
 */
export function createMappedStore<State extends object, DTO extends object>(
  mapperConfig: StoreMapperConfig<State, DTO>
) {
  // 创建或获取 mapper
  const mapper = mapperConfig.mapper || createDefaultMapper(mapperConfig);

  return function <T extends State>(
    stateCreator: StateCreator<T, [], []>
  ): UseBoundStore<StoreApi<T>> & {
    mapper: Mapper<any, DTO>;
    mapState: () => DTO;
    mapStatePartial: (selector: (state: T) => Partial<T>) => Partial<DTO>;
  } {
    const store = create<T>(stateCreator);

    return Object.assign(store, {
      mapper: mapper as Mapper<any, DTO>,
      /**
       * 映射当前完整状态到 DTO
       */
      mapState: () => {
        return mapper.map(store.getState() as any);
      },
      /**
       * 映射部分状态到 DTO
       */
      mapStatePartial: (selector: (state: T) => Partial<T>) => {
        const partialState = selector(store.getState());
        return mapper.map(partialState as any) as Partial<DTO>;
      },
    });
  };
}

/**
 * 创建默认的 mapper
 */
function createDefaultMapper<State, DTO>(
  config: StoreMapperConfig<State, DTO>
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

