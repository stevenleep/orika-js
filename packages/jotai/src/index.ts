/**
 * @orika-js/jotai
 * Jotai integration for orika-js
 */

export {
  mappedAtom,
  mappedWritableAtom,
  mappedAtomFamily,
  asyncMappedAtom,
} from './atoms';

export {
  useMappedAtomValue,
  useMappedAtom,
  useSetMappedAtom,
  useAtomWithMapper,
  useDerivedMappedAtom,
} from './hooks';

export type {
  AtomMapperConfig,
  MappedAtom,
  MappedWritableAtom,
} from './types';

