/**
 * Vue 3 Adapter for orika-js
 * 为 orika-js 提供 Vue 3 响应式系统集成
 */

export { VueMapperFactory } from './VueMapperFactory';
export { useMapper, useAsyncMapper, useBatchMapper } from './composables';
export { createPiniaMapperPlugin } from './pinia-plugin';
export { mapToReactive, mapToRef, mapToComputed } from './reactive-mapper';
export type { 
  VueMapperOptions, 
  ReactiveMapperOptions,
  UseMappingResult,
  UseAsyncMappingResult 
} from './types';

