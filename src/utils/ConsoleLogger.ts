import { MappingLogger } from '../types';

export class ConsoleLogger implements MappingLogger {
  constructor(private minLevel: 'debug' | 'info' | 'warn' | 'error' = 'info') {}

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    const levels = ['debug', 'info', 'warn', 'error'];
    const minLevelIndex = levels.indexOf(this.minLevel);
    const currentLevelIndex = levels.indexOf(level);

    if (currentLevelIndex < minLevelIndex) {
      return;
    }

    const prefix = `[orika-js] [${level.toUpperCase()}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, data || '');
        break;
      case 'info':
        console.info(prefix, message, data || '');
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'error':
        console.error(prefix, message, data || '');
        break;
    }
  }
}

