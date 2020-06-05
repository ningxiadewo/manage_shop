<template>
  <!-- 添加商品 -->
  <div class="goods_add">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert title="添加商品信息" center type="info" show-icon> </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 内容 -->
      <el-form
        :model="addForm"
        ref="addFormRef"
        label-width="100px"
        :rules="addFormRules"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          @tab-click="handleClick"
          tab-position="left"
          :before-leave="beforLeaveTabs"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <div class="block">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="catesList"
                  :props="catesProps"
                  @change="handleCatesChange"
                  clearable
                ></el-cascader>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item1.attr_name"
              v-for="(item1, index1) in manyCatesParams"
              :key="item1.attr_id"
            >
              <el-tag
                v-for="(item2, index2) in item1.attr_vals"
                :key="index2"
                closable
                @close="removeParamsVal(index1, index2)"
                >{{ item2 }}</el-tag
              >
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyCatesParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <el-upload
              class="upload-demo"
              :headers="headers"
              :action="picturesUrl"
              :on-preview="handlePreviewImg"
              :on-remove="handleRemoveImg"
              :on-success="hangleSuccessImg"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <!-- 预览图片 -->
            <el-dialog
              title="预览图片"
              :visible.sync="priviewdialogVisible"
              width="50%"
            >
              <img :src="priviewImgUrl" alt="" class="priviewImg" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" @click="addCoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor,
  },
  data() {
    return {
      // 正在进行中的索引号
      activeIndex: 0,
      // 添加商品信息表单
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      // 添加商品信息规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
      },
      // 级联选择器商品分类数据
      catesList: [],
      // 级联选择器属性
      catesProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
      },
      // 商品动态参数
      manyCatesParams: [],
      // 商品静态属性
      onlyCatesParams: [],
      // 上传到后台的图片地址
      picturesUrl: "https://www.liulongbin.top:8888/api/private/v1/upload",
      // 上传图片地址的头部
      headers: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 预览图片url
      priviewImgUrl: "",
      // 是否显示预览图片提示框
      priviewdialogVisible: false,
    };
  },
  created() {
    this.getGoodsCates();
  },
  computed: {
    // 商品分类选中的id号
    selectCatId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
    },
  },
  methods: {
    // 切换至其他按钮之前
    beforLeaveTabs(activeName, oldActiveName) {
      // 当前在第一步
      if (oldActiveName === "0") {
        // 判断当前是否选择分类
        if (this.addForm.goods_cat.length === 0) {
          this.$message.error("您还未选择分类呢");
          // return false不可以切换至其他tabs
          return false;
        }
      }
    },
    // 切换左边步骤按钮
    handleClick(tabs) {
      // 点击基本信息中
      if (tabs.name === "0") {
        // 因点击添加商品就会把字符串改成数组
        // 把分类内容改为数组
        if (typeof this.addForm.goods_cat === "string") {
          this.addForm.goods_cat = this.addForm.goods_cat.split(",");
        }
      }
      // 如果在基本信息已经选择商品分类的情况下
      if (this.addForm.goods_cat.length !== 0) {
        // 点击商品参数
        if (tabs.name === "1") {
          this.getGoodsParams("many", "manyCatesParams");
        }
        // 点击静态属性
        if (tabs.name === "2") {
          this.getGoodsParams("only", "onlyCatesParams");
        }
      }
    },
    // 获取动态参数或者静态属性
    // sel 动态many, 静态only
    // goodsParams 保存的返回的动态参数或者静态属性
    async getGoodsParams(sel, goodsParams) {
      // 请求商品参数
      const res = await this.$http.get(
        `categories/${this.selectCatId}/attributes`,
        {
          params: {
            sel,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品动态参数失败");
      }
      // 获取成功
      // 若当前请求的是商品参数,则将res.data中的属性值attr_vals分割成数组
      if (goodsParams === "manyCatesParams") {
        res.data.forEach((v) => {
          if (v.attr_vals) {
            v.attr_vals = v.attr_vals.split(" ");
          }
        });
      }

      this[goodsParams] = res.data;
    },
    // 获取商品分类
    async getGoodsCates() {
      const res = await this.$http.get("/categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }
      // 获取成功
      this.catesList = res.data;
    },
    // 级联选择器选择值
    handleCatesChange() {
      // 判断是否选中第三极
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
    // 删除商品参数属性值
    removeParamsVal(index1, index2) {
      this.manyCatesParams[index1].attr_vals.splice(index2, 1);
    },
    // 点击图片列表中已上传的图片时的钩子
    handlePreviewImg(file) {
      // console.log(file);
      // 设置图片预览url
      this.priviewImgUrl = file.response.data.url;
      // 预览图片
      this.priviewdialogVisible = true;
    },
    // 文件列表移除文件时的钩子
    handleRemoveImg(file, fileList) {
      // 移除图片
      this.addForm.pics.some((v, i, arr) => {
        if (file.response.data.tmp_path === v.pic) {
          arr.splice(i, 1);
        }
      });
      // console.log(this.addForm);
    },
    // 图片上传成功后
    hangleSuccessImg(response, file, fileList) {
      // console.log(response);
      // 把图片临时地址保存到本地
      this.addForm.pics.push({
        pic: response.data.tmp_path,
      });
    },
    // 添加商品
    async addCoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("您的商品基本信息未填完整");
        }
        // 将商品分类分割成字符串
        this.addForm.goods_cat = this.addForm.goods_cat.join(",");
        // 处理动态参数
        this.manyCatesParams.forEach((v) => {
          if (!v.attr_vals) {
            v.attr_vals = [];
          }
          const info = {
            attr_id: v.attr_id,
            attr_value: v.attr_vals.join(" "),
          };
          this.addForm.attrs.push(info);
        });
        // 处理静态属性
        this.onlyCatesParams.forEach((v) => {
          // console.log(v.attr_vals);
          const info = {
            attr_id: v.attr_id,
            attr_value: v.attr_vals,
          };
          this.addForm.attrs.push(info);
        });
        console.log(this.addForm);

        // 提交到后台
        const res = await this.$http.post("goods", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        // 商品创建成功
        this.$router.push("/goods");
        this.$message.success("商品创建成功");
      });
    },
  },
};
</script>

<style lang="less">
.goods_add {
  .el-alert {
    margin: 20px 0;
  }
  .el-steps {
    margin-bottom: 20px;
  }
  .el-tag {
    margin: 0 10px 10px 0;
  }
  .priviewImg {
    width: 100%;
  }
  .ql-container {
    min-height: 300px;
    margin-bottom: 20px;
  }
}
</style>
