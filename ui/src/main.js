import { createApp } from 'vue'
import App from './App.vue'
import router from "./router.js";
import index from "./store";

const app = createApp(App);
app.use(router);
app.use(index)
app.mount('#app');
