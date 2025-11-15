import { useState, useMemo } from 'react';
import { createMapperBuilder } from '@orika-js/core';
import {
  useMapper,
  useBidirectionalMapper,
  useMapperDiff,
  useMemoizedMapper,
  useMapperStats,
  MapperProvider
} from '@orika-js/react';

// ============================================
// 定义模型类
// ============================================

class UserEntity {
  id!: number;
  username!: string;
  email!: string;
  password!: string;
  role!: 'user' | 'admin';
  createdAt!: Date;
}

class UserDTO {
  id!: number;
  displayName!: string;
  email!: string;
  createdAt!: string;
}

// ============================================
// 配置映射规则
// ============================================

createMapperBuilder<UserEntity, UserDTO>()
  .from(UserEntity).to(UserDTO)
  .mapField('username', 'displayName')
  .forMember('createdAt', (src) => src.createdAt.toISOString())
  .exclude('password', 'role')
  .register();

// 反向映射
createMapperBuilder<UserDTO, UserEntity>()
  .from(UserDTO).to(UserEntity)
  .mapField('displayName', 'username')
  .forMember('createdAt', (src) => new Date(src.createdAt))
  .forMember('password', () => '')
  .forMember('role', () => 'user' as const)
  .register();

// ============================================
// 示例1: 基础映射
// ============================================

function BasicMappingDemo() {
  const user = useMemo<UserEntity>(() => ({
    id: 1,
    username: 'Alice',
    email: 'alice@example.com',
    password: 'secret123',
    role: 'admin',
    createdAt: new Date()
  }), []);

  const userDTO = useMemoizedMapper(user, UserEntity, UserDTO);
  
  return (
    <div className="demo-container">
      <h2>1. 基础映射</h2>
      <div className="user-card">
        <p>源数据: {user.username} ({user.email}) - password: {user.password}</p>
        <p>映射结果: {userDTO?.displayName} ({userDTO?.email}) - password字段已排除 ✓</p>
      </div>
    </div>
  );
}

// ============================================
// 示例2: 双向映射 + 表单编辑
// ============================================

function BidirectionalMappingDemo() {
  const originalUser = useMemo<UserEntity>(() => ({
    id: 2,
    username: 'Bob',
    email: 'bob@example.com',
    password: 'secret456',
    role: 'user',
    createdAt: new Date()
  }), []);
  
  const { toB: toDTO, toA: toEntity } = useBidirectionalMapper(UserEntity, UserDTO);
  const { diff, hasChanges } = useMapperDiff<UserEntity>();
  const [formData, setFormData] = useState<UserDTO>(() => toDTO(originalUser));
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const changes = diff(originalUser, toEntity(formData));
    setMessage(hasChanges(changes) ? `变更: ${Object.keys(changes).join(', ')}` : '无变更');
  };

  return (
    <div className="demo-container">
      <h2>2. 双向映射 + 差异检测</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Display Name"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
        <input
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <button type="submit">检测变更</button>
      </form>
      {message && <div className="success">{message}</div>}
    </div>
  );
}

// ============================================
// 示例3: 记忆化映射
// ============================================

function MemoizedMappingDemo() {
  const [user, setUser] = useState<UserEntity>(() => ({
    id: 3,
    username: 'Charlie',
    email: 'charlie@example.com',
    password: 'secret789',
    role: 'user',
    createdAt: new Date()
  }));

  const userDTO = useMemoizedMapper(user, UserEntity, UserDTO);

  return (
    <div className="demo-container">
      <h2>3. 记忆化映射</h2>
      <button onClick={() => setUser(prev => ({ ...prev, username: `Charlie_${Date.now()}` }))}>
        修改用户名
      </button>
      <p>当前: {userDTO?.displayName} - 自动缓存，性能优化 ✓</p>
    </div>
  );
}

// ============================================
// 示例4: 性能统计
// ============================================

function StatsDemo() {
  const { stats, refreshStats } = useMapperStats(UserEntity, UserDTO);
  const { map } = useMapper(UserEntity, UserDTO);

  const handleMap = () => {
    map({ id: 4, username: 'David', email: 'david@example.com', password: '', role: 'user', createdAt: new Date() });
    setTimeout(refreshStats, 50);
  };

  return (
    <div className="demo-container">
      <h2>4. 性能统计</h2>
      <button onClick={handleMap}>执行映射</button>
      <button onClick={refreshStats}>刷新</button>
      {stats && (
        <p>
          共 {stats.totalMappings} 次, 
          平均 {stats.averageTime.toFixed(2)}ms, 
          最近 {stats.lastMappingTime.toFixed(2)}ms
        </p>
      )}
    </div>
  );
}

// ============================================
// 主应用
// ============================================

function App() {
  return (
    <MapperProvider>
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          🎉 Orika-JS React Demo
        </h1>
        
        <BasicMappingDemo />
        <BidirectionalMappingDemo />
        <MemoizedMappingDemo />
        <StatsDemo />
        
        <div className="demo-container" style={{ textAlign: 'center', background: '#e8f5e9' }}>
          <p style={{ margin: 0, color: '#4CAF50' }}>
            ✅ 所有功能正常运行
          </p>
        </div>
      </div>
    </MapperProvider>
  );
}

export default App;

