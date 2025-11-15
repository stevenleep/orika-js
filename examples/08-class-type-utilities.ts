/**
 * Class 类型工具示例
 * 演示如何使用类型工具解决 Class 与对象字面量的兼容性问题
 */

import {
  MapTo,
  MapField,
  Transform,
  Default,
  createMappingFromDecorators,
  ClassProperties,
  ClassToInterface,
  ClassToType,
  asClass,
  toClassProperties,
  hasClassProperties,
  MockClass,
} from '../packages/core/src';

// ========== 示例 1: 使用 ClassProperties 类型 ==========

console.log('1️⃣  ClassProperties - 提取类的属性类型\n');

class User {
  id!: number;
  name!: string;
  email!: string;
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

class UserDTO {
  userId!: number;
  userName!: string;
  userEmail!: string;
}

@MapTo(UserDTO)
class UserModel {
  @MapField('userId')
  id!: number;
  
  @MapField('userName')
  name!: string;
  
  @MapField('userEmail')
  @Transform((v: string) => v.toLowerCase())
  email!: string;
}

// 方式 1: 使用 ClassProperties 类型（推荐）
const userData: ClassProperties<UserModel> = {
  id: 1,
  name: 'Alice',
  email: 'ALICE@EXAMPLE.COM'
};

const mapper = createMappingFromDecorators<UserModel, UserDTO>(UserModel);
const userDTO = mapper.map(asClass<UserModel>(userData));

console.log('输入数据:', userData);
console.log('映射结果:', userDTO);
console.log();

// ========== 示例 2: ClassToInterface vs ClassToType ==========

console.log('2️⃣  ClassToInterface & ClassToType\n');

class Product {
  id!: number;
  name!: string;
  price!: number;
  
  calculateTax() {
    return this.price * 0.1;
  }
}

// ClassToInterface - 只包含属性
type ProductInterface = ClassToInterface<Product>;
// 等同于: { id: number; name: string; price: number }

// ClassToType - 同样只包含属性
type ProductType = ClassToType<Product>;
// 等同于: { id: number; name: string; price: number }

const product1: ProductInterface = {
  id: 1,
  name: 'Laptop',
  price: 999
};

const product2: ProductType = {
  id: 2,
  name: 'Mouse',
  price: 29
};

console.log('ProductInterface:', product1);
console.log('ProductType:', product2);
console.log();

// ========== 示例 3: MockClass - 用于测试 ==========

console.log('3️⃣  MockClass - 创建测试数据\n');

class Order {
  orderId!: string;
  amount!: number;
  items!: string[];
  
  calculateTotal() {
    return this.amount * 1.1;
  }
}

class OrderDTO {
  id!: string;
  total!: number;
  itemCount!: number;
}

@MapTo(OrderDTO)
class OrderModel {
  @MapField('id')
  orderId!: string;
  
  @MapField('total')
  amount!: number;
  
  @MapField('itemCount')
  @Transform((_, source: OrderModel) => source.items.length)
  items!: string[];
}

// 使用 MockClass 创建测试数据
const mockOrder: MockClass<OrderModel> = {
  orderId: 'ORD-001',
  amount: 100,
  items: ['item1', 'item2', 'item3']
};

const orderMapper = createMappingFromDecorators<OrderModel, OrderDTO>(OrderModel);
const orderDTO = orderMapper.map(asClass<OrderModel>(mockOrder));

console.log('Mock Order:', mockOrder);
console.log('Order DTO:', orderDTO);
console.log();

// ========== 示例 4: toClassProperties - 从实例提取属性 ==========

console.log('4️⃣  toClassProperties - 提取实例属性\n');

class Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public age: number
  ) {}
  
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const person = new Person('John', 'Doe', 30);
console.log('Person 实例:', person);
console.log('Full name:', person.getFullName());

// 提取属性（排除方法）
const personProps = toClassProperties(person);
console.log('Person 属性:', personProps);
console.log('是否包含 getFullName:', 'getFullName' in personProps); // false
console.log();

// ========== 示例 5: hasClassProperties - 类型守卫 ==========

console.log('5️⃣  hasClassProperties - 运行时类型检查\n');

class Config {
  host!: string;
  port!: number;
  timeout!: number;
}

const validConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000
};

const invalidConfig = {
  host: 'localhost',
  // 缺少 port 和 timeout
};

console.log('检查有效配置:');
if (hasClassProperties<Config>(validConfig, ['host', 'port', 'timeout'])) {
  console.log('  ✓ 有效配置');
  const config = asClass<Config>(validConfig);
  console.log('  配置:', config);
} else {
  console.log('  ✗ 无效配置');
}

console.log('\n检查无效配置:');
if (hasClassProperties<Config>(invalidConfig, ['host', 'port', 'timeout'])) {
  console.log('  ✓ 有效配置');
} else {
  console.log('  ✗ 无效配置（缺少必需属性）');
}
console.log();

// ========== 示例 6: 实际场景 - API 响应映射 ==========

console.log('6️⃣  实际场景 - API 响应映射\n');

// API 响应类型
interface ApiResponse {
  user_id: number;
  user_name: string;
  user_email: string;
  created_at: string;
}

// 应用层模型
class UserProfileDTO {
  id!: number;
  name!: string;
  email!: string;
  createdAt!: Date;
}

@MapTo(UserProfileDTO)
class UserProfile {
  @MapField('id')
  user_id!: number;
  
  @MapField('name')
  user_name!: string;
  
  @MapField('email')
  user_email!: string;
  
  @MapField('createdAt')
  @Transform((v: string) => new Date(v))
  created_at!: string;
}

// 模拟 API 响应
const apiResponse: ApiResponse = {
  user_id: 1,
  user_name: 'Bob Smith',
  user_email: 'bob@example.com',
  created_at: '2024-01-15T10:30:00Z'
};

// 使用类型工具进行映射
const profileMapper = createMappingFromDecorators<UserProfile, UserProfileDTO>(UserProfile);

// 将 API 响应转换为模型类型
const profileData: MockClass<UserProfile> = {
  user_id: apiResponse.user_id,
  user_name: apiResponse.user_name,
  user_email: apiResponse.user_email,
  created_at: apiResponse.created_at
};

const profile = profileMapper.map(asClass<UserProfile>(profileData));

console.log('API 响应:', apiResponse);
console.log('映射后的 DTO:', profile);
console.log('日期类型:', profile.createdAt instanceof Date ? 'Date' : typeof profile.createdAt);
console.log();

console.log('✅ 所有类型工具示例完成！\n');

// ========== 类型工具总结 ==========
console.log('📚 类型工具总结:');
console.log('├─ ClassProperties<T>      - 提取类的属性（排除方法）');
console.log('├─ ClassToInterface<T>     - 转换为接口风格');
console.log('├─ ClassToType<T>          - 转换为类型别名');
console.log('├─ MockClass<T>            - 创建测试数据类型');
console.log('├─ asClass<T>(obj)         - 安全转换为类类型');
console.log('├─ toClassProperties(obj)  - 从实例提取属性');
console.log('└─ hasClassProperties(obj) - 运行时类型检查');

