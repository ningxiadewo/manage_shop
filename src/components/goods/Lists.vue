<template>
  <!-- 商品列表 -->
  <div class="goods-lists">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索商品 -->
      <el-input
        placeholder="请输入内容"
        v-model="searchInput"
        class="input-with-select"
        clearable
        @clear="clearSearch"
        @keyup.enter.native="searchGoods"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchGoods"
        ></el-button>
      </el-input>
      <!-- 添加商品 -->
      <el-button type="primary" @click="addGoods">添加商品</el-button>

      <!-- 商品列表表格 -->
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="180">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180">
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | formatTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button size="mini" type="danger" @click="removeGoods(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 4, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索内容
      searchInput: "",
      // 查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 商品列表
      goodsList: [],
      // 商品总条数
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const res = await this.$http.get("/goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      // 获取商品列表成功
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodsList);
    },
    // 搜索商品
    searchGoods() {
      if (!this.searchInput.trim()) {
        return;
      }
      this.queryInfo.query = this.searchInput;
      this.getGoodsList();
    },
    // 清空搜索框内容 请求所有数据
    clearSearch() {
      this.queryInfo.query = "";
      this.getGoodsList();
    },
    // 页面数量发生改变
    handleSizeChange(number) {
      this.queryInfo.pagesize = number;
      this.getGoodsList();
    },
    // 改变页数
    handleCurrentChange(number) {
      this.queryInfo.pagenum = number;
      this.getGoodsList();
    },
    // 删除商品
    async removeGoods(row) {
      const res = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
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
      const removeRes = await this.$http.delete(`goods/${row.goods_id}`);
      if (removeRes.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      // 删除成功
      this.getGoodsList();
      this.$message.success("删除成功");
    },
    // 添加商品
    addGoods() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style lang="less" scoped>
.input-with-select {
  width: 300px;
  margin-right: 20px;
}
</style>
