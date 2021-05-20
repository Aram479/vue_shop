<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        :rules="loginFormRules"
        :model="loginForm"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click.native="loginClick">登录</el-button>
          <el-button type="info" @click.native="resetClick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      /* 表单验证对象 */
      loginFormRules: {
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
      },
    };
  },
  methods: {
    /* 重置表单 若username和password默认有值则不会清空默认值 */
    resetClick() {
      this.$refs.loginFormRef.resetFields();
    },
    loginClick() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        //获取接口数据 ,data解构语法，表示获取接口数据中的data数据
        //login是接口地址，其中有两个参数username和password，必需要传入参数，所以后面紧跟this.loginForm
        const { data } = await this.$http.post("login", this.loginForm);
        //sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据
        window.sessionStorage.setItem("token", data.data.token);
        this.$router.push("/home");
        console.log(data.data.token)
        //data.meta.status: 200表示登陆成功，反之失败
        if (data.meta.status !== 200) {
          return this.$message.error("登录失败");
        } else {
          return this.$message.success("登录成功");
        }
      });
    },
  },

  components: {},
};
</script>

<style  scoped>
.login {
  height: 100vh;
  background-color: rgb(39, 74, 108);
}
.login_box {
  position: relative;
  width: 450px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  background: white;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 50%;
  padding: 6px;
  background-color: white;
  box-shadow: 0 0 10px #ddd;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  vertical-align: middle;
  text-align: center;
  border-radius: 50%;
  background-color: rgb(43, 75, 107);
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  top: 35%;
  right: 0;
  left: 0;
  padding: 0px 20px;
}
</style>
