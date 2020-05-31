<template>
  <!-- 用户列表 -->
  <div class="users">
    <!-- 头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card class="box-card">
      <!-- 搜索框以及添加用户 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="searchContent"
            class="input-with-select"
            @keyup.enter.native="searchUser"
          >
            <i
              slot="suffix"
              style="cursor:pointer"
              class="el-input__icon el-icon-error"
              v-show="isShowDetelte"
              @click="searchContent = ''"
            ></i>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUser"
            ></el-button> </el-input
        ></el-col>
        <!-- 添加用户 -->
        <el-col :span="6">
          <!-- 添加用户 -->
          <el-button type="primary" @click="addUser"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table :data="usersList" border style="width: 100%">
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="slotProps">
            <el-switch
              v-model="slotProps.row.mg_state"
              active-color="#13ce66"
              inactive-color="#C0CCDA"
              @change="handleSwitch(slotProps.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="200px">
          <template slot-scope="slotProps">
            <!-- 编辑用户按钮 -->
            <el-button
              type="success"
              size="mini"
              icon="el-icon-edit"
              @click="editUser(slotProps.row)"
            ></el-button>
            <!-- 分配权限 -->
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-star-off"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUser(slotProps.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[4, 5, 8, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- 添加用户提示框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addUserdialogVisible"
        width="40%"
        @close="closeAddUser"
      >
        <el-form
          :model="addUserForm"
          ref="addUserFormRef"
          label-width="70px"
          :rules="addUserFormRules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="addUserForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="addUserForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editUserdialogVisible"
        width="40%"
      >
        <el-form
          :model="editUserForm"
          label-width="70px"
          :rules="editUserFormRules"
          ref="editUserFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="editUserForm.username"
              disabled
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    // 获取用户列表
    this.getUsersList();
  },
  data() {
    // 邮箱自定义验证规则
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
      // 不符合验证规则
      if (!emailReg.test(value)) {
        return callback(new Error("邮箱地址格式不正确"));
      }
      // 邮箱格式正确
      callback();
    };
    // 手机号验证规则
    var checkMobile = (rule, value, callback) => {
      const mobileReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      // 不符合验证规则
      if (!mobileReg.test(value)) {
        return callback(new Error("手机号格式不正确"));
      }
      // 邮箱格式正确
      callback();
    };
    return {
      // 查询的参数
      queryInfo: {
        // 查询的内容
        query: "",
        // 当前页码数
        pagenum: 1,
        // 显示的条数
        pagesize: 4,
      },
      // 用户列表
      usersList: [],
      // 总条数
      total: 0,
      // 搜索内容
      searchContent: "",
      // 是否显示清空输入框按钮
      isShowDetelte: false,
      // 是否显示添加用户提示框
      addUserdialogVisible: false,
      // 添加用户表单
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
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
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
      // 是否显示编辑用户提示框
      editUserdialogVisible: false,
      // 编辑用户表单
      editUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 编辑用户表单验证规则
      editUserFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 获取用户列表
    async getUsersList() {
      const res = await this.$http.get("/users", { params: this.queryInfo });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
    // 改变当前页数的条数
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getUsersList();
    },
    // 修改页数
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getUsersList();
    },
    // 搜索用户
    searchUser() {
      this.queryInfo.query = this.searchContent;
      this.getUsersList();
    },
    // 权限开关
    async handleSwitch(userinfo) {
      const res = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("设置状态失败");
      }
      this.$message.success("设置状态成功");
    },
    // 点击添加用户按钮
    addUser() {
      this.addUserdialogVisible = true;
    },
    // 关闭添加用户按钮
    closeAddUser() {
      this.$refs.addUserFormRef.resetFields();
    },
    // 确认添加用户
    confirmAddUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post("/users", this.addUserForm);
          if (res.meta.status !== 201) {
            return this.$message.error("用户创建失败");
          }
          this.$message.success("用户添加成功");
          this.getUsersList();
          this.addUserdialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击编辑用户
    editUser(userinfo) {
      this.editUserForm = userinfo;
      this.editUserdialogVisible = true;
    },
    // 确认编辑用户
    confirmEditUser() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.put(`/users/${this.editUserForm.id}`, {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile,
          });
          if (res.meta.status !== 200) {
            return this.$message.error("用户更新失败");
          }
          this.$message.success("用户更新成功");
          this.getUsersList();
          this.editUserdialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 确认删除用户
    async removeUser(userinfoId) {
      const res = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 取消删除
      if (res === "cancel") {
        return this.$message.info("已取消删除");
      }
      // 发送删除请求
      const removeRes = await this.$http.delete(`users/${userinfoId}`);
      if (removeRes.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.getUsersList();
      this.$message.success("删除用户成功");
    },
  },
  watch: {
    // 监听搜索框内容是否为空
    searchContent(v) {
      // 查看输入框内容是否为空
      this.isShowDetelte = v ? true : false;
    },
  },
};
</script>

<style lang="less" scoped></style>
