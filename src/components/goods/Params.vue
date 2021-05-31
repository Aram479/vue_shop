<template>
  <div class="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 警告提示 -->
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 级联选择器-->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" stripe border>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(item, index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- tag输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  round
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  round
                  size="mini"
                  @click="deleteForm(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isBtnDisabled"
            type="primary"
            size="mini"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" stripe border>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    :key="index"
                    v-for="(item, index) in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(index, scope.row)"
                  >
                    {{ item }}
                  </el-tag>
                  <!-- tag输入框 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  type="primary"
                  round
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  type="danger"
                  round
                  size="mini"
                  @click="deleteForm(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + addtitle"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item :label="addtitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + addtitle"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item :label="addtitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      cateList: [], //商品分类列表数据
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id", //options数据的id属性名
        label: "cat_name", //文本属性名
        children: "children", //子节点名
      },
      selectedKeys: [], //绑定级联选中的id
      manyTableData: [], //动态参数的列表数据
      onlyTableData: [], //静态属性的列表数据
      activeName: "many", //tabs标签页默认选中
      addDialogVisible: false, //添加参数对话框两个
      editDialogVisible: false, //修改参数对话框两个
      //添加参数form表单数据
      addForm: {
        attr_name: "",
      },
      editForm: {}, //
      /* 添加参数校验 */
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList(); //获取商品分类
  },
  computed: {
    /* button的disabled禁用和不禁用 */
    isBtnDisabled() {
      /* 若级联长度不等于3则返回true则禁用，否则false不禁用 */
      return this.selectedKeys.length !== 3;
    },
    /* 若级联选择器没有值则返回空，有值则返回三级权限的id */
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2];
      }
      return -1;
    },
    addtitle() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.cateList = res.data;
    },
    /* 级联选择变化函数 */
    async handleChange() {
      //若不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        this.$message.warning("只能设置三级分类");
        return;
      }
      this.getParamsData();
    },
    /* 获取级联选择后的商品分类id接口数据 */
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      //设置商品分类中tag标签分隔符
      res.data.forEach((item) => {
        //若vals数据不为空则用空格分隔，否则返回空数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        /* 控制tag标签显示和数据，让每个tag输入分开 */
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);
      //判断获取的是哪个标签页的数据，并存储相应数据
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
    /* tabs标签页选中后，激活次函数 */
    handleTabClick() {
      //每次切换标签页则调用一次
      this.getParamsData();
    },
    /* 重置添加参数表单数据 */
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    /* 重置修改参数对话框数据 */
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    /* 添加参数接口 */
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
        this.$message.success(res.meta.msg);
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    /* 编辑按钮操作 */
    async showEditDialog(attr_id) {
      this.editDialogVisible = true;
      const {
        data: res,
      } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data;
    },
    /* 编辑参数提交按钮 */
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
            attr_vals: this.editForm.attr_vals,
          }
        );
        if (res.meta.status !== 200) this.$message.error(res.meta.msg);
        this.$message.success("修改参数名称成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    /* 删除参数弹出框 */
    async deleteForm(id) {
      const confirmForm = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmForm !== "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);

      this.getParamsData();
    },
    /* tag输入框回车或失去焦点触发此函数 */
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //取消输入框多余空格为一个空格
      row.inputValue = row.inputValue.replace(/\s+/g, " ");
      row.attr_vals.push(row.inputValue);
      row.inputVisible = false;
      row.inputValue = "";
      //调用tag接口数据
      this.saveAttrVals(row);
    },
    async saveAttrVals(row) {
      /* 编辑提交tag接口数据 */
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      //就地更新数据，不重新渲染页面
      row = res.data;
    },
    showInput(row) {
      row.inputVisible = true;
      //输入框自动获得焦点
      //$nextTick 当页面渲染后(当inputVisible = true时)执行里面的函数
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除tag对应参数
    handleClose(index, row) {
      //index从0开始 splice从1开始
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
  },
  components: {},
};
</script>

<style  scoped>
.input-new-tag {
  width: 90px;
}
.el-tag {
  margin-right: 10px;
}
</style>
