export interface DecoratorMappingMetadata {
  targetClass?: any;
  excludedFields?: Set<string>;
  fieldMappings?: Map<string, FieldDecoratorMetadata>;
  nestedMappings?: Map<string, any>; // class constructor for nested mapping
  beforeMapping?: (source: any) => void | Promise<void>;
  afterMapping?: (source: any, destination: any) => void | Promise<void>;
}

export interface FieldDecoratorMetadata {
  source?: string;
  destination: string;
  transformer?: (value: any, source?: any) => any;
  asyncTransformer?: (value: any, source?: any) => Promise<any>;
  exclude?: boolean;
  ignoreNull?: boolean;
  ignoreUndefined?: boolean;
  condition?: (source: any) => boolean;
  defaultValue?: any;
  defaultFactory?: () => any;
  converter?: string; // converter name
  format?: string | ((value: any) => any);
  nested?: boolean;
  nestedClass?: any;
}

const metadataStore = new Map<any, DecoratorMappingMetadata>();

export class MetadataStorage {
  static getMappingMetadata(target: any): DecoratorMappingMetadata {
    if (!metadataStore.has(target)) {
      metadataStore.set(target, {
        excludedFields: new Set(),
        fieldMappings: new Map(),
      });
    }
    return metadataStore.get(target)!;
  }

  static setTargetClass(sourceClass: any, targetClass: any): void {
    const metadata = this.getMappingMetadata(sourceClass);
    metadata.targetClass = targetClass;
  }

  static addFieldMapping(target: any, propertyKey: string, config: FieldDecoratorMetadata): void {
    const metadata = this.getMappingMetadata(target);
    metadata.fieldMappings!.set(propertyKey, config);
  }

  static addExcludedField(target: any, propertyKey: string): void {
    const metadata = this.getMappingMetadata(target);
    metadata.excludedFields!.add(propertyKey);
  }
}

