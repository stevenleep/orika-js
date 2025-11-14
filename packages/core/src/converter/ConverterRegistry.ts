import { Converter, AsyncConverter } from '../types';
import { getBuiltInConverters } from './BuiltInConverters';

export class ConverterRegistry {
  private static instance: ConverterRegistry;
  private converters: Converter[] = [];
  private asyncConverters: AsyncConverter[] = [];

  private constructor() {
    this.registerBuiltInConverters();
  }

  static getInstance(): ConverterRegistry {
    if (!ConverterRegistry.instance) {
      ConverterRegistry.instance = new ConverterRegistry();
    }
    return ConverterRegistry.instance;
  }

  private registerBuiltInConverters(): void {
    const builtIns = getBuiltInConverters();
    builtIns.forEach(converter => this.register(converter));
  }

  register(converter: Converter): void {
    const exists = this.converters.some(c => c === converter);
    if (!exists) {
      this.converters.push(converter);
    }
  }

  registerAsync(converter: AsyncConverter): void {
    const exists = this.asyncConverters.some(c => c === converter);
    if (!exists) {
      this.asyncConverters.push(converter);
    }
  }

  unregister(converter: Converter): void {
    this.converters = this.converters.filter(c => c !== converter);
  }

  unregisterAsync(converter: AsyncConverter): void {
    this.asyncConverters = this.asyncConverters.filter(c => c !== converter);
  }

  findConverter(sourceType: any, destinationType: any): Converter | null {
    for (let i = this.converters.length - 1; i >= 0; i--) {
      const converter = this.converters[i];
      if (converter.canConvert(sourceType, destinationType)) {
        return converter;
      }
    }
    return null;
  }

  findAsyncConverter(sourceType: any, destinationType: any): AsyncConverter | null {
    for (let i = this.asyncConverters.length - 1; i >= 0; i--) {
      const converter = this.asyncConverters[i];
      if (converter.canConvert(sourceType, destinationType)) {
        return converter;
      }
    }
    return null;
  }

  clear(): void {
    this.converters = [];
  }

  reset(): void {
    this.clear();
    this.registerBuiltInConverters();
  }

  getAll(): Converter[] {
    return [...this.converters];
  }
}

