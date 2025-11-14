import { Converter, AsyncConverter } from '../types';

export abstract class AbstractConverter<S = any, D = any> implements Converter<S, D> {
  abstract canConvert(sourceType: any, destinationType: any): boolean;
  abstract convert(source: S, destinationType?: new (...args: any[]) => D): D;
}

export abstract class AbstractAsyncConverter<S = any, D = any> implements AsyncConverter<S, D> {
  abstract canConvert(sourceType: any, destinationType: any): boolean;
  abstract convertAsync(source: S, destinationType?: new (...args: any[]) => D): Promise<D>;
}

export class FunctionConverter<S = any, D = any> extends AbstractConverter<S, D> {
  constructor(
    private converterFn: (source: S) => D,
    private canConvertFn: (sourceType: any, destinationType: any) => boolean = () => true
  ) {
    super();
  }

  canConvert(sourceType: any, destinationType: any): boolean {
    return this.canConvertFn(sourceType, destinationType);
  }

  convert(source: S): D {
    return this.converterFn(source);
  }
}

export class AsyncFunctionConverter<S = any, D = any> extends AbstractAsyncConverter<S, D> {
  constructor(
    private converterFn: (source: S) => Promise<D>,
    private canConvertFn: (sourceType: any, destinationType: any) => boolean = () => true
  ) {
    super();
  }

  canConvert(sourceType: any, destinationType: any): boolean {
    return this.canConvertFn(sourceType, destinationType);
  }

  async convertAsync(source: S): Promise<D> {
    return await this.converterFn(source);
  }
}

export class TypeConverter extends AbstractConverter {
  constructor(
    private sourceTypeName: string,
    private destTypeName: string,
    private converterFn: (value: any) => any
  ) {
    super();
  }

  canConvert(sourceType: any, destinationType: any): boolean {
    const sourceTypeName = typeof sourceType === 'string' ? sourceType : sourceType?.name;
    const destTypeName = typeof destinationType === 'string' ? destinationType : destinationType?.name;
    
    return sourceTypeName === this.sourceTypeName && destTypeName === this.destTypeName;
  }

  convert(source: any): any {
    return this.converterFn(source);
  }
}

