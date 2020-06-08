import Vue from "vue";
import VueRouter from "vue-router";

// 把Login、Home、WelCome分在一个模块
const Login = () =>
  import(/* webpackChunkName: "login-home-welcome" */ "../pages/Login.vue");
const Home = () =>
  import(/* webpackChunkName: "login-home-welcome" */ "../pages/Home.vue");
const WelCome = () =>
  import(
    /* webpackChunkName: "login-home-welcome" */ "../components/WelCome.vue"
  );

// import WelCome from "../components/WelCome.vue";
// import Users from "../components/Users.vue";
// import Rights from "../components/power/Rights.vue";
// import Roles from "../components/power/Roles.vue";

// 把Users、Right、Roles分在一个模块
const Users = () =>
  import(
    /* webpackChunkName: "users-rights-roles" */ "../components/Users.vue"
  );
const Rights = () =>
  import(
    /* webpackChunkName: "users-rights-roles" */ "../components/power/Rights.vue"
  );
const Roles = () =>
  import(
    /* webpackChunkName: "users-rights-roles" */ "../components/power/Roles.vue"
  );

// Categories Params Lists
// import Categories from "../components/goods/Categories.vue";
// import Params from "../components/goods/Parmas.vue";
// import Lists from "../components/goods/Lists.vue";

const Categories = () =>
  import(
    /* webpackChunkName: "categories-params-lists" */ "../components/goods/Categories.vue"
  );
const Params = () =>
  import(
    /* webpackChunkName: "categories-params-lists" */ "../components/goods/Parmas.vue"
  );
const Lists = () =>
  import(
    /* webpackChunkName: "categories-params-lists" */ "../components/goods/Lists.vue"
  );

// import Add from "../components/goods/Add.vue";
// import Orders from "../components/Orders.vue";
// import Reports from "../components/Reports.vue";

// Add、Orders、Reports
const Add = () =>
  import(
    /* webpackChunkName: "add-orders-reports" */ "../components/goods/Add.vue"
  );
const Orders = () =>
  import(
    /* webpackChunkName: "add-orders-reports" */ "../components/Orders.vue"
  );
const Reports = () =>
  import(
    /* webpackChunkName: "add-orders-reports" */ "../components/Reports.vue"
  );

Vue.use(VueRouter);

//push
const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};

//replace
const VueRouterReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(to) {
  return VueRouterReplace.call(this, to).catch((err) => err);
};

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    redirect: "/welCome",
    meta: {
      // 需要登录才能加载页面
      requiresAuth: true,
    },
    children: [
      {
        path: "/welCome",
        name: "welCome",
        component: WelCome,
      },
      {
        path: "/users",
        name: "users",
        component: Users,
      },
      {
        path: "/rights",
        name: "rights",
        component: Rights,
      },
      {
        path: "/roles",
        name: "roles",
        component: Roles,
      },
      {
        path: "/categories",
        name: "categories",
        component: Categories,
      },
      {
        path: "/params",
        name: "params",
        component: Params,
      },
      {
        path: "/goods",
        name: "goods",
        component: Lists,
      },
      {
        path: "/goods/add",
        name: "add",
        component: Add,
      },
      {
        path: "/orders",
        name: "orders",
        component: Orders,
      },
      {
        path: "/reports",
        name: "reports",
        component: Reports,
      },
    ],
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
