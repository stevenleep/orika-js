<template>
  <div class="composables-demo">
    <h1>Vue 3 新增 Composables 演示</h1>
    
    <!-- 1. 双向映射 -->
    <section class="demo-section">
      <h2>1. 双向映射 (useBidirectionalMapper)</h2>
      <div class="demo-content">
        <div>
          <h3>Entity 数据</h3>
          <pre>{{ JSON.stringify(entityData, null, 2) }}</pre>
        </div>
        <button @click="testBidirectional">转换为 DTO</button>
        <div v-if="dtoData">
          <h3>DTO 数据</h3>
          <pre>{{ JSON.stringify(dtoData, null, 2) }}</pre>
        </div>
        <button @click="testBidirectionalReverse" v-if="dtoData">转回 Entity</button>
      </div>
    </section>

    <!-- 2. 差异检测 -->
    <section class="demo-section">
      <h2>2. 差异检测 (useMapperDiff)</h2>
      <div class="demo-content">
        <input v-model="modifiedData.username" placeholder="修改用户名" />
        <input v-model="modifiedData.email" placeholder="修改邮箱" />
        <button @click="testDiff">检测差异</button>
        <div v-if="diffResult">
          <h3>变更字段：</h3>
          <pre>{{ JSON.stringify(diffResult, null, 2) }}</pre>
          <p v-if="hasDiffChanges">✅ 检测到变更</p>
          <p v-else>❌ 无变更</p>
        </div>
      </div>
    </section>

    <!-- 3. 链式映射 -->
    <section class="demo-section">
      <h2>3. 链式映射 (useMapperChain)</h2>
      <div class="demo-content">
        <button @click="testChain">执行链式映射 (Entity → DTO → ViewModel)</button>
        <div v-if="chainResult">
          <h3>最终结果：</h3>
          <pre>{{ JSON.stringify(chainResult, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <!-- 4. 合并映射 -->
    <section class="demo-section">
      <h2>4. 合并映射 (useMergeMapper)</h2>
      <div class="demo-content">
        <h3>原始对象：</h3>
        <pre>{{ JSON.stringify(existingUser, null, 2) }}</pre>
        <input v-model="mergeUpdates.username" placeholder="更新用户名" />
        <button @click="testMerge">合并更新</button>
        <div v-if="mergedResult">
          <h3>合并后：</h3>
          <pre>{{ JSON.stringify(mergedResult, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <!-- 5. 性能统计 -->
    <section class="demo-section">
      <h2>5. 性能统计 (useMapperStats)</h2>
      <div class="demo-content">
        <button @click="performMapping">执行映射</button>
        <button @click="refreshStats">刷新统计</button>
        <button @click="resetStats">重置统计</button>
        <div v-if="stats">
          <h3>性能指标：</h3>
          <ul>
            <li>总映射次数: {{ stats.totalMappings }}</li>
            <li>平均时间: {{ stats.averageTime?.toFixed(2) }}ms</li>
            <li>最近一次: {{ stats.lastMappingTime?.toFixed(2) }}ms</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 6. 条件映射 -->
    <section class="demo-section">
      <h2>6. 条件映射 (useConditionalMapper)</h2>
      <div class="demo-content">
        <label>
          <input type="checkbox" v-model="isAdmin" />
          是否管理员（只有管理员会被映射）
        </label>
        <div v-if="conditionalResult">
          <h3>映射结果：</h3>
          <pre>{{ JSON.stringify(conditionalResult, null, 2) }}</pre>
        </div>
        <div v-else>
          <p>❌ 条件不满足，未映射</p>
        </div>
      </div>
    </section>

    <!-- 7. 记忆化映射 -->
    <section class="demo-section">
      <h2>7. 记忆化映射 (useMemoizedMapper)</h2>
      <div class="demo-content">
        <input v-model="memoizedUser.username" placeholder="用户名" />
        <input v-model="memoizedUser.email" placeholder="邮箱" />
        <p>映射次数: {{ mappingCount }}</p>
        <div v-if="memoizedResult">
          <h3>缓存结果（自动更新）：</h3>
          <pre>{{ JSON.stringify(memoizedResult, null, 2) }}</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { createMapperBuilder } from '@orika-js/core';
import {
  useBidirectionalMapper,
  useMapperDiff,
  useMapperChain,
  useMergeMapper,
  useMapperStats,
  useConditionalMapper,
  useMemoizedMapper
} from '@orika-js/vue3';

// 定义类
class UserEntity {
  id!: number;
  username!: string;
  email!: string;
  password!: string;
  role!: string;
}

class UserDTO {
  id!: number;
  displayName!: string;
  email!: string;
}

class UserViewModel {
  id!: number;
  name!: string;
  contact!: string;
}

// 配置映射
createMapperBuilder<UserEntity, UserDTO>()
  .from(UserEntity).to(UserDTO)
  .mapField('username', 'displayName')
  .exclude('password', 'role')
  .register();

createMapperBuilder<UserDTO, UserEntity>()
  .from(UserDTO).to(UserEntity)
  .mapField('displayName', 'username')
  .forMember('password', () => '')
  .forMember('role', () => 'user')
  .register();

createMapperBuilder<UserDTO, UserViewModel>()
  .from(UserDTO).to(UserViewModel)
  .mapField('displayName', 'name')
  .mapField('email', 'contact')
  .register();

// 1. 双向映射示例
const { toB, toA } = useBidirectionalMapper(UserEntity, UserDTO);
const entityData = ref<UserEntity>({
  id: 1,
  username: 'Alice',
  email: 'alice@example.com',
  password: 'secret',
  role: 'admin'
});
const dtoData = ref<UserDTO | null>(null);

const testBidirectional = () => {
  dtoData.value = toB(entityData.value);
};

const testBidirectionalReverse = () => {
  if (dtoData.value) {
    const entity = toA(dtoData.value);
    console.log('转回的 Entity:', entity);
    alert('查看控制台输出');
  }
};

// 2. 差异检测示例
const { diff, hasChanges } = useMapperDiff<UserEntity>();
const modifiedData = ref({
  id: 1,
  username: 'Alice',
  email: 'alice@example.com',
  password: 'secret',
  role: 'admin'
});
const diffResult = ref<Partial<UserEntity> | null>(null);
const hasDiffChanges = ref(false);

const testDiff = () => {
  diffResult.value = diff(entityData.value, modifiedData.value as UserEntity);
  hasDiffChanges.value = hasChanges(diffResult.value);
};

// 3. 链式映射示例
const { mapChain } = useMapperChain();
const chainResult = ref<UserViewModel | null>(null);

const testChain = () => {
  chainResult.value = mapChain<UserViewModel>(
    entityData.value,
    UserEntity,
    UserDTO,
    UserViewModel
  );
};

// 4. 合并映射示例
const { merge } = useMergeMapper(UserEntity, UserEntity);
const existingUser = ref<UserEntity>({
  id: 2,
  username: 'Bob',
  email: 'bob@example.com',
  password: 'secret',
  role: 'user'
});
const mergeUpdates = ref({ username: 'Bob Updated' });
const mergedResult = ref<UserEntity | null>(null);

const testMerge = () => {
  mergedResult.value = merge(mergeUpdates.value, existingUser.value);
};

// 5. 性能统计示例
const { stats, refreshStats, resetStats } = useMapperStats(UserEntity, UserDTO);
const mappingCount = ref(0);

const performMapping = () => {
  toB(entityData.value);
  mappingCount.value++;
  setTimeout(refreshStats, 50);
};

// 6. 条件映射示例
const isAdmin = ref(false);
const conditionalUserRef = computed(() => ({
  ...entityData.value,
  role: isAdmin.value ? 'admin' : 'user'
}));
const conditionalResult = useConditionalMapper(
  conditionalUserRef as any,
  UserEntity,
  UserDTO,
  (user) => user.role === 'admin'
);

// 7. 记忆化映射示例
const memoizedUser = ref<UserEntity>({
  id: 3,
  username: 'Charlie',
  email: 'charlie@example.com',
  password: 'secret',
  role: 'user'
});
const memoizedResult = useMemoizedMapper(memoizedUser, UserEntity, UserDTO);

watch(memoizedResult, () => {
  console.log('Memoized result updated:', memoizedResult.value);
});
</script>

<style scoped>
.composables-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.demo-section h2 {
  color: #42b883;
  margin-top: 0;
}

.demo-content {
  margin-top: 20px;
}

.demo-content input {
  margin: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.demo-content button {
  margin: 10px;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.demo-content button:hover {
  background: #35a374;
}

.demo-content pre {
  background: #2c3e50;
  color: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
}

.demo-content ul {
  list-style: none;
  padding: 0;
}

.demo-content li {
  padding: 5px 0;
  font-size: 16px;
}
</style>

