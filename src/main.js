import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import CKEditor from '@ckeditor/ckeditor5-vue2';

Vue.prototype.$axios=axios;
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use( CKEditor );

axios.defaults.baseURL = "http://101.43.141.16/";

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
