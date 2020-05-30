<template>
  <div class="login_container">
    <div class="login_box">
      <div class="title">
        <h1>后台管理系统</h1>
      </div>
      <div class="content">
        <el-form
          :rules="loginRules"
          ref="loginFormRef"
          :model="loginForm"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              class="login-input"
              prefix-icon="iconfont icon-yonghu"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              class="login-input"
              prefix-icon="iconfont icon-mima"
              type="password"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="resetLogin" plain>重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    resetLogin() {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          // valid为true 符合验证，可以登录
          const res = await this.$http.post("/login", this.loginForm);
          console.log(res);

          if (res.meta.status === 200) {
            // 登录成功
            this.$message.success("登录成功");
            window.sessionStorage.setItem("token", res.data.token);
            // 跳转到首页
            this.$router.push("home");
          } else {
            // 登录失败
            this.$message.error("用户名或密码错误");
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #034180;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    height: 300px;
    border-radius: 10px;
    background-color: #fff;
    margin: -200px 0 0 -200px;
    .title {
      line-height: 40px;
      text-align: center;
      h1 {
        font-size: 24px;
        color: #666;
        font-weight: normal;
      }
    }
    .content {
      position: relative;
      .login-form {
        padding: 0 40px;
        .login-input {
          border-radius: 50px;
        }
      }
      .login-btn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
