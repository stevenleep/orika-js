import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { Mapper } from '@orika-js/core';

/**
 * 映射中间件配置
 */
export interface MapperMiddlewareConfig<State, DTO> {
  /** Mapper 实例 */
  mapper: Mapper<State, DTO>;
  /** 在状态更新后调用 */
  onMapped?: (state: State, mapped: DTO) => void;
  /** 是否记录映射日志 */
  log?: boolean;
}

/**
 * 创建映射中间件
 * 在每次状态更新时自动映射到 DTO
 * 
 * @example
 * ```typescript
 * const useStore = create(
 *   mapperMiddleware(
 *     (set) => ({
 *       id: 0,
 *       name: '',
 *       updateName: (name: string) => set({ name })
 *     }),
 *     {
 *       mapper: myMapper,
 *       onMapped: (state, dto) => {
 *         console.log('Mapped:', dto);
 *       }
 *     }
 *   )
 * );
 * ```
 */
export function mapperMiddleware<T, DTO>(
  f: StateCreator<T>,
  config: MapperMiddlewareConfig<T, DTO>
): StateCreator<T> {
  return (set, get, store) => {
    const wrappedSet: typeof set = (...args: any[]) => {
      const result = (set as any)(...args);
      
      // 获取新状态并映射
      const newState = get();
      const mapped = config.mapper.map(newState);
      
      // 日志
      if (config.log) {
        console.log('[Mapper Middleware] State:', newState);
        console.log('[Mapper Middleware] Mapped:', mapped);
      }
      
      // 回调
      config.onMapped?.(newState, mapped);
      
      return result;
    };

    return f(wrappedSet, get, store);
  };
}

/**
 * 创建持久化映射中间件
 * 将映射后的状态持久化到 localStorage
 * 
 * @example
 * ```typescript
 * const useStore = create(
 *   persistMapperMiddleware(
 *     (set) => ({ ... }),
 *     {
 *       mapper: myMapper,
 *       key: 'user-dto',
 *       storage: localStorage
 *     }
 *   )
 * );
 * ```
 */
export interface PersistMapperConfig<State, DTO> {
  mapper: Mapper<State, DTO>;
  key: string;
  storage?: Storage;
  serialize?: (dto: DTO) => string;
  deserialize?: (str: string) => DTO;
}

export function persistMapperMiddleware<T, DTO>(
  f: StateCreator<T>,
  config: PersistMapperConfig<T, DTO>
): StateCreator<T> {
  return (set, get, store) => {
    const storage = config.storage || (typeof window !== 'undefined' ? window.localStorage : undefined);
    const serialize = config.serialize || JSON.stringify;

    if (!storage) {
      console.warn('[Persist Mapper] Storage not available');
      return f(set, get, store);
    }

    const wrappedSet: typeof set = (...args: any[]) => {
      const result = (set as any)(...args);
      
      // 映射并持久化
      const newState = get();
      const mapped = config.mapper.map(newState);
      
      try {
        storage.setItem(config.key, serialize(mapped));
      } catch (error) {
        console.error('[Persist Mapper] Failed to persist:', error);
      }
      
      return result;
    };

    // 尝试从存储恢复
    try {
      const stored = storage.getItem(config.key);
      if (stored && config.deserialize) {
        const dto = config.deserialize(stored);
        console.log('[Persist Mapper] Restored from storage:', dto);
      }
    } catch (error) {
      console.error('[Persist Mapper] Failed to restore:', error);
    }

    return f(wrappedSet, get, store);
  };
}

