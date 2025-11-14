import { MappingContext } from '../types';

export class DefaultMappingContext implements MappingContext {
  mappedObjects: WeakMap<object, unknown>;
  depth: number;
  maxDepth: number;

  constructor(maxDepth: number = 10) {
    this.mappedObjects = new WeakMap();
    this.depth = 0;
    this.maxDepth = maxDepth;
  }

  hasMapped(source: object): boolean {
    return this.mappedObjects.has(source);
  }

  getMapped<T = unknown>(source: object): T | undefined {
    return this.mappedObjects.get(source) as T | undefined;
  }

  setMapped(source: object, destination: unknown): void {
    this.mappedObjects.set(source, destination);
  }

  increaseDepth(): void {
    this.depth++;
    if (this.depth > this.maxDepth) {
      throw new Error(`Maximum mapping depth (${this.maxDepth}) exceeded. Possible circular reference.`);
    }
  }

  decreaseDepth(): void {
    this.depth--;
  }

  reset(): void {
    this.mappedObjects = new WeakMap();
    this.depth = 0;
  }
}

