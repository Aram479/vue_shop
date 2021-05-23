<template>
  <div id="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- Layout 栅格 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索输入框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="searchUser"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click.native="searchUser"
            >
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="8"
          ><el-button type="primary" @click.native="addDialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" border stripe>
        <!-- 表单区域 -->
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 状态按钮 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="185px">
          <template slot-scope="scope">
            <!-- 操作按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              round
              @click.native="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              round
              @click.native="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 文字提示 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                round
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 8, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框内容主体 -->
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    /* 验证邮箱规则 */
    var checkEmail = (rule, value, callback) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (regEmail.test(value)) {
        //合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    /* 验证手机号规则 */
    var checkPhone = (rule, value, callback) => {
      //验证手机号的正则表达式
      const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regPhone.test(value)) {
        //合法手机号
        console.log(value);
        return callback();
      }
      callback(new Error("请输入合法手机号"));
    };
    return {
      /* 获取用户列表参数 */
      queryInfo: {
        query: "", //查询参数,注：此属性就是查询输入框匹配的数据，内置查询方法
        pagenum: 1, //页数
        pagesize: 2, //条数
      },
      userList: [],
      total: 0, //总数据条数
      addDialogVisible: false, //添加用户对话框
      editDialogVisible: false, //修改用户对话框
      editForm: {},
      /* 添加用户 */
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      /* 添加用户校验 */
      addFormRules: {
        /* 用户名验证 */
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          /* 密码验证 */
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      /* users路径有三个参数query、pagenum、pagesize */
      /* params:用于get参数的拼接 */
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      /* 若当前页userList没有数据，则自动跳转到第一页并更新数据 */
      if (this.userList.length == 0) {
        this.queryInfo.pagenum = 1;
        this.getUserList();
      }
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize; //存储当前page-sizes想要显示的条数并传给pagesize
      this.getUserList(); //更新queryInfo的数据
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage; //存储当前点击的页码(newPage)并传给pagenum
      this.getUserList(); //更新queryInfo的数据
    },
    /* 用户状态接口数据 users/:uId/state/:type */
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state; //更新失败时重置状态
        this.$message.error("状态更新失败");
      }
      this.$message.success("状态更新成功");
    },
    searchUser() {
      this.queryInfo.pagenum = 1; //点击搜索重新定向到第一页，否则有bug
      this.getUserList();
    },
    /* 关闭添加用户对话框清空数据 */
    addDialogClosed() {
      this.$refs.addFormRef.resetFields(); //调用表单清除数据函数
    },
    /* 关闭修改用户对话框清空数据 */
    editDialogClosed() {
      this.$refs.editFormRef.resetFields(); //调用表单清除数据函数
    },
    /* 对整个表单预校验 */
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) this.$message.error(res.meta.msg);
        console.log(res.meta.msg);
        this.$message.success("添加用户成功");
        //隐藏添加用户
        this.addDialogVisible = false;
        //更新getUserList数据
        this.getUserList();
      });
    },
    /* 编辑用户 */
    async showEditDialog(id) {
      //获取当前行的接口数据
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) this.$message.error("查询信息失败");
      this.editForm = res.data; //将用户数据传给editForm
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    /* 修改用户信息并提交 */
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        console.log(res.meta.status);
        if (res.meta.status !== 200) this.$message.error("修改用户信息失败");
        this.$message.success("修改用户信息成功");
        this.getUserList();
        this.editDialogVisible = false;
      });
    },
    /* 删除信息 */
    async removeUserById(id) {
      /* 删除用户弹框 */
      const confirmResult = await this.$confirm(
        "此操作将永久删除用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      //确认删除则返回confirm
      //取消删除则返回cancel
      if(confirmResult !=='confirm' ) return this.$message.info('取消删除')
      //删除用户接口
      const { data: res } = await this.$http.delete("users/" + id);
      if(res.meta.status !==200) this.$message.error(res.meta.msg)
      this.$message.success('删除成功')
      this.getUserList()
    },
  },
  components: {},
};
</script>

<style  scoped>
</style>
