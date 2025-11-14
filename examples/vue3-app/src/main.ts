import { createApp } from 'vue';
import App from './App.vue';

// 导入映射配置 - 这会注册所有映射规则
import './models/mappings';

const app = createApp(App);

app.mount('#app');

