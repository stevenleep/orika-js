/**
 * 高级装饰器示例
 * 展示增强的装饰器语法和功能
 * 
 * 注意：关于 Class 与对象字面量的类型兼容性
 * ==========================================
 * 
 * 在示例中，我们使用 class 定义模型（如 Product, UserProfile 等），
 * 但在测试时使用对象字面量创建实例。这会导致 TypeScript 类型不兼容，
 * 因为 class 定义可能包含方法、私有字段等，而对象字面量只有数据属性。
 * 
 * 解决方案：
 * 1. 使用 `as unknown as ClassName` 双重断言（本示例使用的方法）
 * 2. 使用 `new ClassName()` 创建真实的类实例
 * 3. 定义 interface 而不是 class（如果不需要类的特性）
 * 4. 使用 `Partial<ClassName>` 类型（如果允许部分属性）
 * 
 * 示例代码中统一使用 `as unknown as ClassName` 是为了简化演示，
 * 在实际项目中，建议根据具体情况选择合适的方案。
 */

import {
  MapTo,
  MapField,
  MapFrom,
  Exclude,
  Transform,
  TransformAsync,
  ConvertWith,
  Format,
  IgnoreNull,
  IgnoreUndefined,
  IgnoreNullish,
  MapWhen,
  Default,
  DefaultFactory,
  Nested,
  BeforeMapping,
  AfterMapping,
  createMappingFromDecorators,
} from '../packages/core/src/decorators';

// ========== 示例 1: MapField 支持完整选项 ==========

class ProductDTO {
  id!: number;
  name!: string;
  price!: number;
  description!: string | null;
  createdAt!: string;
  status!: string;
}

@MapTo(ProductDTO)
class Product {
  id!: number;
  
  // 简单的字段映射
  @MapField('name')
  productName!: string;
  
  // 使用完整选项的字段映射
  @MapField({
    destination: 'price',
    transformer: (value) => Math.round(value * 100) / 100, // 保留两位小数
    ignoreNull: true,
  })
  originalPrice!: number;
  
  @MapField({
    destination: 'description',
    defaultValue: 'No description available',
  })
  desc?: string;
  
  @MapField({
    destination: 'createdAt',
    transformer: (value: Date) => value.toISOString(),
  })
  created!: Date;
  
  @MapField({
    destination: 'status',
    condition: (source: Product) => source.originalPrice > 0,
    defaultValue: 'unavailable',
  })
  isAvailable!: boolean;
}

// ========== 示例 2: 各种转换装饰器 ==========

class UserProfileDTO {
  userId!: number;
  fullName!: string;
  email!: string;
  age!: number;
  bio!: string;
  registeredDate!: string;
  score!: string;
}

@MapTo(UserProfileDTO)
class UserProfile {
  @MapField('userId')
  id!: number;
  
  // 使用 Transform 装饰器
  @MapField('fullName')
  @Transform((value, source) => `${source.firstName} ${source.lastName}`)
  firstName!: string;
  
  lastName!: string;
  
  // 使用 Format 装饰器格式化
  @MapField('email')
  @Format('lowercase')
  Email!: string;
  
  @MapField('age')
  @Default(18)
  userAge?: number;
  
  // 使用 IgnoreNull 装饰器
  @MapField('bio')
  @IgnoreNull()
  @Default('No bio provided')
  biography?: string | null;
  
  // 使用 Format 装饰器格式化日期
  @MapField('registeredDate')
  @Format('iso')
  registeredAt!: Date;
  
  // 使用 Format 装饰器格式化数字
  @MapField('score')
  @Format('percentage')
  scoreValue!: number;
}

// ========== 示例 3: 条件映射和默认值 ==========

class OrderDTO {
  orderId!: string;
  totalAmount!: number;
  status!: string;
  discount!: number;
  createdDate!: string;
}

@MapTo(OrderDTO)
class Order {
  @MapField('orderId')
  id!: string;
  
  @MapField('totalAmount')
  @IgnoreNullish()
  @Default(0)
  amount?: number;
  
  // 条件映射：只有当订单已支付时才映射状态
  @MapField('status')
  @MapWhen((source: Order) => source.isPaid === true)
  @Default('pending')
  isPaid!: boolean;
  
  // 使用工厂函数生成默认值
  @MapField('discount')
  @DefaultFactory(() => Math.random() * 10)
  discountRate?: number;
  
  // 格式化日期
  @MapField('createdDate')
  @Format((date: Date) => date.toISOString())
  createdAt!: Date;
}

// ========== 示例 4: MapFrom 反向映射 ==========

class PersonDTO {
  firstName!: string;
  lastName!: string;
  fullName!: string;
}

@MapTo(PersonDTO)
class Person {
  @MapField('firstName')
  first!: string;
  
  @MapField('lastName')
  last!: string;
  
  // 从多个源字段计算
  @MapFrom('first')
  @Transform((_, source: Person) => `${source.first} ${source.last}`)
  @MapField('fullName')
  name!: string;
}

// ========== 示例 5: 嵌套对象映射 ==========

class AddressDTO {
  street!: string;
  city!: string;
  country!: string;
}

@MapTo(AddressDTO)
class Address {
  @MapField('street')
  streetName!: string;
  
  @MapField('city')
  cityName!: string;
  
  @MapField('country')
  countryName!: string;
}

class CustomerDTO {
  customerId!: number;
  name!: string;
  primaryAddress!: AddressDTO;
}

@MapTo(CustomerDTO)
class Customer {
  @MapField('customerId')
  id!: number;
  
  @MapField('name')
  customerName!: string;
  
  // 嵌套对象映射
  @MapField('primaryAddress')
  @Nested(AddressDTO)
  address!: Address;
}

// ========== 示例 6: 排除和忽略 ==========

class UserSecureDTO {
  username!: string;
  email!: string;
  displayName!: string;
}

@MapTo(UserSecureDTO)
class UserSecure {
  @MapField('username')
  userName!: string;
  
  @MapField('email')
  userEmail!: string;
  
  // 排除敏感字段
  @Exclude()
  password!: string;
  
  @Exclude()
  secretToken!: string;
  
  @MapField('displayName')
  @IgnoreUndefined()
  @Default('Anonymous')
  name?: string;
}

// ========== 示例 7: 生命周期钩子（类级别装饰器）==========

class ArticleDTO {
  title!: string;
  content!: string;
  publishedAt!: string;
  slug!: string;
}

@MapTo(ArticleDTO)
@BeforeMapping((source: Article) => {
  console.log('Before mapping article:', source.title);
  // 可以在这里做一些预处理
})
@AfterMapping((source: Article, dest: ArticleDTO) => {
  console.log('After mapping article:', dest.title);
  // 可以在这里做一些后处理
})
class Article {
  @MapField('title')
  articleTitle!: string;
  
  @MapField('content')
  articleContent!: string;
  
  @MapField('publishedAt')
  @Format('iso')
  publishDate!: Date;
  
  @MapField('slug')
  @Transform((value, source: Article) => 
    source.articleTitle.toLowerCase().replace(/\s+/g, '-')
  )
  title!: string;
}

// ========== 示例 8: 组合多个装饰器 ==========

class EventDTO {
  eventId!: string;
  title!: string;
  description!: string;
  startTime!: string;
  endTime!: string;
  attendeeCount!: number;
  isPublic!: boolean;
}

@MapTo(EventDTO)
class Event {
  @MapField('eventId')
  id!: string;
  
  @MapField('title')
  @Format('capitalize')
  @Transform((value) => value.trim())
  eventTitle!: string;
  
  @MapField('description')
  @IgnoreNullish()
  @Default('No description')
  @Format('trim')
  desc?: string;
  
  @MapField('startTime')
  @Format('iso')
  start!: Date;
  
  @MapField('endTime')
  @Format('iso')
  end!: Date;
  
  @MapField('attendeeCount')
  @Default(0)
  @Transform((value) => Math.max(0, value))
  attendees!: number;
  
  @MapField('isPublic')
  @MapWhen((source: Event) => source.attendees >= 0)
  @Default(false)
  publicEvent!: boolean;
}

// ========== 使用示例 ==========

async function demonstrateAdvancedDecorators() {
  console.log('🎯 高级装饰器示例\n');

  // 示例 1: MapField 完整选项
  console.log('1️⃣  MapField 完整选项:');
  const productMapper = createMappingFromDecorators<Product, ProductDTO>(Product);
  const product = {
    id: 1,
    productName: 'Laptop',
    originalPrice: 999.999,
    desc: null,
    created: new Date('2024-01-01'),
    isAvailable: true,
  } as unknown as Product;
  
  const productDTO = productMapper.map(product);
  console.log('Product DTO:', productDTO);
  console.log();

  // 示例 2: 格式化装饰器
  console.log('2️⃣  格式化装饰器:');
  const profileMapper = createMappingFromDecorators<UserProfile, UserProfileDTO>(UserProfile);
  const profile = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    Email: 'JOHN.DOE@EXAMPLE.COM',
    userAge: undefined,
    biography: null,
    registeredAt: new Date('2023-06-15'),
    scoreValue: 0.856,
  } as unknown as UserProfile;
  
  const profileDTO = profileMapper.map(profile);
  console.log('Profile DTO:', profileDTO);
  console.log();

  // 示例 3: 条件映射和默认值
  console.log('3️⃣  条件映射和默认值:');
  const orderMapper = createMappingFromDecorators<Order, OrderDTO>(Order);
  const order = {
    id: 'ORD-001',
    amount: undefined,
    isPaid: true,
    discountRate: undefined,
    createdAt: new Date(),
  } as unknown as Order;
  
  const orderDTO = orderMapper.map(order);
  console.log('Order DTO:', orderDTO);
  console.log();

  // 示例 4: 排除字段
  console.log('4️⃣  排除敏感字段:');
  const userSecureMapper = createMappingFromDecorators<UserSecure, UserSecureDTO>(UserSecure);
  const userSecure = {
    userName: 'alice',
    userEmail: 'alice@example.com',
    password: 'secret123',
    secretToken: 'token-xyz',
    name: undefined,
  } as unknown as UserSecure;
  
  const userSecureDTO = userSecureMapper.map(userSecure);
  console.log('User Secure DTO:', userSecureDTO);
  console.log('(password 和 secretToken 已被排除)');
  console.log();

  // 示例 5: 组合多个装饰器
  console.log('5️⃣  组合多个装饰器:');
  const eventMapper = createMappingFromDecorators<Event, EventDTO>(Event);
  const event = {
    id: 'EVT-001',
    eventTitle: '  tech conference  ',
    desc: undefined, // 使用 undefined 而不是 null，符合类型定义
    start: new Date('2024-12-01T09:00:00'),
    end: new Date('2024-12-01T17:00:00'),
    attendees: 150,
    publicEvent: true,
  } as unknown as Event;
  
  const eventDTO = eventMapper.map(event);
  console.log('Event DTO:', eventDTO);
  console.log();

  console.log('✅ 所有装饰器示例完成！');
}

// 运行示例
demonstrateAdvancedDecorators().catch(console.error);

