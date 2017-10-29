import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";


/*// 引用API文件
import api from './config/api'
// 将API方法绑定到全局
Vue.prototype.$api = api*/

Vue.use(ElementUI);
Vue.prototype.$axios = axios;// 将axios绑定到全局

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');