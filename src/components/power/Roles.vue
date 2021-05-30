<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- Layout 栅格 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 添加角色 -->
          <el-button type="primary" @click.native="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="rolesList" border stripe>
        <!-- 表单区域 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5"
                ><el-tag
                  effect="light"
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- for渲染二级权限 -->
                <el-row
                  :class="['vcenter', i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" prop="level" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click.native="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click.native="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
              ><el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click.native="showSetRightDialog(scope.row)"
                >分配权限</el-button
              ></el-tooltip
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="rolesDialogClosed"
    >
      <el-form
        :model="addRoles"
        label-width="80px"
        :rules="addRolesRules"
        ref="addRolesRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesNameInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="添加角色" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editRoles"
        label-width="80px"
        :rules="addRolesRules"
        ref="editRolesRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesName">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
          default-expand-all
          check-on-click-node
        :default-checked-keys="defKeys"
        :props="treeProps"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [], //角色列表数据
      rightsList: [], //分配权限数据
      roleId: "", //存储分配权限祖节点id
      addDialogVisible: false, //添加用户对话框
      editDialogVisible: false, //编辑对话框
      SetRightDialogVisible: false, //分配权限对话框
      addRoles: {
        //添加角色数据
        roleName: "",
        roleDesc: "",
      },
      editRoles: {}, //编辑角色数据
      /* 树形控件绑定对象 */
      treeProps: {
        children: "children",
        label: "authName",
      },
      /* 树形控件默认选中节点Id数组 */
      defKeys: [105, 116],
      addRolesRules: {
        /* 名称验证 */
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            trigger: "blur",
          },
        ],
        roleDesc: [
          /* 描述验证 */
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
    },

    /* 重置添加角色对话框表单 */
    rolesDialogClosed() {
      this.$refs.addRolesRef.resetFields();
    },
    /* 确定添加角色名称 */
    rolesNameInfo() {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", {
          roleName: this.addRoles.roleName,
          roleDesc: this.addRoles.roleDesc,
        });
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.$message.success("添加角色成功");
        this.getRolesList();
        this.addDialogVisible = false;
      });
    },
    /* 获取当前行角色数据 */
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) this.$message.error("获取角色失败");
      this.editRoles = res.data;
      this.editDialogVisible = true;
    },
    editRolesName() {
      this.$refs.editRolesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `roles/${this.editRoles.roleId}`,
          {
            roleName: this.editRoles.roleName,
            roleDesc: this.editRoles.roleDesc,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改角色失败");
        this.$message.success("修改角色成功");
        this.getRolesList(); //更新数据
        this.editDialogVisible = false;
      });
    },
    /* 删除角色 */
    async removeRolesById(id) {
      /* 删除用户弹框 */
      const confirmResult = await this.$confirm(
        "此操作将永久删除角色, 是否继续?",
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
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      //删除角色接口
      const { data: res } = await this.$http.delete(`roles/${id}`);
      if (res.meta.status !== 200) this.$message.error(res.meta.msg);
      this.$message.success("删除成功");
      this.getRolesList();
    },
    /* 删除权限 */
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("取消了删除");
      /* 删除权限数据接口 返回的数据是该行整个权限数据 */
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      //这里不建议使用this.getRolesList();更新数据，因为会重新渲染数据导致下拉收回
      //所以将整个权限的数据(res.data)再重新赋值给从标签获取的整个权限数据(role.children)，解决重新渲染的问题
      role.children = res.data;
      this.$message.success("删除成功");
    },
    /* 分配权限 */
    async showSetRightDialog(role) {
      this.roleId = role.id; //存储祖节点id
      //获取分配权限接口数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rightsList = res.data;
      //获取递归后的权限
      //此递归主要是为了记录已添加的权限，以便不被重新刷新掉
      this.getLeafKeys(role, this.defKeys); 
      this.SetRightDialogVisible = true;
    },
    /* 递归，获取三级权限的id值，并保存到defkeys中 */
    getLeafKeys(node, arr) {
      //如果当前节点没有子节点证明是三级权限，并将id存储
      if (!node.children) {
        return arr.push(node.id);
      }
      //若是一级或二级权限则继续递归
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    /* 监听分配权限对话框的关闭事件 */
    setRightDialogClosed() {
      this.defKeys = []; //关闭对话框后清空取消选中的复选框
    },
    /* 点击为角色分配权限 */
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      //角色授权接口数据
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success(res.meta.msg);
      this.getRolesList(); //更新权限数据
      this.SetRightDialogVisible = false;
    },
  },
  components: {},
};
</script>

<style  scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
