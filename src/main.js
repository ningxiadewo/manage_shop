import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import Axios from "axios";

Vue.config.productionTip = false;

Axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";
Axios.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (arr) => {
    console.log(arr);
    console.log("响应拦截失败");
  }
);

// 挂载到原型上
Vue.prototype.$http = Axios;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
