/**
 * 演示如何通过类型参数控制是否包含类的方法
 */

import {
  ClassProperties,
  ClassToInterface,
  ClassToType,
  MockClass,
  toClassProperties,
} from '../packages/core/src';

async function demonstrateClassWithMethods() {
  // ========== 示例 1: ClassProperties 控制是否包含方法 ==========

  console.log('1️⃣  ClassProperties 控制方法包含\n');

class Calculator {
  value: number;
  
  constructor(value: number) {
    this.value = value;
  }
  
  add(n: number): number {
    return this.value + n;
  }
  
  multiply(n: number): number {
    return this.value * n;
  }
}

// 只包含属性（默认行为）
type CalculatorProps = ClassProperties<Calculator>;
// 类型: { value: number }

const calc1: CalculatorProps = {
  value: 10
};

console.log('只包含属性:', calc1);

// 包含方法
type CalculatorFull = ClassProperties<Calculator, true>;
// 类型: { value: number; add: (n: number) => number; multiply: (n: number) => number }

const calc2: CalculatorFull = {
  value: 10,
  add: (n: number) => calc2.value + n,
  multiply: (n: number) => calc2.value * n
};

console.log('包含方法:', calc2);
console.log('调用方法 add(5):', calc2.add(5));
console.log('调用方法 multiply(3):', calc2.multiply(3));
console.log();

// ========== 示例 2: 实际使用场景 - Service 类 ==========

console.log('2️⃣  实际场景 - Service 类\n');

class UserService {
  apiUrl: string;
  timeout: number;
  
  constructor(apiUrl: string, timeout: number) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
  }
  
  async fetchUser(id: number): Promise<any> {
    console.log(`Fetching user ${id} from ${this.apiUrl}`);
    return { id, name: 'John Doe' };
  }
  
  async updateUser(id: number, data: any): Promise<void> {
    console.log(`Updating user ${id} at ${this.apiUrl}`, data);
  }
}

// 场景 1: 配置对象（只需要属性）
type ServiceConfig = ClassProperties<UserService>;
// { apiUrl: string; timeout: number }

const config: ServiceConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

console.log('Service 配置:', config);

// 场景 2: Mock Service（需要包含方法）
type MockService = ClassProperties<UserService, true>;

const mockService: MockService = {
  apiUrl: 'https://mock.example.com',
  timeout: 1000,
  fetchUser: async (id: number) => {
    console.log(`[Mock] Fetching user ${id}`);
    return { id, name: 'Mock User' };
  },
  updateUser: async (id: number, data: any) => {
    console.log(`[Mock] Updating user ${id}`, data);
  }
};

console.log('\nMock Service:');
await mockService.fetchUser(1);
await mockService.updateUser(1, { name: 'New Name' });

// ========== 示例 3: toClassProperties 函数 ==========

console.log('3️⃣  toClassProperties 函数\n');

class Product {
  id: number;
  name: string;
  price: number;
  
  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
  
  calculateTax(): number {
    return this.price * 0.1;
  }
  
  getDisplayPrice(): string {
    return `$${this.price.toFixed(2)}`;
  }
}

const product = new Product(1, 'Laptop', 999);

// 只提取属性
const productProps = toClassProperties(product);
console.log('产品属性:', productProps);
console.log('包含方法?', 'calculateTax' in productProps); // false

// 包含方法
const productFull = toClassProperties(product, true);
console.log('\n完整产品对象:', productFull);
console.log('包含方法?', 'calculateTax' in productFull); // true
if ('calculateTax' in productFull) {
  console.log('计算税额:', (productFull as any).calculateTax());
}
console.log();

// ========== 示例 4: 接口风格 vs 完整类型 ==========

console.log('4️⃣  接口风格 vs 完整类型\n');

class DataStore {
  data: Map<string, any>;
  
  constructor() {
    this.data = new Map();
  }
  
  get(key: string): any {
    return this.data.get(key);
  }
  
  set(key: string, value: any): void {
    this.data.set(key, value);
  }
  
  has(key: string): boolean {
    return this.data.has(key);
  }
}

// 接口风格（只有数据）
type DataStoreInterface = ClassToInterface<DataStore>;
// { data: Map<string, any> }

const storeData: DataStoreInterface = {
  data: new Map([['key1', 'value1']])
};

console.log('数据存储（接口风格）:', {
  dataSize: storeData.data.size,
  hasKey1: storeData.data.has('key1')
});

// 完整类型（包含方法）
type DataStoreFull = ClassToInterface<DataStore, true>;
// { data: Map<string, any>; get: ...; set: ...; has: ... }

const storeFull: DataStoreFull = {
  data: new Map(),
  get(key: string) {
    return this.data.get(key);
  },
  set(key: string, value: any) {
    this.data.set(key, value);
  },
  has(key: string) {
    return this.data.has(key);
  }
};

console.log('\n数据存储（完整类型）:');
storeFull.set('name', 'Alice');
console.log('  设置 name = Alice');
console.log('  获取 name:', storeFull.get('name'));
console.log('  是否存在 name:', storeFull.has('name'));
console.log();

// ========== 示例 5: MockClass 用于测试 ==========

console.log('5️⃣  MockClass 用于测试\n');

class ApiClient {
  baseUrl: string;
  headers: Record<string, string>;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.headers = {};
  }
  
  async request(endpoint: string, options?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Request: ${url}`);
    return { data: 'real response' };
  }
  
  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }
}

// 测试场景 1: 只需要配置数据
type ApiConfig = MockClass<ApiClient>;
const apiConfig: ApiConfig = {
  baseUrl: 'https://api.test.com',
  headers: { 'Authorization': 'Bearer token' }
};

console.log('API 配置:', apiConfig);

// 测试场景 2: 需要完整的 mock（包含方法）
type MockApiClient = MockClass<ApiClient, true>;
const mockClient: MockApiClient = {
  baseUrl: 'https://mock.api.com',
  headers: {},
  request: async (endpoint: string) => {
    console.log(`[Mock] Request to: ${endpoint}`);
    return { data: 'mock response' };
  },
  setHeader: (key: string, value: string) => {
    console.log(`[Mock] Setting header: ${key} = ${value}`);
  }
};

console.log('\nMock API Client:');
await mockClient.request('/users/1');
mockClient.setHeader('Content-Type', 'application/json');

// ========== 总结 ==========

console.log('✅ 类型工具总结:\n');
console.log('📌 默认行为（IncludeMethods = false）：');
console.log('   ├─ 只包含属性，适合配置、数据传输');
console.log('   └─ 示例: ClassProperties<T>, MockClass<T>\n');

console.log('📌 包含方法（IncludeMethods = true）：');
console.log('   ├─ 包含属性和方法，适合 mock、代理');
console.log('   └─ 示例: ClassProperties<T, true>, MockClass<T, true>\n');

console.log('📌 使用场景：');
console.log('   ├─ 只要属性: 配置对象、DTO、序列化');
console.log('   └─ 包含方法: Mock 对象、测试替身、代理模式\n');
}

// 运行示例
demonstrateClassWithMethods().catch(console.error);

