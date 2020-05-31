<template>
  <div class="home-container">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="title">电商后台管理系统</div>
        <el-button type="primary" @click="quitLogin">
          退出登录</el-button
        ></el-header
      >
      <!-- 主要内容 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '230px'">
          <el-menu
            :default-active="$route.path"
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            :collapse-transition="false"
            unique-opened
            router
          >
            <!-- 折叠按钮 -->
            <div class="flod" @click="isCollapse = !isCollapse">|||</div>
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menusList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconsList[item.id]" class="menuIcon"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <i class="el-icon-s-grid"></i
                >{{ subItem.authName }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右边主要内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  created() {
    // 获取左侧菜单列表
    this.getMenusList();
  },
  data() {
    return {
      // 菜单图标
      iconsList: {
        "125": "iconfont icon-yonghu",
        "103": "iconfont icon-quanxian",
        "102": "iconfont icon-shangpin",
        "101": "iconfont icon-dingdan",
        "145": "iconfont icon-iconfontpaixingbang",
      },
      // 菜单列表
      menusList: [],
      // 是否水平折叠
      isCollapse: false,
    };
  },
  methods: {
    // 退出登录
    quitLogin() {
      // 清除token信息
      window.sessionStorage.removeItem("token");
      // 返回到登录页面
      this.$router.replace("/login");
    },
    // 获取左侧菜单列表
    async getMenusList() {
      const res = await this.$http.get("menus");
      // 请求不成功
      if (res.meta.status !== 200) {
        return this.$message("获取菜单列表失败");
      }
      // 请求成功
      this.menusList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  width: 100%;
  background: #373d41;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    color: #fff;
    font-size: 24px;
  }
}
.el-container {
  height: 100%;
}
.el-main {
  height: 100%;
  background: #eaedf1;
}
.el-menu {
  border-right: none;
}
.menuIcon {
  margin-right: 5px;
}
.flod {
  line-height: 30px;
  background-color: #4a5064;
  text-align: center;
  cursor: pointer;
}
</style>
