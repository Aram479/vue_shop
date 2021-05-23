<template>
  <div id="home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="~assets/img/heima.png" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click.native="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 左侧边栏 -->
        <el-aside :width="isShow ? '64px':'200px'">
          <div class="toggle-button" @click="toggleClick">{{isShow?'⇒':'⇐'}}</div>
          <!-- 侧边栏子菜单区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isShow"
            :collapse-transition="false"
            router
            :default-active="routerPath"
          >
            <!-- 一级菜单 -->
            <!-- index + ''表示index不能存放数值，只能存放字符串  -->
            <el-submenu
              v-for="(item, index) in menulist"
              :key="item.id"
              :index="item.id + ''"
            >
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[index]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                v-for="subItem in item.children"
                :key="subItem.id"
                :index="'/'+subItem.path"
                @click.native="menuItemClick('/'+subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menulist: [],
      iconsObj: [
        "iconfont icon-user",
        "iconfont icon-tijikongjian",
        "iconfont icon-3702mima",
        "iconfont icon-danju",
        "iconfont icon-baobiao",
      ],
      isShow: false,
      elAsideWidth: "200px",
      routerPath:'',
    };
  },
  created() {
    this.getMenulist();
    this.routerPath = window.sessionStorage.getItem('activePath') //当组件创建时 将接口path值存入
  },
  methods: {
    /* 退出事件 */
    logout() {
      window.sessionStorage.clear(); //清空token
      this.$router.push("/login"); //跳转登录页面
    },
    /* 获取接口数据 */
    async getMenulist() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
    },
    toggleClick() {
      this.isShow = !this.isShow;
    },
    menuItemClick(activePath){ //点击二级菜单，将path接口数据存入sessionStorage
      window.sessionStorage.setItem('activePath',activePath)
      this.routerPath = activePath
    }
  },
  components: {},
};
</script>

<style scoped>
.home-container {
  height: 100vh;
}
.el-menu {
  border-right: none;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(55, 61, 65);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}
.el-header img {
  margin-right: 20px;
  vertical-align: middle;
}
.el-aside {
  background-color: rgb(51, 55, 68);
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  text-align: center;
  font-size: 20px;
  line-height: 24px;
  color: white;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
