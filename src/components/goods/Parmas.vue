<template>
  <!-- 分类参数 -->
  <div class="goods_params">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 级联选择器 -->
      <div class="block">
        <span class="demonstration">选择商品分类</span>
        <el-cascader
          v-model="catesIdArr"
          :options="catesData"
          :props="cascaderProps"
          @change="handleChange"
          clearable
          ref="catesCascaderRef"
        ></el-cascader>
      </div>

      <!-- 动态静态切换 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="catesIdArr.length === 0"
            @click="addParams"
            >添加参数</el-button
          >
          <el-table :data="ParamsList" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="slotScope">
                <!-- 显示属性 -->
                <div
                  style="display: inline-block"
                  v-if="slotScope.row.attr_vals.length !== 0"
                >
                  <el-tag
                    v-for="(item, index) in slotScope.row.attr_vals"
                    :key="index"
                    style="margin-right: 20px"
                    closable
                    @close="removeVal(index, slotScope.row)"
                    >{{ item }}</el-tag
                  >
                </div>

                <!-- 添加新的属性 -->
                <el-input
                  class="input-new-tag"
                  v-if="slotScope.row.newInputVisible"
                  v-model="slotScope.row.newinputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(slotScope.row)"
                  @blur="handleInputConfirm(slotScope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showNewInput(slotScope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数"> </el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="slotScope">
                <el-button type="primary" @click="editParams(slotScope.row)"
                  >编辑</el-button
                >
                <el-button type="primary" @click="removeParams(slotScope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态参数" name="only">
          <el-button
            type="primary"
            :disabled="catesIdArr.length === 0"
            @click="addParams"
            >添加参数</el-button
          >
          <el-table :data="ParamsList" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="slotScope">
                <!-- 显示属性 -->
                <div
                  style="display: inline-block"
                  v-if="slotScope.row.attr_vals.length !== 0"
                >
                  <el-tag
                    v-for="(item, index) in slotScope.row.attr_vals"
                    :key="index"
                    style="margin-right: 20px"
                    closable
                    @close="removeVal(index, slotScope.row)"
                    >{{ item }}</el-tag
                  >
                </div>

                <!-- 添加新的属性 -->
                <el-input
                  class="input-new-tag"
                  v-if="slotScope.row.newInputVisible"
                  v-model="slotScope.row.newinputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(slotScope.row)"
                  @blur="handleInputConfirm(slotScope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showNewInput(slotScope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数"> </el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="slotScope">
                <el-button type="primary" @click="editParams(slotScope.row)"
                  >编辑</el-button
                >
                <el-button type="primary" @click="removeParams(slotScope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数对话框 -->
      <el-dialog
        :title="`添加${activeText}`"
        :visible.sync="addParamsdialogVisible"
        width="45%"
        @close="closeAddParams"
      >
        <el-form
          :model="addParamsForm"
          label-width="130px"
          :rules="addParamsFormRules"
          ref="addParamsFormRef"
        >
          <el-form-item label="新的参数名称" prop="paramName">
            <el-input
              v-model="addParamsForm.paramName"
              autocomplete="off"
              placeholder="请输入新的参数名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑参数对话框 -->
      <el-dialog
        :title="`编辑${activeText}`"
        :visible.sync="editParamsdialogVisible"
        width="45%"
      >
        <el-form
          :model="editParamsForm"
          label-width="130px"
          :rules="editParamsFormRules"
          ref="editParamsFormRef"
        >
          <el-form-item label="新的参数名称" prop="paramName">
            <el-input
              v-model="editParamsForm.paramName"
              autocomplete="off"
              placeholder="请输入新的参数名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      catesData: [],
      // 级联选择器选中的分类id
      catesIdArr: [],
      // 切换显示按钮
      activeName: "many",
      // 级联选择器属性
      cascaderProps: {
        expandTrigger: "hover", // 滑动
        label: "cat_name", // 显示的标签
        value: "cat_id", // 选择后保存的值
      },
      // 参数数据
      ParamsList: [],
      // 是否显示添加参数的表单
      addParamsdialogVisible: false,
      // 添加参数的表单
      addParamsForm: {
        paramName: "",
      },
      // 添加参数的规则
      addParamsFormRules: {
        paramName: [
          { required: true, message: "请输入新的参数名称", trigger: "blur" },
        ],
      },
      // 是否显示编辑参数的表单
      editParamsdialogVisible: false,
      // 编辑参数的表单
      editParamsForm: {
        paramName: "111",
      },
      // 编辑参数的规则
      editParamsFormRules: {
        paramName: [
          { required: true, message: "请输入新的参数名称", trigger: "blur" },
        ],
      },
      // 编辑参数的信息
      editParamsInfo: {},
    };
  },
  created() {
    this.getCatesData();
  },
  computed: {
    // 当前选择的参数文本 默认动态参数
    activeText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  methods: {
    // 获取商品分类数据
    async getCatesData() {
      const res = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }
      // 获取数据成功
      this.catesData = res.data;
    },
    // 级联选择器选择商品
    handleChange() {
      // 若选择不等于三级，则清空选择框内容内容
      if (this.catesIdArr.length !== 3) {
        this.catesIdArr = [];
        this.ParamsList = [];
        this.$message.error("要选择第三级才可设置参数");
        return;
      }
      // 请求动态或静态参数
      this.handleTabsClick();
    },
    // 切换按钮 请求动态或者静态参数数据
    async handleTabsClick() {
      if (this.catesIdArr.length === 0) return;
      // 当已选择三级分类时 请求数据
      const res = await this.$http.get(
        `categories/${this.catesIdArr[this.catesIdArr.length - 1]}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      // 把参数属性分割成数组
      res.data.forEach((v) => {
        // 属性字符串为空，则设为空数组，不为空则分割字符串
        if (!v.attr_vals) {
          v.attr_vals = [];
        } else {
          v.attr_vals = v.attr_vals.split(" ");
        }
        // 为每个对象独立添加新的input
        v.newInputVisible = false;
        v.newinputValue = "";
      });
      // 获取数据成功，保存数据
      this.ParamsList = res.data;
    },
    // 点击添加参数按钮
    addParams() {
      this.addParamsdialogVisible = true;
    },
    // 确定添加参数
    async confirmAddParams() {
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return;
        // 表单验证成功
        // 发送请求添加参数
        const res = await this.$http.post(
          `categories/${
            this.catesIdArr[this.catesIdArr.length - 1]
          }/attributes`,
          {
            attr_name: this.addParamsForm.paramName,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        // 添加参数成功
        this.handleTabsClick();
        this.addParamsdialogVisible = false;
        this.$message.success("添加参数成功");
      });
    },
    // 关闭添加参数对话框
    closeAddParams() {
      this.addParamsdialogVisible = false;
      this.$refs.addParamsFormRef.resetFields();
    },
    // 点击编辑参数按钮
    editParams(paramsInfo) {
      this.editParamsdialogVisible = true;
      this.editParamsInfo = paramsInfo;
      this.editParamsForm.paramName = paramsInfo.attr_name;
    },
    // 确定编辑参数
    async confirmEditParams() {
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) return;
        // 表单验证成功
        // 发送请求编辑参数
        const res = await this.$http.put(
          `categories/${
            this.catesIdArr[this.catesIdArr.length - 1]
          }/attributes/${this.editParamsInfo.attr_id}`,
          {
            attr_name: this.editParamsForm.paramName,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("编辑参数失败");
        }
        // 添加参数成功
        this.handleTabsClick();
        this.editParamsdialogVisible = false;
        this.$message.success("编辑参数成功");
      });
    },
    // 关闭编辑参数对话框
    closeEditParams() {
      this.editParamsdialogVisible = false;
      // this.$refs.editParamsFormRef.resetFields();
    },
    // 删除参数
    async removeParams(row) {
      const res = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
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
      const removeRes = await this.$http.delete(
        `categories/${this.catesIdArr[this.catesIdArr.length - 1]}/attributes/${
          row.attr_id
        }`
      );
      if (removeRes.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      // 删除成功
      this.handleTabsClick();
      this.$message.success("删除成功");
    },
    // 点击添加新的属性
    showNewInput(row) {
      row.newInputVisible = true;
      row.newinputValue = "";
      // this.$nextTick的回调是dom刷新时调用回调函数
      // 因v-if是要每一次dom刷新才执行，所以使用this.$nextTick
      this.$nextTick(() => {
        // 获取input焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 确认新的属性提交
    async handleInputConfirm(row) {
      // 若输入为空，退出
      if (!row.newinputValue.trim()) {
        row.newInputVisible = false;
        return;
      }
      // 添加属性
      row.attr_vals.push(row.newinputValue);
      row.newInputVisible = false;
      // 提交请求
      this.saveAttrVals(row);
    },
    // 删除属性值
    removeVal(i, row) {
      // 本地删除属性值
      row.attr_vals.splice(i, 1);
      // 提交到后台
      this.saveAttrVals(row);
    },
    // 保存属性值到后台
    async saveAttrVals(row) {
      const res = await this.$http.put(
        `categories/${this.catesIdArr[this.catesIdArr.length - 1]}/attributes/${
          row.attr_id
        }`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改属性失败");
      }
      // 添加属性成功
      this.$message.success("属性修改成功");
    },
  },
};
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px !important;
}
.demonstration {
  margin-right: 20px;
}
.el-cascader-panel {
  height: 200px !important;
}
.input-new-tag {
  width: 100px;
}
</style>
