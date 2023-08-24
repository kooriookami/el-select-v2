import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import '@/styles/main.scss';
import ElSelectV2 from 'el-select-v2';

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(ElSelectV2);

new Vue({
  el: '#app',
  render: h => {
    return h(App);
  },
});
