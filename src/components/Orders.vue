<template>
  <!-- 订单列表 -->
  <div class="Orders">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
        @keyup.enter.native="searchOrders"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchOrders"
        ></el-button>
      </el-input>
      <!-- 表格 -->
      <template>
        <el-table :data="OrdersList" stripe style="width: 100%" border>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="order_number" label="订单编号">
          </el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="100">
          </el-table-column>
          <el-table-column prop="order_pay" label="是否付款" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.order_pay === '1'">已付款</el-tag>
              <el-tag v-else type="warning">未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="100">
          </el-table-column>
          <el-table-column label="下单时间" width="200">
            <template slot-scope="scope">
              {{ scope.row.create_time | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="editAddress(scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" type="primary" @click="checkExpress"
                >查看物流</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 编辑地址 -->
    <el-dialog
      title="编辑地址"
      :visible.sync="addressdialogVisible"
      width="50%"
      @close="closeEditAddress"
    >
      <el-form
        :model="addresssForm"
        :rules="addressRules"
        ref="addressRef"
        label-width="100px"
      >
        <el-form-item label="省市区" prop="selectAddresss">
          <div class="block">
            <el-cascader
              v-model="addresssForm.selectAddresss"
              :options="citysData"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="addresssForm.detail"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confrimEditAddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看物流 -->
    <el-dialog
      title="编辑地址"
      :visible.sync="expressdialogVisible"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in expressData"
          :key="index"
          :timestamp="activity.time"
          placement="top"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 导入省市文件
import citys from "../js/citys";
export default {
  data() {
    return {
      // 搜索内容
      searchInput: "",
      // 订单列表
      OrdersList: [],
      // 查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 总条数
      total: 0,
      // 是否编辑地址对话框
      addressdialogVisible: false,
      // 编辑地址表单
      addresssForm: {
        detail: "",
        // 选中的省市
        selectAddresss: [],
      },
      // 编辑地址规则
      addressRules: {
        detail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        selectAddresss: [
          { required: true, message: "请选择省市", trigger: "blur" },
        ],
      },
      // 省市地区
      citysData: citys,
      // 是否显示物流信息
      expressdialogVisible: false,
      // 物流数据
      expressData: [],
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    // 清除搜索订单
    clearSearch() {
      this.getOrdersList();
    },
    // 搜索订单
    searchOrders() {
      this.queryInfo.query = this.searchInput;
      this.getOrdersList();
    },
    // 获取订单列表
    async getOrdersList() {
      const res = await this.$http.get("/orders", {
        params: {
          ...this.queryInfo,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      // 获取成功
      this.OrdersList = res.data.goods;
      this.total = res.data.total;
    },
    // 当前页数量发生改变
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getOrdersList();
    },
    // 页数发生改变
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getOrdersList();
    },
    // 点击编辑地址
    editAddress(row) {
      this.addressdialogVisible = true;
    },
    // 关闭编辑地址提示框
    closeEditAddress() {
      // 清空数据
      this.$refs.addressRef.resetFields();
    },
    // 确定修改地址
    confrimEditAddress() {
      this.$refs.addressRef.validate((valid) => {
        if (!valid) return;
        // 修改地址成功
        this.$message.success("修改地址成功");
        this.addressdialogVisible = false;
      });
    },
    // 点击查看物流按钮
    async checkExpress() {
      this.expressdialogVisible = true;
      const res = await this.$http.get(`/kuaidi/1106975712662`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流信息失败");
      }
      // 获取成功
      this.expressData = res.data;
      console.log(this.expressData);
    },
  },
};
</script>

<style lang="less">
.Orders {
  .input-with-select {
    width: 300px;
  }
}
</style>
