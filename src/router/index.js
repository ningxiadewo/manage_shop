import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/Login.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../pages/Home.vue"),
    meta: {
      // 需要登录才能加载页面
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

// 导航守卫拦截
router.beforeEach((to, form, next) => {
  if (to.meta.requiresAuth) {
    // 需要登录
    const token = window.sessionStorage.getItem("token");
    // 如果token为ture，则已经登录
    if (token) next();
    // 否则跳转到登录页面
    else next("login");
  } else {
    // 不需要登录
    next();
  }
});

export default router;
