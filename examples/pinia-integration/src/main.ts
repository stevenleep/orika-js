import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createPiniaMapperPlugin } from '@orika-js/pinia';
import App from './App.vue';

// Import mappings to register them
import './models/mappings';

console.log('🚀 Initializing Pinia Integration Example');

// Create Pinia instance
const pinia = createPinia();

// Add the mapper plugin to Pinia
// This makes $mapper available in all stores
pinia.use(createPiniaMapperPlugin({
  autoTransform: true,
  cache: true,
  debug: true  // Enable debug logging
}));

console.log('✅ Pinia mapper plugin registered');

// Create and mount app
const app = createApp(App);
app.use(pinia);

app.mount('#app');

console.log('✅ App mounted');

