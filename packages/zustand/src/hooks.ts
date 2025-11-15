import { useMemo, useSyncExternalStore } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';
import { Mapper } from '@orika-js/core';

/**
 * 使用映射后的状态
 * 
 * @example
 * ```typescript
 * const userDTO = useMappedState(useUserStore, userStore.mapper);
 * ```
 */
export function useMappedState<State, DTO>(
  useStore: UseBoundStore<StoreApi<State>>,
  mapper: Mapper<State, DTO>
): DTO {
  const state = useStore();
  return useMemo(() => mapper.map(state), [state, mapper]);
}

/**
 * 使用映射后的选择器
 * 
 * @example
 * ```typescript
 * const userInfo = useMappedSelector(
 *   useUserStore,
 *   (state) => ({ name: state.name, email: state.email }),
 *   mapper
 * );
 * ```
 */
export function useMappedSelector<State, Selected, DTO>(
  useStore: UseBoundStore<StoreApi<State>>,
  selector: (state: State) => Selected,
  mapper: Mapper<Selected, DTO>,
  equalityFn?: (a: Selected, b: Selected) => boolean
): DTO {
  const selected = equalityFn 
    ? useStore(selector, equalityFn)
    : useStore(selector);
  return useMemo(() => mapper.map(selected), [selected, mapper]);
}

/**
 * 使用带缓存的映射状态
 * 
 * @example
 * ```typescript
 * const cachedDTO = useCachedMappedState(useUserStore, mapper);
 * ```
 */
export function useCachedMappedState<State extends object, DTO>(
  useStore: UseBoundStore<StoreApi<State>>,
  mapper: Mapper<State, DTO>
): DTO {
  const state = useStore();
  
  // 使用 useMemo 缓存映射结果
  return useMemo(() => {
    const cache = new WeakMap<State, DTO>();
    
    if (cache.has(state)) {
      return cache.get(state)!;
    }
    
    const mapped = mapper.map(state);
    cache.set(state, mapped);
    return mapped;
  }, [state, mapper]);
}

/**
 * 订阅并映射状态变化
 * 
 * @example
 * ```typescript
 * const dto = useSubscribeMapped(
 *   useUserStore,
 *   mapper,
 *   (mapped) => console.log('State mapped:', mapped)
 * );
 * ```
 */
export function useSubscribeMapped<State, DTO>(
  useStore: UseBoundStore<StoreApi<State>>,
  mapper: Mapper<State, DTO>,
  onMapped?: (mapped: DTO) => void
): DTO {
  const subscribe = useStore.subscribe;
  const getState = useStore.getState;

  const mappedState = useSyncExternalStore(
    subscribe,
    () => {
      const state = getState();
      const mapped = mapper.map(state);
      onMapped?.(mapped);
      return mapped;
    },
    () => mapper.map(getState())
  );

  return mappedState;
}

