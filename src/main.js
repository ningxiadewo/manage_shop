import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import Axios from "axios";
// 引入树形控件
import tableTree from "vue-table-with-tree-grid";

Vue.config.productionTip = false;

// 公共url
Axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";
// 请求拦截
Axios.interceptors.request.use((config) => {
  // 设置请求头 加入token
  const token = window.sessionStorage.getItem("token");
  config.headers.Authorization = token;
  return config;
});
// 响应拦截
Axios.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (arr) => {
    console.log(arr);
    console.log("响应拦截失败");
  }
);

// Vue.use(tableTree);
// 全局注册树形表格
Vue.component("tree-table", tableTree);

// 挂载到原型上
Vue.prototype.$http = Axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
