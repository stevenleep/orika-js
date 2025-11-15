/**
 * Class 类型工具
 * 用于将 Class 类型转换为 Interface 或 Type，解决对象字面量与 class 的兼容性问题
 */

/**
 * 提取函数类型
 */
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

/**
 * 提取非函数类型（属性）
 */
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

/**
 * 将 Class 转换为类型，可通过泛型参数控制是否包含方法
 * 
 * @template T - 类类型
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class User {
 *   id: number;
 *   name: string;
 *   greet() { return 'hello'; }
 * }
 * 
 * // 只包含属性（默认）
 * type UserProps = ClassProperties<User>;
 * // { id: number; name: string }
 * 
 * // 包含方法
 * type UserWithMethods = ClassProperties<User, true>;
 * // { id: number; name: string; greet: () => string }
 * 
 * const user1: UserProps = { id: 1, name: 'Alice' }; // ✓ OK
 * const user2: UserWithMethods = { 
 *   id: 1, 
 *   name: 'Alice',
 *   greet: () => 'hello'
 * }; // ✓ OK
 * ```
 */
export type ClassProperties<T, IncludeMethods extends boolean = false> = 
  IncludeMethods extends true 
    ? T 
    : Pick<T, NonFunctionPropertyNames<T>>;

/**
 * 将 Class 转换为 Interface 风格的类型
 * 
 * @template T - 类类型
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class User {
 *   id: number;
 *   name: string;
 *   private secret: string;
 *   greet() { return 'hello'; }
 * }
 * 
 * // 只包含属性
 * type UserInterface = ClassToInterface<User>;
 * // { id: number; name: string }
 * 
 * // 包含方法
 * type UserWithMethods = ClassToInterface<User, true>;
 * // { id: number; name: string; greet: () => string }
 * ```
 */
export type ClassToInterface<T, IncludeMethods extends boolean = false> = 
  IncludeMethods extends true 
    ? { [K in keyof T]: T[K] }
    : { [K in NonFunctionPropertyNames<T>]: T[K] };

/**
 * 将 Class 转换为 Type
 * 
 * @template T - 类类型
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class Product {
 *   id: number;
 *   name: string;
 *   price: number;
 *   calculate() { return this.price * 1.1; }
 * }
 * 
 * // 只包含属性
 * type ProductType = ClassToType<Product>;
 * // { id: number; name: string; price: number }
 * 
 * // 包含方法
 * type ProductWithMethods = ClassToType<Product, true>;
 * // { id: number; name: string; price: number; calculate: () => number }
 * 
 * const product: ProductType = {
 *   id: 1,
 *   name: 'Laptop',
 *   price: 999
 * }; // ✓ OK
 * ```
 */
export type ClassToType<T, IncludeMethods extends boolean = false> = ClassProperties<T, IncludeMethods>;

/**
 * 提取 Class 构造函数的实例类型
 * 
 * @template T - 类构造函数类型
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class Order {
 *   orderId: string;
 *   amount: number;
 *   process() { }
 * }
 * 
 * // 只包含属性
 * type OrderInstance = ClassInstance<typeof Order>;
 * // { orderId: string; amount: number }
 * 
 * // 包含方法
 * type OrderWithMethods = ClassInstance<typeof Order, true>;
 * // { orderId: string; amount: number; process: () => void }
 * 
 * const order: OrderInstance = {
 *   orderId: 'ORD-001',
 *   amount: 100
 * }; // ✓ OK
 * ```
 */
export type ClassInstance<
  T extends new (...args: any[]) => any, 
  IncludeMethods extends boolean = false
> = ClassProperties<InstanceType<T>, IncludeMethods>;

/**
 * 从 Class 中排除指定的属性
 * 
 * @template T - 类类型
 * @template K - 要排除的键
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class User {
 *   id: number;
 *   name: string;
 *   password: string;
 *   email: string;
 * }
 * 
 * type PublicUser = OmitClassProperties<User, 'password'>;
 * // { id: number; name: string; email: string }
 * ```
 */
export type OmitClassProperties<
  T, 
  K extends keyof ClassProperties<T, false>,
  IncludeMethods extends boolean = false
> = Omit<ClassProperties<T, IncludeMethods>, K>;

/**
 * 从 Class 中选择指定的属性
 * 
 * @template T - 类类型
 * @template K - 要选择的键
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class User {
 *   id: number;
 *   name: string;
 *   password: string;
 *   email: string;
 *   login() { }
 * }
 * 
 * type UserBasic = PickClassProperties<User, 'id' | 'name'>;
 * // { id: number; name: string }
 * ```
 */
export type PickClassProperties<
  T, 
  K extends keyof ClassProperties<T, false>,
  IncludeMethods extends boolean = false
> = Pick<ClassProperties<T, IncludeMethods>, K>;

/**
 * 将 Class 的所有属性变为可选
 * 
 * @template T - 类类型
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class Config {
 *   host: string;
 *   port: number;
 *   timeout: number;
 * }
 * 
 * type PartialConfig = PartialClass<Config>;
 * // { host?: string; port?: number; timeout?: number }
 * ```
 */
export type PartialClass<T, IncludeMethods extends boolean = false> = 
  Partial<ClassProperties<T, IncludeMethods>>;

/**
 * 将 Class 的所有属性变为必需
 * 
 * @template T - 类类型
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class Draft {
 *   title?: string;
 *   content?: string;
 * }
 * 
 * type PublishedDraft = RequiredClass<Draft>;
 * // { title: string; content: string }
 * ```
 */
export type RequiredClass<T, IncludeMethods extends boolean = false> = 
  Required<ClassProperties<T, IncludeMethods>>;

/**
 * 将 Class 的所有属性变为只读
 * 
 * @template T - 类类型
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class Entity {
 *   id: number;
 *   createdAt: Date;
 * }
 * 
 * type ImmutableEntity = ReadonlyClass<Entity>;
 * // { readonly id: number; readonly createdAt: Date }
 * ```
 */
export type ReadonlyClass<T, IncludeMethods extends boolean = false> = 
  Readonly<ClassProperties<T, IncludeMethods>>;

/**
 * 提取 Class 中指定类型的属性
 * 
 * @example
 * ```typescript
 * class Mixed {
 *   id: number;
 *   name: string;
 *   count: number;
 *   active: boolean;
 * }
 * 
 * type NumberProps = ClassPropertiesOfType<Mixed, number>;
 * // { id: number; count: number }
 * ```
 */
export type ClassPropertiesOfType<T, ValueType> = {
  [K in NonFunctionPropertyNames<T> as T[K] extends ValueType ? K : never]: T[K];
};

/**
 * 创建一个与 Class 属性兼容的普通对象类型
 * 用于测试和模拟数据
 * 
 * @template T - 类类型
 * @template IncludeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class User {
 *   id: number;
 *   name: string;
 *   login() { }
 * }
 * 
 * // 在测试中创建 mock 数据（只包含属性）
 * const mockUser: MockClass<User> = {
 *   id: 1,
 *   name: 'Test User'
 * };
 * 
 * // 包含方法的 mock
 * const mockUserWithMethods: MockClass<User, true> = {
 *   id: 1,
 *   name: 'Test User',
 *   login: () => { console.log('logged in'); }
 * };
 * 
 * // 可以直接赋值给 User 类型（需要类型断言）
 * const user = mockUser as unknown as User;
 * ```
 */
export type MockClass<T, IncludeMethods extends boolean = false> = ClassProperties<T, IncludeMethods>;

/**
 * 辅助函数：将对象字面量安全地转换为 Class 类型
 * 
 * @template T - 目标类类型
 * @param obj - 源对象
 * 
 * @example
 * ```typescript
 * class Product {
 *   id: number;
 *   name: string;
 * }
 * 
 * const data = { id: 1, name: 'Laptop' };
 * const product = asClass<Product>(data);
 * // product 的类型是 Product
 * ```
 */
export function asClass<T>(obj: ClassProperties<T, false>): T {
  return obj as unknown as T;
}

/**
 * 辅助函数：从 Class 实例中提取属性对象
 * 
 * @template T - 类类型
 * @template IncludeMethods - 是否包含方法
 * @param instance - 类实例
 * @param includeMethods - 是否包含方法，默认为 false
 * 
 * @example
 * ```typescript
 * class User {
 *   id: number;
 *   name: string;
 *   
 *   constructor(id: number, name: string) {
 *     this.id = id;
 *     this.name = name;
 *   }
 *   
 *   greet() { return `Hello, ${this.name}`; }
 * }
 * 
 * const user = new User(1, 'Alice');
 * 
 * // 只提取属性
 * const props = toClassProperties(user);
 * // props: { id: 1, name: 'Alice' }
 * 
 * // 包含方法
 * const full = toClassProperties(user, true);
 * // full: { id: 1, name: 'Alice', greet: [Function] }
 * ```
 */
export function toClassProperties<T extends object>(
  instance: T, 
  includeMethods: boolean = false
): ClassProperties<T, false> | T {
  if (includeMethods) {
    return instance;
  }
  
  const props: any = {};
  
  for (const key in instance) {
    if (instance.hasOwnProperty(key) && typeof instance[key] !== 'function') {
      props[key] = instance[key];
    }
  }
  
  return props as ClassProperties<T, false>;
}

/**
 * 类型守卫：检查对象是否具有 Class 的所有必需属性
 * 
 * @template T - 类类型
 * @param obj - 要检查的对象
 * @param requiredKeys - 必需的属性键
 * @param checkMethods - 是否检查方法，默认为 false
 * 
 * @example
 * ```typescript
 * class User {
 *   id: number;
 *   name: string;
 *   greet() { }
 * }
 * 
 * const data = { id: 1, name: 'Alice' };
 * if (hasClassProperties<User>(data, ['id', 'name'])) {
 *   // data 在这里被识别为具有 User 的属性
 *   const user = asClass<User>(data);
 * }
 * 
 * // 检查方法
 * const dataWithMethod = { id: 1, name: 'Alice', greet: () => {} };
 * if (hasClassProperties<User>(dataWithMethod, ['id', 'name', 'greet'], true)) {
 *   // 包含所有属性和方法
 * }
 * ```
 */
export function hasClassProperties<T>(
  obj: any,
  requiredKeys: (keyof ClassProperties<T, false>)[],
  checkMethods: boolean = false
): obj is ClassProperties<T, false> {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  
  return requiredKeys.every(key => {
    if (!(key in obj)) {
      return false;
    }
    
    // 如果不检查方法，则跳过函数类型的检查
    if (!checkMethods && typeof obj[key] === 'function') {
      return false;
    }
    
    return true;
  });
}

