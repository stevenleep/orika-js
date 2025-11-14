import { TypeConverter, AbstractConverter } from './Converter';
import { TypeUtils } from '../utils/TypeUtils';
export const StringToNumberConverter = new TypeConverter(
  'String',
  'Number',
  (value: string) => {
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`Cannot convert "${value}" to number`);
    }
    return num;
  }
);

export const NumberToStringConverter = new TypeConverter(
  'Number',
  'String',
  (value: number) => String(value)
);
export const StringToBooleanConverter = new TypeConverter(
  'String',
  'Boolean',
  (value: string) => {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes') return true;
    if (lower === 'false' || lower === '0' || lower === 'no') return false;
    throw new Error(`Cannot convert "${value}" to boolean`);
  }
);

export const StringToDateConverter = new TypeConverter(
  'String',
  'Date',
  (value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Cannot convert "${value}" to Date`);
    }
    return date;
  }
);

export const DateToStringConverter = new TypeConverter(
  'Date',
  'String',
  (value: Date) => value.toISOString()
);

export const DateToNumberConverter = new TypeConverter(
  'Date',
  'Number',
  (value: Date) => value.getTime()
);

export const NumberToDateConverter = new TypeConverter(
  'Number',
  'Date',
  (value: number) => new Date(value)
);
export class ArrayConverter extends AbstractConverter {
  constructor(private itemConverter?: (item: any) => any) {
    super();
  }

  canConvert(sourceType: any, _destinationType: any): boolean {
    return TypeUtils.isArray(sourceType) || sourceType === Array;
  }

  convert(source: any[]): any[] {
    if (!Array.isArray(source)) {
      throw new Error('Source must be an array');
    }
    
    if (this.itemConverter) {
      return source.map(item => this.itemConverter!(item));
    }
    
    return [...source];
  }
}

export class MapConverter extends AbstractConverter {
  canConvert(sourceType: any, _destinationType: any): boolean {
    return TypeUtils.isMap(sourceType) || sourceType === Map;
  }

  convert(source: Map<any, any>): Map<any, any> {
    if (!(source instanceof Map)) {
      throw new Error('Source must be a Map');
    }
    return new Map(source);
  }
}

export class SetConverter extends AbstractConverter {
  canConvert(sourceType: any, _destinationType: any): boolean {
    return TypeUtils.isSet(sourceType) || sourceType === Set;
  }

  convert(source: Set<any>): Set<any> {
    if (!(source instanceof Set)) {
      throw new Error('Source must be a Set');
    }
    return new Set(source);
  }
}
export function getBuiltInConverters(): AbstractConverter[] {
  return [
    StringToNumberConverter,
    NumberToStringConverter,
    StringToBooleanConverter,
    StringToDateConverter,
    DateToStringConverter,
    DateToNumberConverter,
    NumberToDateConverter,
    new MapConverter(),
    new SetConverter(),
  ];
}

