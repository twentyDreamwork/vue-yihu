import Vue from 'vue'
import App from './App'
import router from './router'
import * as filters from './filters'
import element from './element'
import stores from './store'
import axios from 'axios'
import echarts from 'echarts'
import 'font-awesome/css/font-awesome.min.css'
import './components/common/directives';
import "babel-polyfill";
import './assets/css/icon.css';
import  './utils/requestService'


Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

Vue.use(element);
axios.interceptors.request.use(function (config) {  //配置发送请求的信息
  stores.dispatch('showLoading')
  config.headers['Content-Type'] = 'application/json'
  config.headers['Access-Control-Allow-Origin']="*"
  config.headers['Access-Control-Allow-Methods']="PUT,POST,GET,DELETE,OPTIONS"
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) { //配置请求回来的信息
  stores.dispatch('hideLoading')
  return response;
}, function (error) {
  return Promise.reject(error);
});

Vue.prototype.$http = axios
Vue.prototype.HOST='/api'
Vue.prototype.$echarts = echarts



new Vue({
	el: '#app',
	router,
	store:stores,
	render: h => h(App)
})
