<template>
  <div class="reports">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div id="reports-main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // 要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
      // 最终的数据列表
      reportsList: {},
    };
  },
  created() {},
  async mounted() {
    // // 按需引入excharts
    // // 引入 ECharts 主模块
    // var echarts = require("echarts/lib/echarts");
    // // 引入柱状图
    // require("echarts/lib/chart/bar");
    // // 引入提示框和标题组件
    // require("echarts/lib/component/tooltip");
    // require("echarts/lib/component/title");
    // 基于准备好的dom，初始化echarts实例
    var myChart = this.$echarts.init(document.getElementById("reports-main"));

    // 获取数据列表数据
    let res = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取数据列表失败");
    }

    Object.assign(this.reportsList, this.options, res.data);
    // console.log(this.reportsList);

    myChart.setOption(this.reportsList);
  },
};
</script>

<style lang="less" scoped></style>
