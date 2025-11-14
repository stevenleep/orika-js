export interface ErrorRecoveryOptions {
  strategy?: 'throw' | 'skip' | 'default' | 'retry';
  maxRetries?: number;
  retryDelay?: number;
  defaultValue?: any;
  onError?: (error: Error, context: any) => void;
}

export class ErrorHandler {
  static async handleError<T>(
    error: Error,
    options: ErrorRecoveryOptions,
    retryFn?: () => Promise<T>
  ): Promise<T | undefined> {
    const strategy = options.strategy || 'throw';

    if (options.onError) {
      options.onError(error, { strategy, error });
    }

    switch (strategy) {
      case 'throw':
        throw error;

      case 'skip':
        return undefined;

      case 'default':
        return options.defaultValue as T;

      case 'retry':
        if (retryFn && options.maxRetries && options.maxRetries > 0) {
          return await this.retry(retryFn, options.maxRetries, options.retryDelay || 100);
        }
        throw error;

      default:
        throw error;
    }
  }

  static async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number,
    delay: number
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries - 1) {
          const waitTime = delay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw lastError!;
  }

  static wrapWithRecovery<T>(
    fn: () => T,
    options: ErrorRecoveryOptions
  ): T | undefined {
    try {
      return fn();
    } catch (error) {
      if (options.strategy === 'throw') {
        throw error;
      }
      if (options.strategy === 'default') {
        return options.defaultValue;
      }
      if (options.onError) {
        options.onError(error as Error, {});
      }
      return undefined;
    }
  }
}

