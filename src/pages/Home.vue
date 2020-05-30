<template>
  <div class="home-container">
    <el-button type="primary" @click="quitLogin">退出登录</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 退出登录
    quitLogin() {
      // 清除token信息
      window.sessionStorage.removeItem("token");
      // 返回到登录页面
      this.$router.replace("/login");
    },
  },
};
</script>

<style lang="less" scoped></style>
