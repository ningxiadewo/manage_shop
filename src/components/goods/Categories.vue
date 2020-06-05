<template>
  <!-- 商品分类 -->
  <div class="goods-categories">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片内容 -->
    <el-card>
      <!-- 添加分类 -->
      <el-button type="primary" @click="addCates">添加分类</el-button>

      <!-- 树形表格 -->
      <tree-table
        ref="table"
        show-index
        class="tree-table"
        :data="catesList"
        :columns="columnsProps"
        border
        tree-type
        children-prop="children"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效 -->
        <template slot="valid" scope="scope">
          <i
            :class="
              scope.row.cat_deleted
                ? 'el-icon-circle-close'
                : 'el-icon-circle-check'
            "
            :style="scope.row.cat_deleted ? 'color: red' : 'color: green'"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="editCatesName(scope.row)"
            >编辑</el-button
          >
          <el-button size="mini" type="primary" @click="removeCates(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="catesInfo.pagenum"
          :page-sizes="[4, 5, 8, 10]"
          :page-size="catesInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatesdialogVisible"
      width="40%"
      @close="closeAddCates"
    >
      <el-form
        :model="addCatesForm"
        label-width="100px"
        :rules="addCatesFormRules"
        ref="addCatesFormRef"
      >
        <el-form-item label="分类名称" prop="cateName">
          <el-input
            v-model="addCatesForm.cateName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <div class="block">
            <el-cascader
              v-model="addCatesValue"
              :options="addCatesFatherList"
              :props="{
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
                checkStrictly: true,
              }"
              clearable
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddCates">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类名称"
      :visible.sync="editCatesdialogVisible"
      width="45%"
    >
      <el-form
        :model="editCatesForm"
        label-width="130px"
        :rules="editCatesFormRules"
        ref="editCatesFormRef"
      >
        <el-form-item label="新的分类名称" prop="cateName">
          <el-input
            v-model="editCatesForm.cateName"
            autocomplete="off"
            placeholder="请输入新的分类名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCatesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditCates">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      catesList: [],
      // 当前分类列表信息
      catesInfo: {
        type: 3, // 第几层的分类列表，不传默认所有级别列表
        pagenum: 1, // 当前的页码
        pagesize: 5, // 每页显示多少条数据
      },
      // 分类列表数据的总条数
      total: 0,
      // 列的属性
      columnsProps: [
        {
          label: "分类名称", // 列的标题名称
          prop: "cat_name", // 列内容的属性名
        },
        {
          label: "是否有效", // 列的标题名称
          prop: "cat_deleted", // 列内容的属性名
          type: "template", // 插槽类型
          template: "valid", // 插槽的名字
        },
        {
          label: "排序", // 列的标题名称
          prop: "cat_level", // 列内容的属性名
          type: "template", // 插槽类型
          template: "sort", // 插槽的名字
        },
        {
          label: "操作", // 列的标题名称
          prop: "",
          type: "template", // 插槽类型
          template: "operation", // 插槽的名字
        },
      ],
      // 是否显示添加分类对话框
      addCatesdialogVisible: false,
      // 添加分类的表单
      addCatesForm: {
        cateName: "",
      },
      // 添加分类表单的规则
      addCatesFormRules: {
        cateName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 添加分类表单父级分类选项
      addCatesFatherList: [],
      // 添加分类级联选择器选中的值
      addCatesValue: [],
      // 是否显示编辑分类的表单
      editCatesdialogVisible: false,
      // 编辑分类的表单
      editCatesForm: {
        cateName: "",
      },
      // 编辑分类的规则
      editCatesFormRules: {
        cateName: [
          { required: true, message: "请输入新的分类名称", trigger: "blur" },
        ],
      },
      // 要编辑的分类信息
      editCatesInfo: {},
    };
  },
  created() {
    // 获取商品分类列表
    this.getCatesData();
  },
  methods: {
    // 获取商品分类列表数据
    async getCatesData() {
      const res = await this.$http.get("categories", {
        params: { ...this.catesInfo },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }
      // 获取商品分离列表成功
      this.catesList = res.data.result;
      this.total = res.data.total;
    },
    // 页数发生改变
    handleSizeChange(pagesize) {
      this.catesInfo.pagesize = pagesize;
      this.getCatesData();
    },
    // 当前页显示的条数发生改变
    handleCurrentChange(pagenum) {
      this.catesInfo.pagenum = pagenum;
      this.getCatesData();
    },
    // 点击添加分类按钮
    async addCates() {
      this.addCatesdialogVisible = true;
      // 请求所有的分类
      const res = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }

      // 获取商品分离列表成功
      this.addCatesFatherList = res.data;
    },
    // 确认添加分类
    confirmAddCates() {
      this.$refs.addCatesFormRef.validate(async (valid) => {
        if (!valid) return;
        // 表单验证成功
        // 查看当前父级分类是否有值，如果没有值，则设置父级分类id为0
        // 如果有值，则数组中最后的数值为父级id
        const cat_pid =
          this.addCatesValue.length > 0
            ? this.addCatesValue[this.addCatesValue.length - 1]
            : 0;
        const res = await this.$http.post("categories", {
          cat_pid,
          cat_name: this.addCatesForm.cateName,
          cat_level: this.addCatesValue.length,
        });
        // 请求失败
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败");
        }
        // 请求成功
        this.getCatesData();
        this.addCatesdialogVisible = false;
        this.$message.success("添加分类成功");
      });
    },
    // 关闭添加分类对话框
    closeAddCates() {
      this.addCatesdialogVisible = false;
      // 清空内容
      this.$refs.addCatesFormRef.resetFields();
      this.addCatesValue = [];
    },
    // 点击编辑分类
    editCatesName(row) {
      this.editCatesForm.cateName = row.cat_name;
      this.editCatesInfo = row;
      this.editCatesdialogVisible = true;
    },
    // 确认提交编辑分类名称
    confirmEditCates() {
      this.$refs.editCatesFormRef.validate(async (valid) => {
        if (!valid) return;
        // 提交到后台
        const res = await this.$http.put(
          `categories/${this.editCatesInfo.cat_id}`,
          {
            cat_name: this.editCatesForm.cateName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        // 修改成功
        // this.editCatesInfo.cat_name = res.data.cat_name;
        this.getCatesData();
        this.editCatesdialogVisible = false;
        this.$message.success("修改成功");
      });
    },
    // 删除该分类
    async removeCates(catesInfo) {
      const res = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      const removeRes = await this.$http.delete(
        `categories/${catesInfo.cat_id}`
      );
      if (removeRes.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.getCatesData();
      this.$message.success("删除商品分类成功");
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  .tree-table {
    margin-top: 20px;
  }
}
</style>
