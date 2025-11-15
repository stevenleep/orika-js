/**
 * Jotai 集成示例
 * 演示如何在 Jotai 状态管理中使用 orika-js 自动映射
 */

import React from 'react';
import { atom, useAtomValue, useAtom } from 'jotai';
import { mappedAtom, mappedWritableAtom, asyncMappedAtom } from '../packages/jotai/src';
import { MapField, MapTo, Transform, createMappingFromDecorators } from '../packages/core/src';

// ========== 示例 1: 基础映射 Atom ==========

console.log('⚛️  Jotai 集成示例\n');
console.log('1️⃣  基础映射 Atom\n');

class UserState {
  id: number = 0;
  name: string = '';
  email: string = '';
}

class UserDTO {
  userId: number = 0;
  displayName: string = '';
  contact: string = '';
}

// 配置映射
const userMapper = createMappingFromDecorators<UserState, UserDTO>(
  (() => {
    @MapTo(UserDTO)
    class UserStateWithMapping {
      @MapField('userId')
      id: number = 0;
      
      @MapField('displayName')
      name: string = '';
      
      @MapField('contact')
      @Transform((v: string) => v.toLowerCase())
      email: string = '';
    }
    return UserStateWithMapping;
  })()
);

// 创建原始 atom
const userAtom = atom<UserState>({
  id: 1,
  name: 'Alice',
  email: 'ALICE@EXAMPLE.COM',
});

// 创建映射 atom
const userDTOAtom = mappedAtom(userAtom, {
  sourceClass: UserState,
  dtoClass: UserDTO,
  mapper: userMapper,
});

// 模拟读取（不在 React 环境中）
console.log('原始状态:', userAtom.init);
console.log('映射后的 DTO:', userMapper.map(userAtom.init));
console.log();

// ========== 示例 2: 可写映射 Atom ==========

console.log('2️⃣  可写映射 Atom\n');

// 创建反向映射
const reversemapper = createMappingFromDecorators<UserDTO, UserState>(
  (() => {
    @MapTo(UserState)
    class UserDTOWithMapping {
      @MapField('id')
      userId: number = 0;
      
      @MapField('name')
      displayName: string = '';
      
      @MapField('email')
      @Transform((v: string) => v.toUpperCase())
      contact: string = '';
    }
    return UserDTOWithMapping;
  })()
);

const writableUserAtom = atom<UserState>({
  id: 2,
  name: 'Bob',
  email: 'bob@example.com',
});

const writableUserDTOAtom = mappedWritableAtom(
  writableUserAtom,
  {
    sourceClass: UserState,
    dtoClass: UserDTO,
    mapper: userMapper,
  },
  {
    sourceClass: UserDTO,
    dtoClass: UserState,
    mapper: reversemapper,
  }
);

console.log('可写 Atom 创建完成');
console.log('读取映射: UserState -> UserDTO');
console.log('写入映射: UserDTO -> UserState');
console.log();

// ========== 示例 3: 异步映射 Atom ==========

console.log('3️⃣  异步映射 Atom\n');

class ApiUser {
  user_id: number = 0;
  user_name: string = '';
  user_email: string = '';
}

const apiUserMapper = createMappingFromDecorators<ApiUser, UserDTO>(
  (() => {
    @MapTo(UserDTO)
    class ApiUserWithMapping {
      @MapField('userId')
      user_id: number = 0;
      
      @MapField('displayName')
      user_name: string = '';
      
      @MapField('contact')
      user_email: string = '';
    }
    return ApiUserWithMapping;
  })()
);

// 模拟异步 API 调用
const asyncUserAtom = atom(async () => {
  // 模拟 API 请求
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    user_id: 3,
    user_name: 'Charlie',
    user_email: 'charlie@example.com',
  } as ApiUser;
});

const asyncUserDTOAtom = asyncMappedAtom(asyncUserAtom, {
  sourceClass: ApiUser,
  dtoClass: UserDTO,
  mapper: apiUserMapper,
});

console.log('异步 Atom 创建完成');
console.log('从 API 获取数据后自动映射为 UserDTO');
console.log();

// ========== 示例 4: 复杂状态映射 ==========

console.log('4️⃣  复杂状态映射\n');

class CartState {
  items: Array<{ id: number; name: string; price: number; quantity: number }> = [];
  discount: number = 0;
  taxRate: number = 0.1;
}

class CartDTO {
  itemCount: number = 0;
  subtotal: number = 0;
  tax: number = 0;
  discount: number = 0;
  total: number = 0;
}

const cartMapper = createMappingFromDecorators<CartState, CartDTO>(
  (() => {
    @MapTo(CartDTO)
    class CartStateWithMapping {
      @MapField('itemCount')
      @Transform((_, source: CartState) => 
        source.items.reduce((sum, item) => sum + item.quantity, 0)
      )
      items: any[] = [];
      
      @MapField('subtotal')
      @Transform((_, source: CartState) => 
        source.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      )
      discount: number = 0;
      
      @MapField('tax')
      @Transform((_, source: CartState) => {
        const subtotal = source.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return subtotal * source.taxRate;
      })
      taxRate: number = 0;
      
      @MapField('discount')
      discountAmount: number = 0;
      
      @MapField('total')
      @Transform((_, source: CartState) => {
        const subtotal = source.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * source.taxRate;
        return subtotal + tax - source.discount;
      })
      items2: any[] = [];
    }
    return CartStateWithMapping;
  })()
);

// 创建 cart atom
const cartAtom = atom<CartState>({
  items: [
    { id: 1, name: 'Laptop', price: 999, quantity: 1 },
    { id: 2, name: 'Mouse', price: 29, quantity: 2 },
  ],
  discount: 50,
  taxRate: 0.1,
});

// 创建映射 atom
const cartDTOAtom = mappedAtom(cartAtom, {
  sourceClass: CartState,
  dtoClass: CartDTO,
  mapper: cartMapper,
});

// 模拟读取（不在 React 环境中）
const cartState = cartAtom.init;
const cartDTO = cartMapper.map(cartState);
console.log('购物车状态:', cartState);
console.log('购物车 DTO:', cartDTO);
console.log();

console.log('✅ Jotai 集成示例完成！\n');

// ========== React 组件示例（仅展示代码结构）==========

/*
// Zustand 组件
function UserProfile() {
  const userDTO = useMappedState(useUserStore, useUserStore.mapper);
  
  return (
    <div>
      <h1>{userDTO.displayName}</h1>
      <p>Contact: {userDTO.contact}</p>
    </div>
  );
}

// Jotai 组件
function UserCard() {
  const userDTO = useAtomValue(userDTOAtom);
  
  return (
    <div>
      <h2>{userDTO.displayName}</h2>
      <p>{userDTO.contact}</p>
    </div>
  );
}

// 可写 Jotai 组件
function UserEditor() {
  const [userDTO, setUserDTO] = useAtom(writableUserDTOAtom);
  
  return (
    <input
      value={userDTO.displayName}
      onChange={(e) => setUserDTO({ ...userDTO, displayName: e.target.value })}
    />
  );
}
*/

console.log('📚 React 组件使用方式：\n');
console.log('Zustand:');
console.log('  const userDTO = useMappedState(useUserStore, useUserStore.mapper);\n');
console.log('Jotai:');
console.log('  const userDTO = useAtomValue(userDTOAtom);');
console.log('  const [dto, setDTO] = useAtom(writableUserDTOAtom);\n');

