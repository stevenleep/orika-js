export interface PropertyDescriptorOptions {
  includeSymbols?: boolean;
  includeInherited?: boolean;
  includeNonEnumerable?: boolean;
}

export class PropertyUtils {
  static getAllKeys(obj: any, options: PropertyDescriptorOptions = {}): PropertyKey[] {
    const {
      includeSymbols = false,
      includeInherited = false,
      includeNonEnumerable = false
    } = options;

    const keys = new Set<PropertyKey>();

    if (includeInherited) {
      let current = obj;
      while (current && current !== Object.prototype) {
        this.addKeysFrom(current, keys, includeSymbols, includeNonEnumerable);
        current = Object.getPrototypeOf(current);
      }
    } else {
      this.addKeysFrom(obj, keys, includeSymbols, includeNonEnumerable);
    }

    return Array.from(keys);
  }

  private static addKeysFrom(
    obj: any,
    keys: Set<PropertyKey>,
    includeSymbols: boolean,
    includeNonEnumerable: boolean
  ): void {
    if (includeSymbols || includeNonEnumerable) {
      const allKeys = Reflect.ownKeys(obj);
      
      for (const key of allKeys) {
        if (!includeNonEnumerable) {
          const descriptor = Object.getOwnPropertyDescriptor(obj, key);
          if (descriptor && !descriptor.enumerable) {
            continue;
          }
        }

        if (!includeSymbols && typeof key === 'symbol') {
          continue;
        }

        keys.add(key);
      }
    } else {
      Object.keys(obj).forEach(key => keys.add(key));
    }
  }

  static getDescriptor(obj: any, key: PropertyKey): PropertyDescriptor | undefined {
    return Object.getOwnPropertyDescriptor(obj, key);
  }

  static defineProperty(obj: any, key: PropertyKey, descriptor: PropertyDescriptor): void {
    Object.defineProperty(obj, key, descriptor);
  }

  static copyProperty(source: any, dest: any, key: PropertyKey, transform?: (value: any) => any): void {
    const descriptor = this.getDescriptor(source, key);
    
    if (!descriptor) {
      return;
    }

    if (descriptor.get || descriptor.set) {
      this.defineProperty(dest, key, descriptor);
    } else {
      let value = descriptor.value;
      if (transform) {
        value = transform(value);
      }
      
      this.defineProperty(dest, key, {
        value,
        writable: descriptor.writable,
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable
      });
    }
  }

  static isWritable(obj: any, key: PropertyKey): boolean {
    const descriptor = this.getDescriptor(obj, key);
    return !descriptor || descriptor.writable !== false;
  }

  static isEnumerable(obj: any, key: PropertyKey): boolean {
    const descriptor = this.getDescriptor(obj, key);
    return !descriptor || descriptor.enumerable !== false;
  }
}

