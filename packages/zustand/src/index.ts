/**
 * @orika-js/zustand
 * Zustand integration for orika-js
 */

export { createMappedStore } from './create-mapped-store';
export {
  useMappedState,
  useMappedSelector,
  useCachedMappedState,
  useSubscribeMapped,
} from './hooks';
export {
  mapperMiddleware,
  persistMapperMiddleware,
  type MapperMiddlewareConfig,
  type PersistMapperConfig,
} from './middleware';
export type {
  StoreMapperConfig,
  MapSelectorOptions,
  SliceMapperConfig,
} from './types';

