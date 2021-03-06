import { createApp } from 'vue';
import { router } from './router';
import { key, store } from './store';
import App from './App.vue';
import '../_source/_css/app.css';

const app = createApp(App);

app.use(router);
app.use(store, key);

app.mount('#app');
