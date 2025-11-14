import { reactive, ref, computed, isRef, toRaw } from 'vue';
import type { Ref, ComputedRef, UnwrapRef } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor, MapperOptions } from '@orika-js/core';
import type { VueMapperOptions } from './types';

/**
 * Vue 3 增强的映射器工厂
 * 组合使用 MapperFactory，增加 Vue 3 响应式支持
 */
export class VueMapperFactory {
  private static vueInstance: VueMapperFactory;
  private factory: MapperFactory;

  private constructor() {
    this.factory = MapperFactory.getInstance();
  }

  /**
   * 获取 Vue 映射器工厂单例
   */
  static getVueInstance(): VueMapperFactory {
    if (!VueMapperFactory.vueInstance) {
      VueMapperFactory.vueInstance = new VueMapperFactory();
    }
    return VueMapperFactory.vueInstance;
  }

  /**
   * 映射到响应式对象
   */
  mapReactive<S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: VueMapperOptions
  ): UnwrapRef<D> {
    const rawSource = this.unwrapVueReactive(source);
    const mapped = this.factory.map(rawSource, sourceClass, destClass, options);
    return reactive(mapped as object) as UnwrapRef<D>;
  }

  /**
   * 映射到 ref
   */
  mapRef<S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: VueMapperOptions
  ): Ref<UnwrapRef<D>> {
    const rawSource = this.unwrapVueReactive(source);
    const mapped = this.factory.map(rawSource, sourceClass, destClass, options);
    return ref(mapped) as Ref<UnwrapRef<D>>;
  }

  /**
   * 映射到计算属性
   */
  mapComputed<S, D>(
    sourceRef: Ref<S>,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: VueMapperOptions
  ): ComputedRef<UnwrapRef<D>> {
    return computed(() => {
      const rawSource = this.unwrapVueReactive(sourceRef.value);
      const mapped = this.factory.map(rawSource, sourceClass, destClass, options);
      return mapped as UnwrapRef<D>;
    });
  }

  /**
   * 批量映射到响应式数组
   */
  mapArrayReactive<S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: VueMapperOptions
  ): UnwrapRef<D>[] {
    const rawSources = sources.map(s => this.unwrapVueReactive(s));
    const mapped = this.factory.mapArray(rawSources, sourceClass, destClass);
    return reactive(mapped) as UnwrapRef<D>[];
  }

  /**
   * 异步映射到响应式对象
   */
  async mapAsyncReactive<S, D>(
    source: S,
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: VueMapperOptions
  ): Promise<UnwrapRef<D>> {
    const rawSource = this.unwrapVueReactive(source);
    const mapped = await this.factory.mapAsync(rawSource, sourceClass, destClass, options);
    return reactive(mapped as object) as UnwrapRef<D>;
  }

  /**
   * 批量异步映射到响应式数组
   */
  async mapArrayAsyncReactive<S, D>(
    sources: S[],
    sourceClass: ClassConstructor<S>,
    destClass: ClassConstructor<D>,
    options?: VueMapperOptions
  ): Promise<UnwrapRef<D>[]> {
    const rawSources = sources.map(s => this.unwrapVueReactive(s));
    const mapped = await this.factory.mapArrayAsync(rawSources, sourceClass, destClass);
    return reactive(mapped) as UnwrapRef<D>[];
  }

  /**
   * 解包 Vue 响应式对象
   */
  private unwrapVueReactive<T>(value: T): T {
    if (isRef(value)) {
      return toRaw((value as any).value);
    }
    try {
      return toRaw(value);
    } catch {
      return value;
    }
  }
}

