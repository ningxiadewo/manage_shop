<template>
  <!-- 角色列表 -->
  <div class="roles">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 白色卡片 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addRole">添加角色</el-button>
      <!-- 表格内容 -->
      <el-table
        :data="rolesData"
        highlight-current-row
        style="width: 100%"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="slotScope">
            <!-- 一级标题 -->
            <el-row
              :gutter="20"
              v-for="item1 in slotScope.row.children"
              :key="item1.id"
              class="first-el-row"
            >
              <el-col :span="6">
                <!-- 一级标题标签 -->
                <el-tag
                  type="success"
                  closable
                  @close="removeRolePowerById(slotScope.row, item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="18">
                <!-- 二级标题 -->
                <el-row
                  :gutter="20"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  class="second-el-row"
                >
                  <el-col :span="6">
                    <!-- 二级标题标签 -->
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRolePowerById(slotScope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级标题 -->
                  <el-col :span="18">
                    <!-- 三级标题标签 -->
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="danger"
                      class="three-el-tag"
                      closable
                      @close="removeRolePowerById(slotScope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column property="roleName" label="角色名称">
        </el-table-column>
        <el-table-column property="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column property="level" label="操作">
          <template slot-scope="slotScope">
            <!-- 编辑用户按钮 -->
            <el-button
              type="success"
              size="mini"
              icon="el-icon-edit"
              @click="editRole(slotScope.row)"
            ></el-button>
            <!-- 分配权限 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-star-off"
                @click="assignPower(slotScope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeRole(slotScope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色提示框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoledialogVisible"
      width="40%"
      @close="closeAddRole"
    >
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        label-width="100px"
        :rules="addRoleFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="addRoleForm.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            v-model="addRoleForm.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色提示框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoledialogVisible"
      width="40%"
      @close="closeEditRole"
    >
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        label-width="100px"
        :rules="editRoleFormRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="editRoleForm.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            v-model="editRoleForm.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限树形结构 -->
    <el-dialog title="分配权限" :visible.sync="assgindialogVisible" width="50%">
      <el-tree
        :data="assginDataTree"
        :props="assginprops"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedArray"
        @check-change="handleCheckChange"
        ref="assginTreeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assgindialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAssignPower">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色数据列表
      rolesData: [],
      // 是否显示添加角色提示框
      addRoledialogVisible: false,
      // 添加角色表单
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加用户表单验证规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 是否显示编辑角色提示框
      editRoledialogVisible: false,
      // 编辑角色表单
      editRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 编辑表单验证规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 分配权限树形结构的显示与隐藏
      assgindialogVisible: false,
      // 分配权限数据
      assginDataTree: [],
      // 根据数据分级
      assginprops: {
        label: "authName",
        children: "children",
      },
      // 显示树形结构的选中状态 以最后的孩子id号作为节点
      checkedArray: [],
      // 分配权限的id号
      assignRoleId: -1,
    };
  },
  created() {
    // 获取角色数据
    this.getRolesData();
  },
  methods: {
    // 获取角色数据
    async getRolesData() {
      const res = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesData = res.data;
    },
    // 点击添加角色按钮
    addRole() {
      this.addRoledialogVisible = true;
    },
    // 关闭添加角色按钮
    closeAddRole() {
      this.$refs.addRoleFormRef.resetFields();
    },
    // 确认添加角色
    confirmAddRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post("/roles", this.addRoleForm);
          if (res.meta.status !== 201) {
            return this.$message.error("角色创建失败");
          }
          this.$message.success("角色添加成功");
          this.getRolesData();
          this.addRoledialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击编辑角色按钮
    editRole(roleinfo) {
      this.editRoledialogVisible = true;
      this.editRoleForm = roleinfo;
    },
    // 关闭编辑角色按钮
    closeEditRole() {
      this.$refs.editRoleFormRef.resetFields();
    },
    // 确认编辑角色
    confirmEditRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (valid) {
          const res = await this.$http.put(`/roles/${this.editRoleForm.id}`, {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          });
          if (res.meta.status !== 200) {
            return this.$message.error("角色编辑失败");
          }
          this.$message.success("角色编辑成功");
          this.getRolesData();
          this.editRoledialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除角色
    async removeRole(roleinfoId) {
      const res = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      // 确认删除 发送删除请求
      const removeRes = await this.$http.delete(`roles/${roleinfoId}`);
      if (removeRes.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      }
      this.getRolesData();
      this.$message.success("删除角色成功");
    },
    // 删除用户指定权限
    async removeRolePowerById(roleinfo, righstId) {
      const res = await this.$http.delete(
        `roles/${roleinfo.id}/rights/${righstId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("取消权限失败");
      }
      // 取消权限成功 更新列表
      roleinfo.children = res.data;
      this.$message.success("删除成功");
    },
    // 点击分配权限按钮
    async assignPower(roleinfo) {
      // 保存选择的分配权限的id号
      this.assignRoleId = roleinfo.id;
      // 清空上一次选中的节点
      this.checkedArray = [];
      this.assgindialogVisible = true;
      // 获取权限数据
      const res = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.assginDataTree = res.data;
      // 获取该角色的权限的选中状态情况
      this.findPower(roleinfo, this.checkedArray);
    },
    // 递归查找该角色中已选中的权限（最后的对象权限）
    findPower(node, arr) {
      // 如果没有chilren结点，则把id号加进选中节点的数组中
      if (!node.children) {
        return arr.push(node.id);
      }
      // 有chilren结点，则遍历chilren数组，递归调用findPower()
      node.children.forEach((v) => {
        this.findPower(v, arr);
      });
    },
    // 点击分配权限树形结构选择按钮
    handleCheckChange() {},
    // 确定分配该角色权限
    async confirmAssignPower() {
      // 获取已选中的结点数组
      let checkNodeArr = [
        ...this.$refs.assginTreeRef.getCheckedKeys(),
        ...this.$refs.assginTreeRef.getHalfCheckedKeys(),
      ];

      // 把结点以逗号隔开
      const checkNodeStr = checkNodeArr.join(",");
      // 提交到后台
      const res = await this.$http.post(`roles/${this.assignRoleId}/rights`, {
        rids: checkNodeStr,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("更新失败");
      }
      // 更新成功
      this.getRolesData();
      this.assgindialogVisible = false;
      this.$message.success("更新成功");
    },
  },
};
</script>

<style lang="less" scoped>
// 一级标题行
.first-el-row {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
}
// 二级标题行
.second-el-row {
  display: flex;
  justify-content: center;
  align-items: center;
  // padding-top: 10px;
  border-bottom: 1px solid #e5e5e5;
  &:last-of-type {
    border-bottom: none;
  }
}
// 三级标题标签
.three-el-tag {
  margin: 10px;
}
</style>
