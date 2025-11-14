export class TypeUtils {
  static isPrimitive(value: any): boolean {
    return (
      value === null ||
      value === undefined ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      typeof value === 'symbol' ||
      typeof value === 'bigint'
    );
  }

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  static isPlainObject(value: any): boolean {
    if (value === null || typeof value !== 'object') {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
  }

  static isDate(value: any): boolean {
    return value instanceof Date;
  }

  static isMap(value: any): boolean {
    return value instanceof Map;
  }

  static isSet(value: any): boolean {
    return value instanceof Set;
  }

  static isWeakMap(value: any): boolean {
    return value instanceof WeakMap;
  }

  static isWeakSet(value: any): boolean {
    return value instanceof WeakSet;
  }

  static isCollection(value: any): boolean {
    return this.isMap(value) || this.isSet(value);
  }

  static isClassInstance(value: any): boolean {
    if (this.isPrimitive(value) || this.isArray(value) || this.isDate(value)) {
      return false;
    }
    return typeof value === 'object' && value.constructor !== Object;
  }

  static getClassName(value: any): string {
    if (value === null || value === undefined) {
      return 'Unknown';
    }
    if (typeof value === 'function') {
      return value.name || 'Anonymous';
    }
    return value.constructor?.name || 'Unknown';
  }

  static getMappingKey(sourceClass: any, destinationClass: any): string {
    const sourceName = this.getClassName(sourceClass);
    const destName = this.getClassName(destinationClass);
    return `${sourceName}→${destName}`;
  }

  static deepClone<T>(value: T): T {
    if (this.isPrimitive(value)) return value;
    if (this.isDate(value)) return new Date((value as any).getTime()) as any;
    if (this.isArray(value)) return (value as any).map((item: any) => this.deepClone(item));
    if (this.isPlainObject(value)) {
      const cloned: any = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          cloned[key] = this.deepClone((value as any)[key]);
        }
      }
      return cloned;
    }
    return value;
  }

  static getAllFields(obj: any): string[] {
    const fields = new Set<string>();
    let current = obj;
    
    while (current && current !== Object.prototype) {
      Object.getPrototypeOf(current).forEach((prop: string) => {
        if (prop !== 'constructor') {
          fields.add(prop);
        }
      });
      current = Object.getPrototypeOf(current);
    }
    
    return Array.from(fields);
  }
}

