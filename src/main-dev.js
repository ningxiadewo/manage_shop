import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import Axios from "axios";
// 引入树形控件
import tableTree from "vue-table-with-tree-grid";

// 引入echarts
import echarts from "echarts";

// 引入进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

// 公共url
Axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";
// 请求拦截
Axios.interceptors.request.use((config) => {
  // 设置请求头 加入token
  const token = window.sessionStorage.getItem("token");
  config.headers.Authorization = token;
  // 添加进度条
  NProgress.start();
  return config;
});
// 响应拦截
Axios.interceptors.response.use(
  (res) => {
    // 停止进度条
    NProgress.done();
    return res.data;
  },
  (arr) => {
    console.log(arr);
    console.log("响应拦截失败");
    alert("请查看网络");
  }
);

// 全局过滤器
Vue.filter("formatTime", function(date) {
  const time = new Date(date);
  // 计算年，月...秒
  const year = time.getFullYear();
  const month = (time.getMonth() + "").padStart(2, "0");
  const day = (time.getDay() + "").padStart(2, "0");
  const h = (time.getHours() + "").padStart(2, "0");
  const m = (time.getMinutes() + "").padStart(2, "0");
  const s = (time.getSeconds() + "").padStart(2, "0");
  return `${year}-${month}-${day} ${h}:${m}:${s}`;
});

// Vue.use(tableTree);
// 全局注册树形表格
Vue.component("tree-table", tableTree);

// 挂载到原型上
Vue.prototype.$http = Axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
