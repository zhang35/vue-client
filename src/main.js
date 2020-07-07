import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './http'
import Schart from 'vue-schart'
import echarts from 'echarts'
import moment from "moment"

window.Vue = Vue;
Vue.filter('dataFormat',function(dataStr,pattern="YYYY-MM-DD HH:mm:ss"){
  　　//直接调用moment，得到的是当前的时间
  　　moment()
  　　//根据给定时间，得到一个moment对象，就把字符串传到参数中
  　　moment(dataStr)
  　　//调用format方法
  　　return moment(dataStr).format(pattern)
  })

Vue.prototype.$echarts = echarts
Vue.use(echarts)


Vue.use(ElementUI);

Vue.prototype.$axios = axios

Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
