import { ref, reactive, computed, isRef, isReactive, toRaw, unref } from 'vue';
import type { Ref, ComputedRef, UnwrapRef } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor, MapperOptions } from '@orika-js/core';
import type { ReactiveMapperOptions } from './types';

/**
 * 将对象映射为响应式对象
 * @example
 * const user = { id: 1, name: 'Alice' };
 * const userDTO = mapToReactive(user, User, UserDTO);
 * // userDTO 是响应式的，可以直接在模板中使用
 */
export function mapToReactive<S, D>(
  source: S,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactiveMapperOptions & MapperOptions
): UnwrapRef<D> {
  const factory = MapperFactory.getInstance();
  
  try {
    // 解包 ref/reactive
    const rawSource = unwrapSource(source);
    
    // 执行映射
    const mapped = factory.map(rawSource, sourceClass, destClass, options);
    
    // 转换为响应式
    if (options?.deep === false) {
      return reactive(mapped as object) as UnwrapRef<D>;
    }
    
    return reactive(mapped as object) as UnwrapRef<D>;
  } catch (error) {
    if (options?.keepOnError && source) {
      return reactive(source as any) as UnwrapRef<D>;
    }
    throw error;
  }
}

/**
 * 将对象映射为 ref
 * @example
 * const user = { id: 1, name: 'Alice' };
 * const userDTORef = mapToRef(user, User, UserDTO);
 * console.log(userDTORef.value);
 */
export function mapToRef<S, D>(
  source: S,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactiveMapperOptions & MapperOptions
): Ref<UnwrapRef<D>> {
  const factory = MapperFactory.getInstance();
  
  try {
    const rawSource = unwrapSource(source);
    const mapped = factory.map(rawSource, sourceClass, destClass, options);
    return ref(mapped) as Ref<UnwrapRef<D>>;
  } catch (error) {
    if (options?.keepOnError && source) {
      return ref(source as any) as Ref<UnwrapRef<D>>;
    }
    throw error;
  }
}

/**
 * 创建计算属性映射
 * @example
 * const userRef = ref({ id: 1, name: 'Alice' });
 * const userDTOComputed = mapToComputed(userRef, User, UserDTO);
 * // userDTOComputed 会随 userRef 自动更新
 */
export function mapToComputed<S, D>(
  sourceRef: Ref<S>,
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactiveMapperOptions & MapperOptions
): ComputedRef<UnwrapRef<D>> {
  const factory = MapperFactory.getInstance();
  
  return computed(() => {
    try {
      const rawSource = unwrapSource(sourceRef.value);
      const mapped = factory.map(rawSource, sourceClass, destClass, options);
      return mapped as UnwrapRef<D>;
    } catch (error) {
      if (options?.keepOnError && sourceRef.value) {
        return sourceRef.value as any as UnwrapRef<D>;
      }
      throw error;
    }
  });
}

/**
 * 批量映射为响应式数组
 */
export function mapArrayToReactive<S, D>(
  sources: S[],
  sourceClass: ClassConstructor<S>,
  destClass: ClassConstructor<D>,
  options?: ReactiveMapperOptions & MapperOptions
): UnwrapRef<D>[] {
  const factory = MapperFactory.getInstance();
  
  const rawSources = sources.map(s => unwrapSource(s));
  const mapped = factory.mapArray(rawSources, sourceClass, destClass);
  
  return reactive(mapped) as UnwrapRef<D>[];
}

/**
 * 解包 ref/reactive 对象
 */
function unwrapSource<T>(source: T): any {
  if (isRef(source)) {
    return toRaw(unref(source));
  }
  if (isReactive(source)) {
    return toRaw(source);
  }
  return source;
}

