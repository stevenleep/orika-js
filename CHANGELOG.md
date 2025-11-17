# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive contribution guidelines
- Code of conduct
- Security policy
- GitHub issue and PR templates
- CI/CD pipeline with GitHub Actions

## [1.2.1] - 2024-11-17

### Added
- Multiple state management integrations
  - `@orika-js/zustand` - Zustand integration
  - `@orika-js/jotai` - Jotai integration  
  - `@orika-js/pinia` - Pinia integration
- Advanced React hooks
  - `useAsyncMapper` - Async mapping with loading states
  - `useBatchMapper` - Batch processing
  - `useMapperChain` - Chain multiple mappings
  - `useMapperDiff` - Track mapping differences
  - `useMapperStats` - Performance statistics
- Advanced Vue 3 composables
  - `useAsyncMapper` - Async mapping with loading states
  - `useBatchMapper` - Batch processing
  - `useMapperChain` - Chain multiple mappings
  - `useMapperDiff` - Track mapping differences
  - `useMapperStats` - Performance statistics
- Decorator support for simplified configuration
- Class type utilities
- Branded types for type safety
- TypeScript strict mode utilities

### Changed
- Improved TypeScript type inference
- Enhanced error messages with better context
- Optimized mapping performance with caching

### Fixed
- Memory leak in cache management
- Type inference issues with generic converters

## [1.1.0] - 2024-10-01

### Added
- `@orika-js/react` package for React integration
  - `useMapper` - Basic mapping hook
  - `useMemoizedMapper` - Memoized mapping
  - `MapperProvider` - Context provider
  - `Mapper` - Mapping component
  - `withMapper` - HOC for mapping
- `@orika-js/vue3` package for Vue 3 integration
  - `useMapper` - Composition API hook
  - `mapToReactive` - Reactive mapping
  - `mapToComputed` - Computed mapping
  - `VueMapperFactory` - Vue-specific factory
- Batch processing utilities
- Mapping statistics and performance tracking
- Type-safe property access utilities

### Changed
- Split monolithic core into framework-specific packages
- Improved documentation with more examples

### Fixed
- Edge cases in nested object mapping
- Circular reference handling

## [1.0.0] - 2024-09-01

### Added
- Core mapping engine (`@orika-js/core`)
  - `MapperFactory` - Singleton factory for all mappings
  - `createMapperBuilder` - Fluent API for configuration
  - Automatic field mapping for same-name fields
  - Custom field transformations with `forMember`
  - Async transformations with `forMemberAsync`
  - Field exclusion with `exclude`
  - Conditional mapping with `mapFieldWhen`
  - Validation support with `validate`
  - Lifecycle hooks (`beforeMap`, `afterMap`)
- Array mapping support
- Bidirectional mapping
- Chain mapping (A → B → C)
- Merge mapping (update existing objects)
- Custom converter registry
- Built-in converters for common types
- Mapping cache for performance
- Expression evaluator for complex mappings
- Error handling utilities
- Console logger
- TypeScript type guards and utilities

### Documentation
- Comprehensive README
- API documentation
- Quick start guide
- Multiple examples
  - Basic usage
  - Async mapping
  - Collections handling
  - Validation
  - Advanced scenarios

## [0.9.0] - 2024-08-01 (Beta)

### Added
- Initial beta release
- Basic mapping functionality
- TypeScript support
- Field mapping and exclusion
- Custom converters

### Known Issues
- Performance optimization needed for large datasets
- Limited framework integration
- Missing advanced features

---

## Release Types

- **Major (X.0.0)**: Breaking changes
- **Minor (x.X.0)**: New features, backward compatible
- **Patch (x.x.X)**: Bug fixes, backward compatible

## Links

- [GitHub Repository](https://github.com/stevenleep/orika-js)
- [NPM Package - Core](https://www.npmjs.com/package/@orika-js/core)
- [NPM Package - React](https://www.npmjs.com/package/@orika-js/react)
- [NPM Package - Vue 3](https://www.npmjs.com/package/@orika-js/vue3)
- [NPM Package - Zustand](https://www.npmjs.com/package/@orika-js/zustand)
- [NPM Package - Jotai](https://www.npmjs.com/package/@orika-js/jotai)
- [NPM Package - Pinia](https://www.npmjs.com/package/@orika-js/pinia)

