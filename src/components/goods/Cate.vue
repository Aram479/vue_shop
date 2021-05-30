<template>
  <div class="cate">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" class="addcate" @click="showAddCateDialog"
        >添加分类</el-button
      >
      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template #isok="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success"></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <template #order="scope">
          <el-tag v-if="scope.row.cat_level == 0" effect="dark">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level == 1"
            effect="dark"
            type="success"
            >二级</el-tag
          >
          <el-tag v-else effect="dark" type="warning">三级</el-tag>
        </template>
        <template #opt="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCate(scope.row, scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 分类级联器 -->
        <el-form-item label="父级分类">
          <el-cascader
          placeholder="不选则默认为一级"
            clearable
            style="width: 100%"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="40%"
    >
      <el-form
        :model="editCateInfo"
        :rules="addCateFormRules"
        ref="editCateRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateFinish">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      }, //商品分页数据
      cateList: [], //存储商品分类数据
      total: 0, //总数据条数
      addCateDialogVisible: false, //添加分类对话框
      editCateDialogVisible: false, //编辑分类对话框
      parentCateList: [], //所有一级和二级分类数据
      selectedKeys: [], //存储级联选择器选择的分类id
      editCateInfo: [], //存储查询到的分类
      //添加分类设置数据
      addCateForm: {
        cat_pid: 0, //父级分类的id
        cat_name: "", //要添加分类的名称
        cat_level: 0, //分类的等级
      },
      //分类级联选择配置数据
      cascaderProps: {
        checkStrictly: true, //父子节点可分开选择
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //tree-table要显示数据
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "级别",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      /* 分类名称校验规则 */
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    /* 获取商品分类数据 */
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //商品分类数据列表接口
    async getParentCateList() {
      //type=2 表示获取前两级分类(一级、二级)
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.parentCateList = res.data;
      console.log(this.parentCateList);
    },
    /* 级联选择器变化后函数 */
    parentCateChange() {
      //leave:0为一级分类 1为二级分类 2为三级分类
      //当selectedKeys长度大于0则表示选中的是一级和二级
      //而选中一级表示在一级分类下创建二级分类，选中二级同理
      if (this.selectedKeys.length > 0) {
        //将selectedKeys最后值存入cat_pid(父级id)
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
        //否则默认为选中的是0级
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        console.log(this.addCateForm);
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );

        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);

        this.$message.success(res.meta.msg);
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    /* 关闭添加角色对话框 */
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields(); //重置表单
      this.selectedKeys = []; //重置选择后的id值
      this.addCateForm.cat_level = 0; //重置为0
      this.addCateForm.cat_pid = 0; //重置为0
      this.addCateForm.cat_name = "";
    },
    /* 编辑角色对话框 */
    async showEditCateDialog(cateId) {
      const { data: res } = await this.$http.get(`categories/${cateId}`);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editCateInfo = res.data;
      console.log(this.editCateInfo);
      this.editCateDialogVisible = true;
    },
    /* 编辑分类完成 */
    editCateFinish() {
      this.$refs.editCateRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.editCateInfo.cat_id}`,
          {
            cat_name: this.editCateInfo.cat_name,
          }
        );
        if (res.meta.status !== 200) return this.$message.error(mes.meta.msg);
        this.$message.success(res.meta.msg);
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },
    /* 删除分类弹框 */
    async deleteCate(cate, deleteCateId) {
      const confirmCate = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmCate !== "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$http.delete(
        `categories/${deleteCateId}`
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.getCateList()
      this.$message.success(res.meta.msg);
    },
  },
  components: {},
};
</script>

<style  scoped>
.tree-table {
  font-size: 14px;
}
.el-icon-success,
.el-icon-error {
  transform: scale(1.5);
}
.el-icon-success {
  color: #90ee90;
}
.el-icon-error {
  color: red;
}
.addcate {
  margin-bottom: 15px;
}
</style>
