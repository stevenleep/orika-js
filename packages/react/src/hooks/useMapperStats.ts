import { useState, useEffect, useCallback } from 'react';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor, MappingStats } from '@orika-js/core';

/**
 * @example
 * const { stats, refreshStats } = useMapperStats(User, UserDTO);
 * console.log(stats?.averageTime);
 */
export function useMapperStats<S, D>(
  sourceClass?: ClassConstructor<S>,
  destClass?: ClassConstructor<D>
) {
  const factory = MapperFactory.getInstance();
  const [stats, setStats] = useState<MappingStats | null>(null);

  useEffect(() => {
    factory.enableStatistics(true);
    return () => {
      factory.enableStatistics(false);
    };
  }, [factory]);

  const refreshStats = useCallback(() => {
    if (sourceClass && destClass) {
      const currentStats = factory.getStats(sourceClass, destClass) as MappingStats;
      setStats(currentStats);
    }
  }, [factory, sourceClass, destClass]);

  const resetStats = useCallback(() => {
    factory.resetStats();
    setStats(null);
  }, [factory]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    stats,
    refreshStats,
    resetStats
  };
}

