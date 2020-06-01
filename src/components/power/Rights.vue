<template>
  <div class="rights">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 白色卡片 -->
    <el-card class="box-card">
      <el-table
        :data="rightsData"
        highlight-current-row
        style="width: 100%"
        border
        stripe
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column property="authName" label="权限名称">
        </el-table-column>
        <el-table-column property="path" label="路径"> </el-table-column>
        <el-table-column property="level" label="权限等级">
          <template slot-scope="slotProps">
            <el-tag type="success" v-if="slotProps.row.level === '0'"
              >一级</el-tag
            >
            <el-tag type="warning" v-else-if="slotProps.row.level === '2'"
              >二级</el-tag
            >
            <el-tag type="danger" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsData: [],
    };
  },
  created() {
    this.getRightsData();
  },
  methods: {
    // 获取权限列表
    async getRightsData() {
      const res = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsData = res.data;
    },
  },
};
</script>

<style lang="less" scoped></style>
git branch -d
