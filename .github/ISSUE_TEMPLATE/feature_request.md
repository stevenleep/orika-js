---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## 🚀 Feature Description

A clear and concise description of the feature you'd like to see.

## 💡 Motivation

Why is this feature needed? What problem does it solve?

## 📋 Use Case

Describe your use case and how this feature would benefit you or others.

## 💻 Proposed API/Usage

How would you like to use this feature?

```typescript
// Example of how the feature would work
import { MapperFactory, createMapperBuilder } from 'orika-js';

createMapperBuilder<Source, Target>()
  .from(Source)
  .to(Target)
  .yourNewFeature(...)  // Show how you envision using it
  .register();
```

## 🎯 Expected Behavior

What should happen when using this feature?

## 🔄 Alternatives Considered

Have you considered any alternative solutions or workarounds?

## 📝 Additional Context

Add any other context, screenshots, or examples about the feature request here.

## ✅ Checklist

- [ ] I have checked existing issues to ensure this isn't a duplicate
- [ ] This feature aligns with the library's purpose (object mapping)
- [ ] I have described a clear use case
- [ ] I have provided example usage

