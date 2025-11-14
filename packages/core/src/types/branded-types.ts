export type Brand<T, B extends string> = T & { readonly __brand: B };

export type Email = Brand<string, 'Email'>;

export type Url = Brand<string, 'Url'>;

export type UUID = Brand<string, 'UUID'>;

export type PositiveNumber = Brand<number, 'Positive'>;

export type NonEmptyString = Brand<string, 'NonEmpty'>;

export const BrandedTypeValidators = {
  isEmail(value: string): value is Email {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  isUrl(value: string): value is Url {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  isUUID(value: string): value is UUID {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  },

  isPositive(value: number): value is PositiveNumber {
    return value > 0;
  },

  isNonEmptyString(value: string): value is NonEmptyString {
    return value.length > 0;
  },

  email(value: string): Email {
    if (!this.isEmail(value)) {
      throw new TypeError(`Invalid email: ${value}`);
    }
    return value as Email;
  },

  url(value: string): Url {
    if (!this.isUrl(value)) {
      throw new TypeError(`Invalid URL: ${value}`);
    }
    return value as Url;
  },

  uuid(value: string): UUID {
    if (!this.isUUID(value)) {
      throw new TypeError(`Invalid UUID: ${value}`);
    }
    return value as UUID;
  },

  positive(value: number): PositiveNumber {
    if (!this.isPositive(value)) {
      throw new TypeError(`Number must be positive: ${value}`);
    }
    return value as PositiveNumber;
  },

  nonEmpty(value: string): NonEmptyString {
    if (!this.isNonEmptyString(value)) {
      throw new TypeError('String must not be empty');
    }
    return value as NonEmptyString;
  },
};

