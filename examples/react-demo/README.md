# React Demo - Orika-JS

这是一个 React 示例应用，演示 `@orika-js/react` 包的核心功能。

## 🚀 快速启动

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 **http://localhost:3000** 启动。

### 构建生产版本

```bash
npm run build
npm run preview
```

## ✨ 功能演示

### 1. 基础映射 (useMapper)
- 对象映射基础功能
- 字段重命名（`username` → `displayName`）
- 字段排除（`password`、`role`）
- 类型转换（`Date` → ISO string）

### 2. 双向映射 + 差异检测
- `useBidirectionalMapper`: Entity ↔ DTO 双向转换
- `useMapperDiff`: 检测对象变更
- 实际应用：表单编辑场景

### 3. 记忆化映射 (useMemoizedMapper)
- 自动缓存映射结果
- 只在源对象变化时重新计算
- 性能优化最佳实践

### 4. 性能统计 (useMapperStats)
- 监控映射性能
- 显示平均耗时、总次数等统计信息

## 📁 项目结构

```
react-demo/
├── src/
│   ├── App.tsx          # 主应用（包含所有演示）
│   ├── main.tsx         # 应用入口
│   └── index.css        # 样式文件
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🛠 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具（快速启动和 HMR）
- **@orika-js/core** - 核心映射库
- **@orika-js/react** - React 适配器

## 📖 演示的功能

### Hooks
- ✅ `useMapper` - 基础映射
- ✅ `useBidirectionalMapper` - 双向映射
- ✅ `useMapperDiff` - 差异检测
- ✅ `useMemoizedMapper` - 记忆化映射
- ✅ `useMapperStats` - 性能统计
- ✅ `MapperProvider` - Context Provider

### 映射配置示例

```typescript
// Entity → DTO
createMapperBuilder<UserEntity, UserDTO>()
  .from(UserEntity).to(UserDTO)
  .mapField('username', 'displayName')    // 字段重命名
  .forMember('createdAt', (src) => src.createdAt.toISOString())  // 类型转换
  .exclude('password', 'role')            // 排除敏感字段
  .register();

// DTO → Entity（反向映射）
createMapperBuilder<UserDTO, UserEntity>()
  .from(UserDTO).to(UserEntity)
  .mapField('displayName', 'username')
  .forMember('createdAt', (src) => new Date(src.createdAt))
  .forMember('password', () => '')
  .forMember('role', () => 'user' as const)
  .register();
```

## 🎯 扩展建议

可以尝试添加更多功能演示：

1. **批量映射** - `useBatchMapper`、`useMapperChain`
2. **组件模式** - `<Mapper>`、`<MapperList>`、`<AsyncMapper>`
3. **HOC 模式** - `withMapper`、`withBidirectionalMapper`
4. **React 18 特性** - `useTransitionMapper`、`useDeferredMapper`

## 📚 相关文档

- [@orika-js/react 完整文档](../../packages/react)
- [@orika-js/core 核心库](../../packages/core)
- [主项目 README](../../README.md)

## 📄 许可证

MIT
