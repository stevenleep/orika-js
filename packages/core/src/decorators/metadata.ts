export interface DecoratorMappingMetadata {
  targetClass?: any;
  excludedFields?: Set<string>;
  fieldMappings?: Map<string, FieldDecoratorMetadata>;
}

export interface FieldDecoratorMetadata {
  source?: string;
  destination: string;
  transformer?: (value: any) => any;
  exclude?: boolean;
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

