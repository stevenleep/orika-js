export interface BatchOptions {
  batchSize?: number;
  parallel?: boolean;
  onProgress?: (progress: BatchProgress) => void;
  onBatchComplete?: (batchIndex: number, results: any[]) => void;
}

export interface BatchProgress {
  total: number;
  processed: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
}

export class BatchProcessor {
  static async processBatch<T, R>(
    items: T[],
    processor: (item: T) => R | Promise<R>,
    options: BatchOptions = {}
  ): Promise<R[]> {
    const {
      batchSize = 100,
      parallel = false,
      onProgress,
      onBatchComplete,
    } = options;

    const results: R[] = [];
    const totalBatches = Math.ceil(items.length / batchSize);

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const currentBatch = Math.floor(i / batchSize) + 1;

      let batchResults: R[];

      if (parallel) {
        batchResults = await Promise.all(batch.map(item => processor(item)));
      } else {
        batchResults = [];
        for (const item of batch) {
          const result = await processor(item);
          batchResults.push(result);
        }
      }

      results.push(...batchResults);

      if (onProgress) {
        const processed = Math.min(i + batchSize, items.length);
        onProgress({
          total: items.length,
          processed,
          percentage: (processed / items.length) * 100,
          currentBatch,
          totalBatches,
        });
      }

      if (onBatchComplete) {
        onBatchComplete(currentBatch, batchResults);
      }
    }

    return results;
  }

  static async processWithLimit<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    concurrency: number = 10
  ): Promise<R[]> {
    const results: R[] = new Array(items.length);
    const executing: Promise<void>[] = [];
    let currentIndex = 0;

    const processItem = async (index: number) => {
      results[index] = await processor(items[index]);
    };

    while (currentIndex < items.length) {
      while (executing.length < concurrency && currentIndex < items.length) {
        const promise = processItem(currentIndex);
        executing.push(promise);
        currentIndex++;

        promise.then(() => {
          const idx = executing.indexOf(promise);
          if (idx > -1) {
            executing.splice(idx, 1);
          }
        });
      }

      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }

    await Promise.all(executing);
    return results;
  }
}

