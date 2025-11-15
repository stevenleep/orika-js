import { ref } from 'vue';
import { MapperFactory } from '@orika-js/core';
import type { ClassConstructor } from '@orika-js/core';

/**
 * @example
 * const { stats, refreshStats } = useMapperStats(User, UserDTO);
 * console.log(stats.value?.averageTime);
 */
export function useMapperStats<S, D>(
  sourceClass?: ClassConstructor<S>,
  destClass?: ClassConstructor<D>
) {
  const factory = MapperFactory.getInstance();
  const stats = ref<any>(null);

  // 启用统计
  factory.enableStatistics(true);

  const refreshStats = () => {
    if (sourceClass && destClass) {
      const currentStats = factory.getStats(sourceClass, destClass);
      stats.value = currentStats;
    }
  };

  const resetStats = () => {
    factory.resetStats();
    stats.value = null;
  };

  // 初始加载
  refreshStats();

  return {
    stats,
    refreshStats,
    resetStats
  };
}

